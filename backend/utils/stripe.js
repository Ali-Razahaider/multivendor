import Stripe from 'stripe';

let client;

export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    const err = new Error('Card payments are not configured');
    err.status = 503;
    throw err;
  }
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
};
