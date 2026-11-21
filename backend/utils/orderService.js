import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import CheckoutSession from '../models/checkoutSessionModel.js';
import User from '../models/userModel.js';
import sendMail from './sendMail.js';
import { orderConfirmationTemplate } from './emailTemplates.js';
import { buildQuote, toCents, PricingError } from './pricing.js';
import { getStripe } from './stripe.js';

const ADDRESS_FIELDS = ['address1', 'address2', 'city', 'state', 'country', 'zipCode'];

export const validateShippingAddress = (input) => {
  const address = {};
  for (const field of ADDRESS_FIELDS) {
    const value = input?.[field];
    address[field] = value === undefined || value === null ? '' : String(value).trim().slice(0, 200);
  }
  const missing = ['address1', 'city', 'country', 'zipCode'].filter((f) => !address[f]);
  if (missing.length) {
    throw new PricingError('Please complete your shipping address');
  }
  return address;
};

export const buyerSnapshot = (user) => ({
  _id: String(user._id),
  name: user.name,
  email: user.email,
  phoneNumber: user.phoneNumber,
});

// Decrements stock only where enough is left; rolls back on partial failure.
const reserveStock = async (items) => {
  const reserved = [];
  for (const item of items) {
    const { modifiedCount } = await Product.updateOne(
      { _id: item._id, countInStock: { $gte: item.qty } },
      { $inc: { countInStock: -item.qty, totalSell: item.qty } }
    );
    if (modifiedCount !== 1) {
      await releaseStock(reserved);
      throw new PricingError(`"${item.name}" just sold out. Please review your cart.`);
    }
    reserved.push(item);
  }
};

export const releaseStock = async (items) => {
  for (const item of items) {
    await Product.updateOne({ _id: item._id }, { $inc: { countInStock: item.qty, totalSell: -item.qty } });
  }
};

/** Creates one order per shop from a priced quote. */
export const createOrdersFromQuote = async ({ quote, user, shippingAddress, paymentInfo }) => {
  const allItems = quote.shops.flatMap((g) => g.items);
  await reserveStock(allItems);

  const paid = paymentInfo.status === 'succeeded';
  let orders;
  try {
    orders = await Order.insertMany(
      quote.shops.map((g) => ({
        cart: g.items,
        shopId: g.shopId,
        shippingAddress,
        user: buyerSnapshot(user),
        subTotalPrice: g.subTotal,
        shippingPrice: g.shipping,
        discountPrice: g.discount,
        couponCode: g.couponCode,
        totalPrice: g.total,
        paymentInfo,
        paidAt: paid ? new Date() : undefined,
      }))
    );
  } catch (err) {
    await releaseStock(allItems);
    throw err;
  }

  sendMail({
    email: user.email,
    subject: 'Your Bazaarly order is confirmed',
    message: `Hello ${user.name}, your order has been placed successfully. Order ID: ${orders.map((o) => o._id).join(', ')}`,
    html: orderConfirmationTemplate(
      user.name,
      orders.map((o) => o._id).join(', '),
      quote.total.toFixed(2),
      allItems
    ),
  });

  return orders;
};

/**
 * Turns a succeeded PaymentIntent into orders exactly once. Safe to call
 * concurrently from the confirm endpoint and the webhook.
 */
export const finalizeCheckout = async (paymentIntentId) => {
  const existing = await CheckoutSession.findOne({ paymentIntentId });
  if (!existing) return { status: 'missing' };
  if (existing.status === 'completed') {
    return {
      status: 'completed',
      orders: await Order.find({ _id: { $in: existing.orderIds } }),
    };
  }
  if (existing.status === 'failed') return { status: 'failed', reason: existing.failureReason };

  const stripe = getStripe();
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (intent.status !== 'succeeded') return { status: 'unpaid', intentStatus: intent.status };

  // Claim the session so only one caller creates orders.
  const session = await CheckoutSession.findOneAndUpdate(
    { paymentIntentId, status: 'pending' },
    { status: 'finalizing' },
    { returnDocument: 'after' }
  );
  if (!session) {
    // Another request is finalizing; report its eventual state.
    const current = await CheckoutSession.findOne({ paymentIntentId });
    return {
      status: current.status === 'completed' ? 'completed' : 'finalizing',
      orders:
        current.status === 'completed' ? await Order.find({ _id: { $in: current.orderIds } }) : undefined,
    };
  }

  const fail = async (reason) => {
    session.status = 'failed';
    session.failureReason = reason;
    await session.save();
    // The customer paid but we can't fulfil: give the money back.
    await stripe.refunds
      .create({ payment_intent: paymentIntentId })
      .catch((err) => console.error(`Automatic refund failed for ${paymentIntentId}:`, err.message));
    return { status: 'failed', reason };
  };

  try {
    const user = await User.findById(session.userId);
    if (!user) return await fail('Account no longer exists');

    const quote = await buildQuote(session.cart, session.couponCode);
    if (toCents(quote.total) !== intent.amount_received || intent.amount_received !== session.amount) {
      return await fail('Prices changed during checkout');
    }

    const orders = await createOrdersFromQuote({
      quote,
      user,
      shippingAddress: session.shippingAddress,
      paymentInfo: {
        id: paymentIntentId,
        status: 'succeeded',
        type: 'Credit Card',
      },
    });
    session.status = 'completed';
    session.orderIds = orders.map((o) => String(o._id));
    await session.save();
    return { status: 'completed', orders };
  } catch (err) {
    if (err instanceof PricingError) return await fail(err.message);
    // Unexpected failure: release the claim so a retry (or the webhook) can finish.
    session.status = 'pending';
    await session.save();
    throw err;
  }
};
