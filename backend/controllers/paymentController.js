import express from 'express';
import asyncHandler from 'express-async-handler';

const router = express.Router();

const stripeKey = process.env.STRIPE_SECRET_KEY;

router.post(
  '/process',
  asyncHandler(async (req, res) => {
    if (!stripeKey) {
      res.status(503);
      throw new Error('Payment not configured');
    }
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey);
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
      metadata: { company: 'Multivendor' },
    });
    res.status(200).json({ success: true, client_secret: myPayment.client_secret });
  })
);

router.get(
  '/stripeapikey',
  asyncHandler(async (req, res) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY || '' });
  })
);

export default router;
