// Seeds the demo catalog plus showcase data (shoppers, orders, reviews,
// coupons, chats). Safe to re-run; existing records are left alone.
//
//   npm run seed                               # catalog + demo data
//   npm run seed -- --admin you@example.com    # also promote a user to admin
//
// Demo logins use SEED_PASSWORD (default Demo1234). Refuses to run with
// NODE_ENV=production unless --allow-production is passed.

import mongoose from 'mongoose';
import { isProduction } from '../config/env.js';
import Shop from '../models/shopModel.js';
import Product from '../models/productModel.js';
import Event from '../models/eventModel.js';
import User from '../models/userModel.js';
import { shops, products, events } from './catalog.js';
import { seedDemoData } from './demoData.js';

const args = process.argv.slice(2);
const password = process.env.SEED_PASSWORD || 'Demo1234';

if (isProduction && !args.includes('--allow-production')) {
  console.error('Refusing to seed with NODE_ENV=production. Pass --allow-production if you mean it.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_DB_URI);
console.log(`Seeding ${mongoose.connection.host}/${mongoose.connection.name}`);

const shopDocs = {};
for (const { key, ...fields } of shops) {
  shopDocs[key] = (await Shop.findOne({ email: fields.email })) || (await Shop.create({ ...fields, password }));
}
const snapshot = (shop) => ({ _id: String(shop._id), name: shop.name, avatar: shop.avatar });

for (const { shop, countInStock, ratings, totalSell, ...fields } of products) {
  await Product.updateOne(
    { shopId: String(shopDocs[shop]._id), name: fields.name },
    { $set: { ...fields, shop: snapshot(shopDocs[shop]) }, $setOnInsert: { countInStock, ratings, totalSell } },
    { upsert: true }
  );
}
for (const { shop, ...fields } of events) {
  await Event.updateOne(
    { shopId: String(shopDocs[shop]._id), name: fields.name },
    { $set: { ...fields, shop: snapshot(shopDocs[shop]), status: 'running' } },
    { upsert: true }
  );
}
console.log(`${shops.length} shops, ${products.length} products, ${events.length} events`);

await seedDemoData({ shops: shopDocs, password });

const adminEmail = args[args.indexOf('--admin') + 1];
if (args.includes('--admin') && adminEmail) {
  const user = await User.findOneAndUpdate({ email: adminEmail.toLowerCase() }, { role: 'admin' });
  console.log(user ? `Promoted ${user.email} to admin` : `No user found with email ${adminEmail}`);
}

console.log(`\nDemo logins (password ${password}): demo@demo.bazaarly.example.com, ${shops.map((s) => s.email).join(', ')}`);
await mongoose.disconnect();
