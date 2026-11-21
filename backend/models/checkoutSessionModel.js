import mongoose from 'mongoose';

// Holds everything needed to turn a successful card payment into orders.
// Finalized by whichever arrives first: the browser's confirmation call or
// the Stripe webhook.
const checkoutSessionSchema = new mongoose.Schema({
  paymentIntentId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  cart: [{ _id: String, qty: Number }],
  couponCode: { type: String },
  shippingAddress: { type: Object, required: true },
  amount: { type: Number, required: true }, // cents
  status: {
    type: String,
    enum: ['pending', 'finalizing', 'completed', 'failed'],
    default: 'pending',
  },
  orderIds: [{ type: String }],
  failureReason: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 },
});

export default mongoose.model('CheckoutSession', checkoutSessionSchema);
