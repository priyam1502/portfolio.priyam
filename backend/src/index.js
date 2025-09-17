import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import { initDatastores } from './lib/db.js';
import authRouter from './routes/auth.js';
import produceRouter from './routes/produce.js';
import ordersRouter from './routes/orders.js';
import analyticsRouter from './routes/analytics.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health
app.get('/health', (req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});

// Routers
app.use('/api/auth', authRouter);
app.use('/api/produce', produceRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/analytics', analyticsRouter);

const PORT = process.env.PORT || 4000;

async function start() {
  await initDatastores();
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

start();

