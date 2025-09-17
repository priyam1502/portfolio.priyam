const express = require('express');
const { getDatabase } = require('../lib/db');
const { generateToken, hashPassword, verifyPassword } = require('../lib/auth');

const router = express.Router();

// Register (simple email/password or phone optional)
router.post('/register', async (req, res) => {
  try {
    const { role, name, email, password, phone, location } = req.body;
    if (!role || !['farmer', 'buyer'].includes(role)) return res.status(400).json({ error: 'role must be farmer or buyer' });
    if (!name) return res.status(400).json({ error: 'name required' });
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const db = getDatabase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'email already registered' });
    const passwordHash = await hashPassword(password);
    const stmt = db.prepare('INSERT INTO users (role, name, phone, email, password_hash, location) VALUES (?,?,?,?,?,?)');
    const info = stmt.run(role, name, phone || null, email, passwordHash, location || null);
    const user = { id: info.lastInsertRowid, role, name };
    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, role: user.role, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: 'login failed' });
  }
});

module.exports = router;

