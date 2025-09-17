const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const { authenticateToken } = require('./lib/auth');
const { initDatabase } = require('./lib/db');

const authRoutes = require('./routes/auth');
const produceRoutes = require('./routes/produce');
const ordersRoutes = require('./routes/orders');
const usersRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Routes
app.use('/api/auth', authRoutes);
// produce has public GET endpoints; protected create/update under router
app.use('/api/produce', produceRoutes);
app.use('/api/orders', authenticateToken, ordersRoutes);
app.use('/api/users', authenticateToken, usersRoutes);

const PORT = process.env.PORT || 4000;

initDatabase();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});

