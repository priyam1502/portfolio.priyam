import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../lib/db.js';

const router = express.Router();

function createToken(user) {
  const payload = { id: user._id, name: user.name, phone: user.phone, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
}

// Register: {name, phone, password, role: 'farmer'|'buyer', location}
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, role, location } = req.body;
    if (!name || !phone || !password || !role) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    if (!['farmer', 'buyer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.users.insert({ name, phone, passwordHash, role, location: location || '' });
    const token = createToken(user);
    res.json({ token, user: { id: user._id, name, phone, role, location: user.location } });
  } catch (err) {
    if (err?.errorType === 'uniqueViolated') {
      return res.status(409).json({ error: 'Phone already registered' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Login: {phone, password}
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = await db.users.findOne({ phone });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = createToken(user);
  res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, role: user.role, location: user.location || '' } });
});

export default router;

