import express from 'express';
import { db } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Public: list all produce with farmer name/location
router.get('/', async (req, res) => {
  const items = await db.produce.find({}).sort({ createdAt: -1 });
  const farmerIds = [...new Set(items.map((i) => i.farmerId))];
  const farmers = await db.users.find({ _id: { $in: farmerIds } });
  const idToFarmer = Object.fromEntries(farmers.map((f) => [f._id, f]));
  const out = items.map((i) => ({
    id: i._id,
    crop: i.crop,
    pricePerUnit: i.pricePerUnit,
    quantity: i.quantity,
    unit: i.unit,
    imageUrl: i.imageUrl || '',
    farmer: idToFarmer[i.farmerId] ? { id: i.farmerId, name: idToFarmer[i.farmerId].name, location: idToFarmer[i.farmerId].location || '' } : null,
  }));
  res.json(out);
});

// Auth: create produce (farmer)
router.post('/', requireAuth, async (req, res) => {
  const { crop, pricePerUnit, quantity, unit, imageUrl } = req.body;
  if (!crop || pricePerUnit == null || quantity == null) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const doc = await db.produce.insert({
    farmerId: req.user.id,
    crop,
    pricePerUnit: Number(pricePerUnit),
    quantity: Number(quantity),
    unit: unit || 'kg',
    imageUrl: imageUrl || '',
    createdAt: Date.now(),
  });
  res.json({ id: doc._id });
});

// Auth: list my produce (farmer)
router.get('/mine', requireAuth, async (req, res) => {
  const items = await db.produce.find({ farmerId: req.user.id }).sort({ createdAt: -1 });
  res.json(items.map((i) => ({ id: i._id, crop: i.crop, pricePerUnit: i.pricePerUnit, quantity: i.quantity, unit: i.unit, imageUrl: i.imageUrl || '' })));
});

export default router;

