import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getDatabase } from '../lib/db.js';

dotenv.config();

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function createToken(user) {
	return jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', (req, res) => {
	const { role, name, phone, email, password, location } = req.body;
	if (!role || !['farmer', 'buyer'].includes(role)) return res.status(400).json({ error: 'role must be farmer or buyer' });
	if (!name) return res.status(400).json({ error: 'name required' });
	if (!phone && !email) return res.status(400).json({ error: 'phone or email required' });

	const db = getDatabase();
	const passwordHash = password ? bcrypt.hashSync(password, 10) : null;
	try {
		const stmt = db.prepare(`INSERT INTO users (role, name, phone, email, password_hash, location) VALUES (?,?,?,?,?,?)`);
		const result = stmt.run(role, name, phone || null, email || null, passwordHash, location || null);
		const user = { id: result.lastInsertRowid, role, name };
		const token = createToken(user);
		return res.json({ user, token });
	} catch (e) {
		if (String(e).includes('UNIQUE')) return res.status(409).json({ error: 'User already exists' });
		return res.status(500).json({ error: 'Failed to register' });
	}
});

router.post('/login', (req, res) => {
	const { phone, email, password } = req.body;
	if (!phone && !email) return res.status(400).json({ error: 'phone or email required' });
	const db = getDatabase();
	const user = db.prepare(`SELECT * FROM users WHERE phone = ? OR email = ?`).get(phone || null, email || null);
	if (!user) return res.status(404).json({ error: 'User not found' });
	if (user.password_hash) {
		if (!password) return res.status(400).json({ error: 'password required' });
		const ok = bcrypt.compareSync(password, user.password_hash);
		if (!ok) return res.status(401).json({ error: 'invalid credentials' });
	}
	const token = createToken(user);
	return res.json({ user: { id: user.id, role: user.role, name: user.name }, token });
});

export default router;