import path from 'path';
import fs from 'fs';
import Datastore from 'nedb-promises';

const dataDir = process.env.DATA_DIR || './data';

export const db = {
  users: null,
  produce: null,
  orders: null,
};

export async function initDatastores() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db.users = Datastore.create({ filename: path.join(dataDir, 'users.db'), autoload: true });
  db.produce = Datastore.create({ filename: path.join(dataDir, 'produce.db'), autoload: true });
  db.orders = Datastore.create({ filename: path.join(dataDir, 'orders.db'), autoload: true });

  await db.users.ensureIndex({ fieldName: 'phone', unique: true });
  await db.produce.ensureIndex({ fieldName: 'farmerId' });
  await db.orders.ensureIndex({ fieldName: 'buyerId' });
  await db.orders.ensureIndex({ fieldName: 'farmerId' });
}

export function isFarmer(user) {
  return user?.role === 'farmer';
}

export function isBuyer(user) {
  return user?.role === 'buyer';
}

