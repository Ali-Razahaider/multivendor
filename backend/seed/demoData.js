// Showcase data on top of the catalog: shoppers, orders in every status,
// verified reviews, seller balances, coupons and chats. Demo accounts use the
// DEMO_DOMAIN email domain, so re-running is a no-op.

import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Coupon from '../models/couponModel.js';
import Shop from '../models/shopModel.js';
import Conversation from '../models/conversationModel.js';
import Messages from '../models/messageModel.js';

const DEMO_DOMAIN = 'demo.bazaarly.example.com';
const DAY = 24 * 60 * 60 * 1000;
const round2 = (n) => Math.round(n * 100) / 100;

// [name, email handle, randomuser.me portrait]
// prettier-ignore
const shoppers = [
  ['Demo Shopper', 'demo', 'women/44'], ['Olivia Carter', 'olivia', 'women/65'], ['Liam Nguyen', 'liam', 'men/32'],
  ['Sophia Patel', 'sophia', 'women/68'], ['Noah Kim', 'noah', 'men/75'], ['Emma Rossi', 'emma', 'women/12'],
  ['Ethan Brooks', 'ethan', 'men/41'], ['Ava Martinez', 'ava', 'women/29'], ['Mason Clarke', 'mason', 'men/22'],
  ['Isabella Chen', 'isabella', 'women/90'], ['Lucas Silva', 'lucas', 'men/86'], ['Mia Johnson', 'mia', 'women/57'],
];

// prettier-ignore
const addresses = [
  ['221 Valencia St', 'San Francisco', 'CA', '94103'], ['58 Bedford Ave', 'Brooklyn', 'NY', '11211'],
  ['1400 Pine St', 'Seattle', 'WA', '98101'], ['77 Congress Ave', 'Austin', 'TX', '78701'],
  ['310 Pearl St', 'Boulder', 'CO', '80302'], ['12 Newbury St', 'Boston', 'MA', '02116'],
].map(([address1, city, state, zipCode]) => ({ address1, address2: '', city, state, country: 'US', zipCode }));

// prettier-ignore
const comments = {
  5: ['Absolutely love it — exactly as described and arrived quickly.', 'Fantastic quality for the price. Would buy again!', 'Perfect gift, beautifully packaged.'],
  4: ['Really good overall, shipping took a day longer than expected.', 'Very happy with it. Slightly smaller than I imagined.'],
};

// Mostly delivered, some in flight, a few refunds and cancellations.
// prettier-ignore
const STATUSES = ['Delivered', 'Delivered', 'Delivered', 'Delivered', 'Delivered', 'On the way', 'Shipping',
  'Transferred to delivery partner', 'Processing', 'Processing refund', 'Refund Success', 'Cancelled'];

// prettier-ignore
const coupons = [['northwind', 'TECH10', 10, 100, 50], ['atelier', 'STYLE15', 15, 75, 40], ['glow', 'GLOW20', 20, 40, 25], ['paws', 'PAWS10', 10, 0, 0]];

// prettier-ignore
const chats = [
  ['northwind', 0, ['Hi! Does the Aero 14 come with a US charger?', 'Yes — it ships with a 65W USB-C charger and a US plug.', 'Perfect, ordering now. Thanks!']],
  ['paws', 0, ['Is the dog hoodie true to size for a corgi?', 'Most corgis fit a Medium. Happy to swap sizes if needed!']],
  ['glow', 1, ['Is the vitamin C serum OK for sensitive skin?', 'It’s fragrance-free; patch test first and start every other day.']],
];

// Deterministic PRNG so every run tells the same story.
let seed = 42;
const random = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
const pick = (arr) => arr[Math.floor(random() * arr.length)];

export const seedDemoData = async ({ shops, password }) => {
  if (await User.exists({ email: `demo@${DEMO_DOMAIN}` })) {
    console.log('Demo data already present, skipping');
    return;
  }

  const users = await User.create(
    shoppers.map(([name, handle, portrait], i) => ({
      name,
      email: `${handle}@${DEMO_DOMAIN}`,
      password,
      avatar: { public_id: 'demo', url: `https://randomuser.me/api/portraits/${portrait}.jpg` },
      addresses: [{ ...addresses[i % addresses.length], addressType: 'Home' }],
    }))
  );

  const shopIds = Object.values(shops).map((s) => String(s._id));
  const products = await Product.find({ shopId: { $in: shopIds } });
  const orders = [];
  const reviews = new Map();

  users.forEach((user, ui) => {
    for (let c = 0; c < (ui === 0 ? 5 : 3); c++) {
      const shopId = pick(shopIds);
      const pool = products.filter((p) => p.shopId === shopId);
      const cart = [...new Set([pick(pool), pick(pool)])].map((p) => {
        const qty = 1 + Math.floor(random() * 2);
        const unit = p.discountedPrice || p.price;
        return { _id: String(p._id), name: p.name, image: p.images[0], images: p.images.slice(0, 1), shopId, shopName: p.shop?.name, price: p.price, discountedPrice: unit, qty, lineTotal: round2(unit * qty) };
      });
      const subTotal = round2(cart.reduce((s, i) => s + i.lineTotal, 0));
      const createdAt = new Date(Date.now() - (4 + Math.floor(random() * 50)) * DAY);
      const status = STATUSES[orders.length % STATUSES.length];
      const delivered = ['Delivered', 'Processing refund', 'Refund Success'].includes(status);
      const card = random() < 0.65;

      if (status === 'Delivered') {
        for (const item of cart) {
          const rating = random() < 0.75 ? 5 : 4;
          const list = reviews.get(item._id) || [];
          if (list.some((r) => r.user._id === String(user._id))) continue;
          list.push({ user: { _id: String(user._id), name: user.name, avatar: user.avatar }, rating, comment: pick(comments[rating]), productId: item._id, createdAt: new Date(createdAt.getTime() + 5 * DAY) });
          reviews.set(item._id, list);
          item.isReviewed = true;
        }
      }

      orders.push({
        cart,
        shopId,
        shippingAddress: addresses[ui % addresses.length],
        user: { _id: String(user._id), name: user.name, email: user.email },
        subTotalPrice: subTotal,
        shippingPrice: round2(subTotal * 0.1),
        totalPrice: round2(subTotal * 1.1),
        status,
        paymentInfo: card
          ? { id: `pi_demo_${orders.length + 1}`, type: 'Credit Card', status: ['Refund Success', 'Cancelled'].includes(status) ? 'refunded' : 'succeeded' }
          : { type: 'Cash On Delivery', status: delivered ? 'succeeded' : 'pending' },
        paidAt: card || delivered ? createdAt : undefined,
        deliveredAt: delivered ? new Date(createdAt.getTime() + 4 * DAY) : undefined,
        sellerCredited: status === 'Delivered' || status === 'Processing refund',
        createdAt,
      });
    }
  });
  await Order.insertMany(orders);

  for (const [id, list] of reviews) {
    const product = products.find((p) => String(p._id) === id);
    product.reviews.push(...list);
    product.ratings = round2(product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length);
    await product.save({ validateBeforeSave: false });
  }

  // Credit delivered sales (minus the 10% platform fee) and add bank details.
  for (const shop of Object.values(shops)) {
    const earned = orders.filter((o) => o.shopId === String(shop._id) && o.sellerCredited).reduce((s, o) => s + o.subTotalPrice * 0.9, 0);
    await Shop.updateOne(
      { _id: shop._id },
      { $inc: { availableBalance: round2(earned) }, $set: { withdrawMethod: { bankName: 'First Demo Bank', branch: 'Main St', accountNumber: '****4821', accountName: shop.name } } }
    );
  }

  for (const [key, name, value, minAmount, maxAmount] of coupons) {
    const shop = shops[key];
    await Coupon.updateOne({ name }, { $setOnInsert: { name, value, minAmount, maxAmount, shopId: String(shop._id), shop: { name: shop.name, avatar: shop.avatar } } }, { upsert: true });
  }

  // Messages alternate shopper → shop.
  for (const [key, userIndex, thread] of chats) {
    const members = [String(users[userIndex]._id), String(shops[key]._id)];
    const conversation = await Conversation.create({ members, groupTitle: members.join(''), lastMessage: thread.at(-1), lastMessageId: members[(thread.length - 1) % 2] });
    await Messages.insertMany(thread.map((text, i) => ({ conversationId: String(conversation._id), sender: members[i % 2], text, createdAt: new Date(Date.now() - 6 * DAY + i * 37 * 60000) })));
  }

  console.log(`${users.length} shoppers, ${orders.length} orders, ${[...reviews.values()].flat().length} reviews, ${coupons.length} coupons, ${chats.length} chats`);
};
