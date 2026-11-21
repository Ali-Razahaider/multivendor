import mongoose from 'mongoose';

export const ORDER_STATUSES = [
  'Processing',
  'Transferred to delivery partner',
  'Shipping',
  'Received',
  'On the way',
  'Delivered',
  'Cancelled',
  'Processing refund',
  'Refund Success',
  'Refund Rejected',
];

const orderSchema = new mongoose.Schema({
  // Snapshot of purchased items (name, image, unit price at time of purchase).
  cart: {
    type: Array,
    required: true,
  },
  shopId: {
    type: String,
    index: true,
  },
  shippingAddress: {
    type: Object,
    required: true,
  },
  // Snapshot of the buyer's public details.
  user: {
    type: Object,
    required: true,
  },
  subTotalPrice: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  discountPrice: { type: Number, default: 0 },
  couponCode: { type: String },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    // Validated in the controller so legacy documents with older status
    // spellings can still be saved.
    type: String,
    default: 'Processing',
  },
  paymentInfo: {
    id: { type: String, index: true },
    status: { type: String },
    type: { type: String },
  },
  // Seller earnings are credited exactly once, on delivery.
  sellerCredited: { type: Boolean, default: false },
  refundId: { type: String },
  paidAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.index({ 'user._id': 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
