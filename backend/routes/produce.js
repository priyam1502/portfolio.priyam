const express = require('express');
const { getDatabase } = require('../lib/db');
const { authenticateToken } = require('../lib/auth');

const router = express.Router();

// Public: list produce with farmer name
router.get('/', (req, res) => {
  const db = getDatabase();
  const q = req.query.q ? `%${req.query.q}%` : null;
  let rows;
  if (q) {
    rows = db.prepare(`
      SELECT p.*, u.name AS farmer_name, u.location AS farmer_location
      FROM produce p JOIN users u ON u.id = p.farmer_id
      WHERE p.name LIKE ?
      ORDER BY p.created_at DESC
    `).all(q);
  } else {
    rows = db.prepare(`
      SELECT p.*, u.name AS farmer_name, u.location AS farmer_location
      FROM produce p JOIN users u ON u.id = p.farmer_id
      ORDER BY p.created_at DESC
    `).all();
  }
  res.json(rows);
});

// Public: get single produce
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const row = db.prepare(`
    SELECT p.*, u.name AS farmer_name, u.location AS farmer_location
    FROM produce p JOIN users u ON u.id = p.farmer_id WHERE p.id = ?
  `).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });
  res.json(row);
});

// Protected: create produce (farmer only)
router.post('/', authenticateToken, (req, res) => {
  if (req.user.role !== 'farmer') return res.status(403).json({ error: 'farmer only' });
  const { name, price_per_unit, quantity_available, unit, image_url, location } = req.body;
  if (!name || price_per_unit == null || quantity_available == null) {
    return res.status(400).json({ error: 'name, price_per_unit, quantity_available required' });
  }
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO produce (farmer_id, name, price_per_unit, quantity_available, unit, image_url, location)
    VALUES (?,?,?,?,?,?,?)
  `);
  const info = stmt.run(req.user.id, name, Number(price_per_unit), Number(quantity_available), unit || 'kg', image_url || null, location || null);
  const created = db.prepare('SELECT * FROM produce WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

// Protected: update quantity/price (owner farmer)
router.put('/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'farmer') return res.status(403).json({ error: 'farmer only' });
  const { price_per_unit, quantity_available } = req.body;
  const db = getDatabase();
  const owned = db.prepare('SELECT * FROM produce WHERE id = ? AND farmer_id = ?').get(req.params.id, req.user.id);
  if (!owned) return res.status(404).json({ error: 'not found' });
  const newPrice = price_per_unit != null ? Number(price_per_unit) : owned.price_per_unit;
  const newQty = quantity_available != null ? Number(quantity_available) : owned.quantity_available;
  db.prepare('UPDATE produce SET price_per_unit = ?, quantity_available = ? WHERE id = ?').run(newPrice, newQty, req.params.id);
  const updated = db.prepare('SELECT * FROM produce WHERE id = ?').get(req.params.id);
  res.json(updated);
});

module.exports = router;

