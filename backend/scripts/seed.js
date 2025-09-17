/* eslint-disable no-console */
const { initDatabase, getDatabase } = require('../lib/db');
const { hashPassword } = require('../lib/auth');

async function run() {
  initDatabase();
  const db = getDatabase();

  // Clear existing minimal for idempotency (keep tables)
  db.exec('DELETE FROM orders; DELETE FROM produce; DELETE FROM users;');

  const farmerPass = await hashPassword('farmer123');
  const buyerPass = await hashPassword('buyer123');

  const insertUser = db.prepare('INSERT INTO users (role, name, phone, email, password_hash, location) VALUES (?,?,?,?,?,?)');
  const farmer = insertUser.run('farmer', 'Ramesh Farmer', '9999999999', 'farmer@example.com', farmerPass, 'Nashik, MH');
  const buyer = insertUser.run('buyer', 'Sunita Buyer', '8888888888', 'buyer@example.com', buyerPass, 'Pune, MH');

  const insertProduce = db.prepare('INSERT INTO produce (farmer_id, name, price_per_unit, quantity_available, unit, image_url, location) VALUES (?,?,?,?,?,?,?)');
  insertProduce.run(farmer.lastInsertRowid, 'Onion', 20, 50, 'kg', null, 'Nashik, MH');
  insertProduce.run(farmer.lastInsertRowid, 'Tomato', 18, 80, 'kg', null, 'Nashik, MH');

  console.log('Seed complete. Users: farmer@example.com/farmer123, buyer@example.com/buyer123');
}

run().then(() => process.exit(0));

