import express from 'express';
import { db } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Place order (buyer)
// body: { produceId, quantity }
router.post('/', requireAuth, async (req, res) => {
  const { produceId, quantity } = req.body;
  if (!produceId || quantity == null) return res.status(400).json({ error: 'Missing fields' });
  const produce = await db.produce.findOne({ _id: produceId });
  if (!produce) return res.status(404).json({ error: 'Produce not found' });
  const orderQty = Number(quantity);
  if (orderQty <= 0) return res.status(400).json({ error: 'Invalid quantity' });
  const amount = orderQty * Number(produce.pricePerUnit);
  const order = await db.orders.insert({
    buyerId: req.user.id,
    farmerId: produce.farmerId,
    produceId,
    quantity: orderQty,
    unit: produce.unit || 'kg',
    pricePerUnit: produce.pricePerUnit,
    amount,
    status: 'pending',
    createdAt: Date.now(),
  });
  // simple notification emulation can be polled by farmer listing
  res.json({ id: order._id, amount });
});

// List my orders (buyer)
router.get('/mine', requireAuth, async (req, res) => {
  const orders = await db.orders.find({ buyerId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders.map((o) => ({ id: o._id, produceId: o.produceId, quantity: o.quantity, amount: o.amount, status: o.status, createdAt: o.createdAt })));
});

// Farmer: incoming orders
router.get('/incoming', requireAuth, async (req, res) => {
  const orders = await db.orders.find({ farmerId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders.map((o) => ({ id: o._id, buyerId: o.buyerId, produceId: o.produceId, quantity: o.quantity, amount: o.amount, status: o.status, createdAt: o.createdAt })));
});

// Farmer: accept/reject order
router.post('/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body; // 'accepted' | 'rejected' | 'delivered'
  const { id } = req.params;
  if (!['accepted', 'rejected', 'delivered'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const order = await db.orders.findOne({ _id: id });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.farmerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  await db.orders.update({ _id: id }, { $set: { status } });
  // reduce stock if accepted (simple demo behavior)
  if (status === 'accepted') {
    const p = await db.produce.findOne({ _id: order.produceId });
    if (p) {
      const newQty = Math.max(0, Number(p.quantity) - Number(order.quantity));
      await db.produce.update({ _id: p._id }, { $set: { quantity: newQty } });
    }
  }
  res.json({ ok: true });
});

export default router;

