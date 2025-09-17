import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { initDatastores, db } from '../src/lib/db.js';

async function run() {
  await initDatastores();
  await db.users.remove({}, { multi: true });
  await db.produce.remove({}, { multi: true });
  await db.orders.remove({}, { multi: true });

  const farmer = await db.users.insert({
    name: 'Ramesh',
    phone: '9000000001',
    passwordHash: await bcrypt.hash('password', 10),
    role: 'farmer',
    location: 'Nashik',
  });

  const buyer = await db.users.insert({
    name: 'Sunita',
    phone: '9000000002',
    passwordHash: await bcrypt.hash('password', 10),
    role: 'buyer',
    location: 'Pune',
  });

  await db.produce.insert({
    farmerId: farmer._id,
    crop: 'Onion',
    pricePerUnit: 20,
    quantity: 50,
    unit: 'kg',
    imageUrl: '',
    createdAt: Date.now(),
  });

  console.log('Seeded demo users and produce.');
}

run();

