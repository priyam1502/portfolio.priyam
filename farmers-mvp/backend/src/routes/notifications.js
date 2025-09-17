import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// naive in-memory store (resets on restart)
const notificationsByUser = new Map();

export function pushNotification(userId, message) {
	const list = notificationsByUser.get(userId) || [];
	list.unshift({ id: Date.now(), message, read: false, created_at: new Date().toISOString() });
	notificationsByUser.set(userId, list);
}

router.get('/', requireAuth, (req, res) => {
	const list = notificationsByUser.get(req.user.id) || [];
	return res.json(list);
});

router.post('/read-all', requireAuth, (req, res) => {
	const list = notificationsByUser.get(req.user.id) || [];
	list.forEach(n => { n.read = true; });
	notificationsByUser.set(req.user.id, list);
	return res.json({ ok: true });
});

export default router;