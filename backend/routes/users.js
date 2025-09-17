const express = require('express');
const { getDatabase } = require('../lib/db');

const router = express.Router();

// Get me
router.get('/me', (req, res) => {
  const db = getDatabase();
  const user = db.prepare('SELECT id, role, name, phone, email, location, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

module.exports = router;

