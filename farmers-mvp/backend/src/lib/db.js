import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const databasePath = process.env.DATABASE_PATH || './data/app.db';
const dataDir = path.dirname(databasePath);

let dbInstance;

export function getDatabase() {
	if (!dbInstance) {
		if (!fs.existsSync(dataDir)) {
			fs.mkdirSync(dataDir, { recursive: true });
		}
		dbInstance = new Database(databasePath);
		dbInstance.pragma('journal_mode = WAL');
	}
	return dbInstance;
}

export async function ensureDatabaseInitialized() {
	const db = getDatabase();
	// Users table for both farmers and buyers
	db.prepare(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			role TEXT NOT NULL CHECK (role IN ('farmer','buyer')),
			name TEXT NOT NULL,
			phone TEXT UNIQUE,
			email TEXT UNIQUE,
			password_hash TEXT,
			location TEXT,
			created_at TEXT DEFAULT (datetime('now'))
		)
	`).run();

	// Produce listings
	db.prepare(`
		CREATE TABLE IF NOT EXISTS produce (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			farmer_id INTEGER NOT NULL,
			crop TEXT NOT NULL,
			price_per_unit REAL NOT NULL,
			quantity_available REAL NOT NULL,
			unit TEXT DEFAULT 'kg',
			image_url TEXT,
			created_at TEXT DEFAULT (datetime('now')),
			FOREIGN KEY (farmer_id) REFERENCES users(id)
		)
	`).run();

	// Orders
	db.prepare(`
		CREATE TABLE IF NOT EXISTS orders (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			produce_id INTEGER NOT NULL,
			buyer_id INTEGER NOT NULL,
			quantity REAL NOT NULL,
			unit_price REAL NOT NULL,
			status TEXT NOT NULL DEFAULT 'pending',
			created_at TEXT DEFAULT (datetime('now')),
			FOREIGN KEY (produce_id) REFERENCES produce(id),
			FOREIGN KEY (buyer_id) REFERENCES users(id)
		)
	`).run();
}