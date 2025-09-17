const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

let dbInstance;

function getDatabase() {
  if (!dbInstance) {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const dbPath = path.join(dataDir, 'app.db');
    dbInstance = new Database(dbPath);
    dbInstance.pragma('journal_mode = WAL');
  }
  return dbInstance;
}

function initDatabase() {
  const db = getDatabase();
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL CHECK(role IN ('farmer','buyer')),
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT UNIQUE,
      password_hash TEXT,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS produce (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price_per_unit REAL NOT NULL,
      quantity_available REAL NOT NULL,
      unit TEXT DEFAULT 'kg',
      image_url TEXT,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(farmer_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer_id INTEGER NOT NULL,
      produce_id INTEGER NOT NULL,
      quantity REAL NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING','ACCEPTED','REJECTED','DELIVERED')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(buyer_id) REFERENCES users(id),
      FOREIGN KEY(produce_id) REFERENCES produce(id)
    );
  `);

  // trigger to update updated_at on orders
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS orders_updated_at
    AFTER UPDATE ON orders
    FOR EACH ROW BEGIN
      UPDATE orders SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);
}

module.exports = { getDatabase, initDatabase };

