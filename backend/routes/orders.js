const express = require('express');
const { getDatabase } = require('../lib/db');

const router = express.Router();

// Buyer places order
router.post('/', (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'buyer') return res.status(403).json({ error: 'buyer only' });
  const { produce_id, quantity } = req.body;
  if (!produce_id || !quantity) return res.status(400).json({ error: 'produce_id and quantity required' });
  const db = getDatabase();
  const prod = db.prepare('SELECT * FROM produce WHERE id = ?').get(produce_id);
  if (!prod) return res.status(404).json({ error: 'produce not found' });
  if (prod.quantity_available < quantity) return res.status(400).json({ error: 'insufficient stock' });
  const total = Number((quantity * prod.price_per_unit).toFixed(2));
  const info = db.prepare('INSERT INTO orders (buyer_id, produce_id, quantity, total_amount, status) VALUES (?,?,?,?,?)')
    .run(user.id, produce_id, Number(quantity), total, 'PENDING');
  const created = db.prepare('SELECT * FROM orders WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

// Farmer: list incoming orders for their produce
router.get('/farmer', (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'farmer') return res.status(403).json({ error: 'farmer only' });
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT o.*, p.name AS produce_name, u.name AS buyer_name
    FROM orders o
    JOIN produce p ON p.id = o.produce_id
    JOIN users u ON u.id = o.buyer_id
    WHERE p.farmer_id = ?
    ORDER BY o.created_at DESC
  `).all(user.id);
  res.json(rows);
});

// Buyer: list own orders
router.get('/buyer', (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'buyer') return res.status(403).json({ error: 'buyer only' });
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT o.*, p.name AS produce_name
    FROM orders o JOIN produce p ON p.id = o.produce_id
    WHERE o.buyer_id = ?
    ORDER BY o.created_at DESC
  `).all(user.id);
  res.json(rows);
});

// Farmer: accept or reject order
router.post('/:id/status', (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'farmer') return res.status(403).json({ error: 'farmer only' });
  const { status } = req.body; // ACCEPTED or REJECTED or DELIVERED
  if (!['ACCEPTED', 'REJECTED', 'DELIVERED'].includes(status)) return res.status(400).json({ error: 'invalid status' });
  const db = getDatabase();
  const order = db.prepare(`
    SELECT o.*, p.farmer_id, p.quantity_available
    FROM orders o JOIN produce p ON p.id = o.produce_id WHERE o.id = ?
  `).get(req.params.id);
  if (!order) return res.status(404).json({ error: 'not found' });
  if (order.farmer_id !== user.id) return res.status(403).json({ error: 'not your order' });

  // If accepting, check stock again and reserve by deducting quantity
  if (status === 'ACCEPTED') {
    if (order.quantity > order.quantity_available) return res.status(400).json({ error: 'insufficient stock' });
    db.prepare('UPDATE produce SET quantity_available = quantity_available - ? WHERE id = ?')
      .run(order.quantity, order.produce_id);
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// Analytics for farmer
router.get('/farmer/analytics/summary', (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'farmer') return res.status(403).json({ error: 'farmer only' });
  const db = getDatabase();
  const totalSales = db.prepare(`
    SELECT IFNULL(SUM(o.total_amount), 0) AS total
    FROM orders o JOIN produce p ON p.id = o.produce_id
    WHERE p.farmer_id = ? AND o.status IN ('ACCEPTED','DELIVERED')
  `).get(user.id).total;
  const numOrders = db.prepare(`
    SELECT COUNT(*) AS count
    FROM orders o JOIN produce p ON p.id = o.produce_id
    WHERE p.farmer_id = ?
  `).get(user.id).count;
  res.json({ totalSales, numOrders });
});

module.exports = router;

