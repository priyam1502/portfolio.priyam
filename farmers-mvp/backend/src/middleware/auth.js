import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export function requireAuth(req, res, next) {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
	if (!token) return res.status(401).json({ error: 'missing token' });
	try {
		const payload = jwt.verify(token, JWT_SECRET);
		req.user = payload;
		return next();
	} catch (_e) {
		return res.status(401).json({ error: 'invalid token' });
	}
}

export function requireRole(role) {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ error: 'unauthorized' });
		if (req.user.role !== role) return res.status(403).json({ error: 'forbidden' });
		return next();
	};
}