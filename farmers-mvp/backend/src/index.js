import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { ensureDatabaseInitialized } from './lib/db.js';
import authRouter from './routes/auth.js';
import produceRouter from './routes/produce.js';
import ordersRouter from './routes/orders.js';
import analyticsRouter from './routes/analytics.js';
import notificationsRouter from './routes/notifications.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
	res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/produce', produceRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/notifications', notificationsRouter);

const port = process.env.PORT || 4000;
await ensureDatabaseInitialized();
app.listen(port, () => {
	console.log(`API listening on http://localhost:${port}`);
});