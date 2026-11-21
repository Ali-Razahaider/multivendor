import crypto from 'crypto';
import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Coupon from '../models/couponModel.js';

// Single source of truth for checkout maths. The browser only ever sends
// product ids and quantities; every price is read from the database here.

export const SHIPPING_RATE = Number(process.env.SHIPPING_RATE ?? 0.1);
export const FREE_SHIPPING_THRESHOLD = Number(process.env.FREE_SHIPPING_THRESHOLD ?? 0);
export const MAX_QTY_PER_ITEM = 20;

export const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
export const toCents = (n) => Math.round(n * 100);

export class PricingError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

export const unitPrice = (product) =>
  product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price
    ? product.discountedPrice
    : product.price;

const normalizeCart = (cart) => {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new PricingError('Your cart is empty');
  }
  const merged = new Map();
  for (const item of cart) {
    const id = String(item?._id ?? item?.productId ?? '');
    const qty = Number.parseInt(item?.qty, 10);
    if (!mongoose.isValidObjectId(id)) {
      throw new PricingError('Your cart contains an item that is no longer available');
    }
    if (!Number.isInteger(qty) || qty < 1) {
      throw new PricingError('Item quantities must be at least 1');
    }
    merged.set(id, (merged.get(id) || 0) + qty);
  }
  for (const qty of merged.values()) {
    if (qty > MAX_QTY_PER_ITEM) {
      throw new PricingError(`You can buy at most ${MAX_QTY_PER_ITEM} of a single item`);
    }
  }
  return merged;
};

const shippingFor = (subTotal) =>
  FREE_SHIPPING_THRESHOLD > 0 && subTotal >= FREE_SHIPPING_THRESHOLD ? 0 : round2(subTotal * SHIPPING_RATE);

/**
 * Builds a priced quote, split into one group per shop (each group becomes
 * its own order so sellers only see and get paid for their items).
 */
export const buildQuote = async (cart, couponCode) => {
  const quantities = normalizeCart(cart);
  const products = await Product.find({ _id: { $in: [...quantities.keys()] } });

  if (products.length !== quantities.size) {
    throw new PricingError('Some items in your cart are no longer available. Please review your cart.');
  }

  const groups = new Map();
  for (const product of products) {
    const qty = quantities.get(String(product._id));
    if (product.countInStock < qty) {
      throw new PricingError(
        product.countInStock > 0
          ? `Only ${product.countInStock} left of "${product.name}"`
          : `"${product.name}" is sold out`
      );
    }
    const price = unitPrice(product);
    const line = {
      _id: String(product._id),
      name: product.name,
      image: product.images?.[0] || null,
      images: product.images?.slice(0, 1) || [],
      shopId: String(product.shopId),
      shopName: product.shop?.name,
      price: product.price,
      discountedPrice: price,
      qty,
      lineTotal: round2(price * qty),
    };
    if (!groups.has(line.shopId)) {
      groups.set(line.shopId, {
        shopId: line.shopId,
        shopName: line.shopName,
        items: [],
        subTotal: 0,
      });
    }
    const group = groups.get(line.shopId);
    group.items.push(line);
    group.subTotal = round2(group.subTotal + line.lineTotal);
  }

  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({ name: String(couponCode).trim() });
    if (!coupon) throw new PricingError("That coupon code doesn't exist");
    const group = groups.get(String(coupon.shopId));
    if (!group) throw new PricingError('This coupon is not valid for the items in your cart');

    const eligible = coupon.selectedProduct
      ? group.items.filter((i) => i._id === coupon.selectedProduct)
      : group.items;
    const eligibleTotal = round2(eligible.reduce((s, i) => s + i.lineTotal, 0));
    if (eligibleTotal === 0) throw new PricingError('This coupon is not valid for the items in your cart');
    if (coupon.minAmount && eligibleTotal < coupon.minAmount) {
      throw new PricingError(
        `Spend at least $${coupon.minAmount} at ${group.shopName || 'this shop'} to use this coupon`
      );
    }
    let discount = round2((eligibleTotal * Math.min(Math.max(coupon.value, 0), 100)) / 100);
    if (coupon.maxAmount && coupon.maxAmount > 0) discount = Math.min(discount, coupon.maxAmount);
    group.discount = discount;
    group.couponCode = coupon.name;
  }

  const shops = [...groups.values()].map((g) => {
    const discount = g.discount || 0;
    const shipping = shippingFor(g.subTotal);
    return {
      ...g,
      discount,
      shipping,
      total: round2(Math.max(g.subTotal - discount, 0) + shipping),
    };
  });

  const summary = shops.reduce(
    (acc, g) => ({
      subTotal: round2(acc.subTotal + g.subTotal),
      shipping: round2(acc.shipping + g.shipping),
      discount: round2(acc.discount + g.discount),
      total: round2(acc.total + g.total),
    }),
    { subTotal: 0, shipping: 0, discount: 0, total: 0 }
  );

  return {
    shops,
    ...summary,
    itemCount: shops.reduce((n, g) => n + g.items.reduce((m, i) => m + i.qty, 0), 0),
    couponCode: coupon?.name || null,
    currency: 'usd',
  };
};

// A stable fingerprint of what is being bought, stored on the PaymentIntent
// so an order can only be created for exactly the cart that was paid for.
export const quoteFingerprint = (quote) => {
  const items = quote.shops
    .flatMap((g) => g.items.map((i) => `${i._id}x${i.qty}`))
    .sort()
    .join(',');
  return crypto
    .createHash('sha256')
    .update(`${items}|${quote.couponCode || ''}|${toCents(quote.total)}`)
    .digest('hex');
};
