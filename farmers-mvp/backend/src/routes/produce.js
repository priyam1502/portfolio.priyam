import { Router } from 'express';
import { getDatabase } from '../lib/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Public browse with optional filters
router.get('/', (req, res) => {
	const { crop, location } = req.query;
	const db = getDatabase();
	let query = `SELECT p.*, u.name AS farmer_name, u.location AS farmer_location FROM produce p JOIN users u ON u.id = p.farmer_id`;
	const filters = [];
	const params = [];
	if (crop) {
		filters.push('p.crop LIKE ?');
		params.push(`%${crop}%`);
	}
	if (location) {
		filters.push('u.location LIKE ?');
		params.push(`%${location}%`);
	}
	if (filters.length) query += ' WHERE ' + filters.join(' AND ');
	query += ' ORDER BY p.created_at DESC';
	const list = db.prepare(query).all(...params);
	return res.json(list);
});

// Farmer creates a listing
router.post('/', requireAuth, requireRole('farmer'), (req, res) => {
	const { crop, price_per_unit, quantity_available, unit, image_url } = req.body;
	if (!crop || !price_per_unit || !quantity_available) return res.status(400).json({ error: 'missing fields' });
	const db = getDatabase();
	const stmt = db.prepare(`INSERT INTO produce (farmer_id, crop, price_per_unit, quantity_available, unit, image_url) VALUES (?,?,?,?,?,?)`);
	const result = stmt.run(req.user.id, crop, price_per_unit, quantity_available, unit || 'kg', image_url || null);
	const created = db.prepare('SELECT * FROM produce WHERE id = ?').get(result.lastInsertRowid);
	return res.status(201).json(created);
});

// Farmer updates own listing quantity/price
router.put('/:id', requireAuth, requireRole('farmer'), (req, res) => {
	const { id } = req.params;
	const { price_per_unit, quantity_available } = req.body;
	const db = getDatabase();
	const own = db.prepare('SELECT * FROM produce WHERE id = ? AND farmer_id = ?').get(id, req.user.id);
	if (!own) return res.status(404).json({ error: 'not found' });
	db.prepare('UPDATE produce SET price_per_unit = COALESCE(?, price_per_unit), quantity_available = COALESCE(?, quantity_available) WHERE id = ?')
		.run(price_per_unit ?? null, quantity_available ?? null, id);
	const updated = db.prepare('SELECT * FROM produce WHERE id = ?').get(id);
	return res.json(updated);
});

// Farmer deletes own listing
router.delete('/:id', requireAuth, requireRole('farmer'), (req, res) => {
	const { id } = req.params;
	const db = getDatabase();
	const own = db.prepare('SELECT * FROM produce WHERE id = ? AND farmer_id = ?').get(id, req.user.id);
	if (!own) return res.status(404).json({ error: 'not found' });
	db.prepare('DELETE FROM produce WHERE id = ?').run(id);
	return res.json({ ok: true });
});

export default router;