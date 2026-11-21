import express from 'express';
import asyncHandler from 'express-async-handler';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { paymentLimiter } from '../middleware/security.js';
import CheckoutSession from '../models/checkoutSessionModel.js';
import Order from '../models/orderModel.js';
import { buildQuote, quoteFingerprint, toCents } from '../utils/pricing.js';
import { finalizeCheckout, validateShippingAddress } from '../utils/orderService.js';
import { getStripe } from '../utils/stripe.js';

const router = express.Router();

// Publishable key for Stripe.js (safe to expose).
router.get(
  '/stripeapikey',
  asyncHandler(async (req, res) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY || '' });
  })
);

// Live pricing for the checkout page. Prices always come from the database.
router.post(
  '/quote',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const quote = await buildQuote(req.body.cart, req.body.couponCode);
    res.json({ success: true, quote });
  })
);

// Creates a PaymentIntent for the server-computed total and remembers the
// checkout so it can be finalized after Stripe confirms the payment.
router.post(
  '/process',
  paymentLimiter,
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const shippingAddress = validateShippingAddress(req.body.shippingAddress);
    const quote = await buildQuote(req.body.cart, req.body.couponCode);
    const amount = toCents(quote.total);
    if (amount < 50) {
      res.status(400);
      throw new Error('Card payments must be at least $0.50');
    }

    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: quote.currency,
      payment_method_types: ['card'],
      receipt_email: req.user.email,
      description: `Bazaarly order (${quote.itemCount} item${quote.itemCount === 1 ? '' : 's'})`,
      metadata: {
        userId: String(req.user._id),
        fingerprint: quoteFingerprint(quote),
        couponCode: quote.couponCode || '',
      },
    });

    await CheckoutSession.create({
      paymentIntentId: intent.id,
      userId: String(req.user._id),
      cart: quote.shops.flatMap((g) => g.items.map((i) => ({ _id: i._id, qty: i.qty }))),
      couponCode: quote.couponCode || undefined,
      shippingAddress,
      amount,
    });

    res.status(200).json({
      success: true,
      client_secret: intent.client_secret,
      paymentIntentId: intent.id,
      quote,
    });
  })
);

// Called by the browser right after stripe.confirmCardPayment succeeds.
router.post(
  '/confirm',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const { paymentIntentId } = req.body;
    const session = await CheckoutSession.findOne({
      paymentIntentId: String(paymentIntentId || ''),
    });
    if (!session || session.userId !== String(req.user._id)) {
      res.status(404);
      throw new Error('Checkout not found');
    }

    const result = await finalizeCheckout(session.paymentIntentId);
    if (result.status === 'completed' || result.status === 'finalizing') {
      return res.status(result.status === 'completed' ? 201 : 202).json({
        success: true,
        status: result.status,
        orders: result.orders || [],
      });
    }
    if (result.status === 'failed') {
      res.status(409);
      throw new Error(`${result.reason}. Your payment has been refunded.`);
    }
    res.status(402);
    throw new Error('Payment has not completed yet');
  })
);

// Stripe → us. Mounted in app.js with a raw body parser.
export const stripeWebhook = async (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ message: 'Webhook not configured' });

  let event;
  try {
    event = getStripe().webhooks.constructEvent(req.body, req.headers['stripe-signature'], secret);
  } catch (err) {
    return res.status(400).json({
      message: `Webhook signature verification failed: ${err.message}`,
    });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await finalizeCheckout(event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled':
        await CheckoutSession.updateOne(
          { paymentIntentId: event.data.object.id, status: 'pending' },
          {
            status: 'failed',
            failureReason: event.data.object.last_payment_error?.message || 'Payment failed',
          }
        );
        break;
      case 'charge.refunded': {
        const intentId = event.data.object.payment_intent;
        if (event.data.object.refunded) {
          await Order.updateMany({ 'paymentInfo.id': intentId }, { 'paymentInfo.status': 'refunded' });
        }
        break;
      }
      default:
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error(`Webhook ${event.type} failed:`, err);
    // Non-2xx makes Stripe retry later.
    res.status(500).json({ message: 'Webhook handler failed' });
  }
};

export default router;
