import { Router } from 'express';
import { getDatabase } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Buyer places order
router.post('/', requireAuth, (req, res) => {
	const { produce_id, quantity } = req.body;
	if (!produce_id || !quantity) return res.status(400).json({ error: 'missing fields' });
	const db = getDatabase();
	const produce = db.prepare('SELECT * FROM produce WHERE id = ?').get(produce_id);
	if (!produce) return res.status(404).json({ error: 'produce not found' });
	if (quantity > produce.quantity_available) return res.status(400).json({ error: 'insufficient quantity' });
	const unitPrice = produce.price_per_unit;
	const buyerId = req.user.id;
	const result = db.prepare('INSERT INTO orders (produce_id, buyer_id, quantity, unit_price, status) VALUES (?,?,?,?,?)')
		.run(produce_id, buyerId, quantity, unitPrice, 'pending');
	// keep stock unchanged until accepted
	const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
	return res.status(201).json(order);
});

// Farmer view incoming orders for their produce
router.get('/farmer', requireAuth, (req, res) => {
	const db = getDatabase();
	const orders = db.prepare(`
		SELECT o.*, p.crop, p.farmer_id, u.name AS buyer_name
		FROM orders o
		JOIN produce p ON p.id = o.produce_id
		JOIN users u ON u.id = o.buyer_id
		WHERE p.farmer_id = ?
		ORDER BY o.created_at DESC
	`).all(req.user.id);
	return res.json(orders);
});

// Buyer view own orders
router.get('/buyer', requireAuth, (req, res) => {
	const db = getDatabase();
	const orders = db.prepare(`
		SELECT o.*, p.crop, u.name AS farmer_name
		FROM orders o
		JOIN produce p ON p.id = o.produce_id
		JOIN users u ON u.id = p.farmer_id
		WHERE o.buyer_id = ?
		ORDER BY o.created_at DESC
	`).all(req.user.id);
	return res.json(orders);
});

// Farmer accept/reject order
router.post('/:id/decision', requireAuth, (req, res) => {
	const { id } = req.params;
	const { decision } = req.body; // 'accept' or 'reject'
	if (!['accept', 'reject'].includes(decision)) return res.status(400).json({ error: 'invalid decision' });
	const db = getDatabase();
	const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
	if (!order) return res.status(404).json({ error: 'order not found' });
	const produce = db.prepare('SELECT * FROM produce WHERE id = ?').get(order.produce_id);
	if (!produce || produce.farmer_id !== req.user.id) return res.status(403).json({ error: 'forbidden' });
	if (order.status !== 'pending') return res.status(400).json({ error: 'already decided' });
	if (decision === 'accept') {
		if (order.quantity > produce.quantity_available) return res.status(400).json({ error: 'insufficient stock' });
		db.prepare('UPDATE produce SET quantity_available = quantity_available - ? WHERE id = ?').run(order.quantity, order.produce_id);
		db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('accepted', id);
	} else {
		db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('rejected', id);
	}
	const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
	return res.json(updated);
});

// Mock payment endpoint: mark as paid (no gateway)
router.post('/:id/pay', requireAuth, (req, res) => {
	const { id } = req.params;
	const db = getDatabase();
	const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
	if (!order) return res.status(404).json({ error: 'order not found' });
	if (order.buyer_id !== req.user.id) return res.status(403).json({ error: 'forbidden' });
	if (!['accepted', 'pending'].includes(order.status)) return res.status(400).json({ error: 'invalid status' });
	// For MVP, payment simply sets status to accepted if pending
	if (order.status === 'pending') {
		// do not adjust stock here; farmer accepts earlier
		db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('accepted', id);
	}
	const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
	return res.json({ ok: true, order: updated, payment: 'simulated' });
});

export default router;