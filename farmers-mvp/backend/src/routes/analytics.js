import { Router } from 'express';
import { getDatabase } from '../lib/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/farmer', requireAuth, requireRole('farmer'), (req, res) => {
	const db = getDatabase();
	const totals = db.prepare(`
		SELECT
			COALESCE(SUM(CASE WHEN o.status = 'accepted' THEN o.quantity * o.unit_price ELSE 0 END), 0) AS total_sales,
			COUNT(*) AS total_orders,
			SUM(CASE WHEN o.status = 'pending' THEN 1 ELSE 0 END) AS pending_orders
		FROM orders o
		JOIN produce p ON p.id = o.produce_id
		WHERE p.farmer_id = ?
	`).get(req.user.id);
	return res.json(totals);
});

export default router;