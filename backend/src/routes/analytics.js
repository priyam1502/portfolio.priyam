import express from 'express';
import { db } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Farmer analytics: totals
router.get('/farmer', requireAuth, async (req, res) => {
  const farmerId = req.user.id;
  const orders = await db.orders.find({ farmerId });
  const totalOrders = orders.length;
  const totalSales = orders
    .filter((o) => o.status === 'accepted' || o.status === 'delivered')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0);
  // Most sold crop by quantity on accepted/delivered
  const cropQty = {};
  for (const o of orders) {
    if (o.status === 'accepted' || o.status === 'delivered') {
      const prod = await db.produce.findOne({ _id: o.produceId });
      if (prod) {
        cropQty[prod.crop] = (cropQty[prod.crop] || 0) + Number(o.quantity || 0);
      }
    }
  }
  const mostSoldCrop = Object.entries(cropQty).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  res.json({ totalOrders, totalSales, mostSoldCrop });
});

export default router;

