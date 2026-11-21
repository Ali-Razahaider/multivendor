import express from 'express';
import asyncHandler from 'express-async-handler';
import { isAuthenticated, isSeller, isAdmin } from '../middleware/authMiddleware.js';
import Order, { ORDER_STATUSES } from '../models/orderModel.js';
import Shop from '../models/shopModel.js';
import sendMail from '../utils/sendMail.js';
import { statusUpdateTemplate } from '../utils/emailTemplates.js';
import { buildQuote, round2, toCents } from '../utils/pricing.js';
import { createOrdersFromQuote, releaseStock, validateShippingAddress } from '../utils/orderService.js';
import { getStripe } from '../utils/stripe.js';

const router = express.Router();

const PLATFORM_FEE_RATE = Number(process.env.PLATFORM_FEE_RATE ?? 0.1);
const REFUND_STATUSES = ['Processing refund', 'Refund Success', 'Refund Rejected'];
const FULFILMENT_STATUSES = ORDER_STATUSES.filter((s) => !REFUND_STATUSES.includes(s));

const orderBelongsToShop = (order, shopId) =>
  String(order.shopId || '') === String(shopId) ||
  (!order.shopId && order.cart?.some((item) => String(item.shopId) === String(shopId)));

const shopOrderFilter = (shopId) => ({
  $or: [{ shopId: String(shopId) }, { shopId: { $exists: false }, 'cart.shopId': String(shopId) }],
});

const sellerEarnings = (order) => {
  const goods = order.subTotalPrice ? order.subTotalPrice - (order.discountPrice || 0) : order.totalPrice;
  return round2(Math.max(goods, 0) * (1 - PLATFORM_FEE_RATE));
};

const notifyStatus = (order) =>
  sendMail({
    email: order.user?.email,
    subject: `Order update: ${order.status}`,
    message: `Hello ${order.user?.name}, your order #${order._id} status has been updated to ${order.status}.`,
    html: statusUpdateTemplate(order.user?.name, order._id, order.status),
  });

// Cash on delivery checkout. Card payments go through /api/payment.
router.post(
  '/create-order',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const shippingAddress = validateShippingAddress(req.body.shippingAddress);
    const quote = await buildQuote(req.body.cart, req.body.couponCode);
    const orders = await createOrdersFromQuote({
      quote,
      user: req.user,
      shippingAddress,
      paymentInfo: { type: 'Cash On Delivery', status: 'pending' },
    });
    res.status(201).json({ success: true, orders });
  })
);

// Orders for the signed-in shopper. The :userId segment is kept for
// backwards compatibility but the session decides whose orders are returned.
const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    'user._id': { $in: [String(req.user._id), req.user._id] },
  }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, orders });
});
router.get('/my-orders', isAuthenticated, listMyOrders);
router.get('/get-all-orders/:userId', isAuthenticated, listMyOrders);

router.get(
  '/user-order/:id',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order || String(order.user?._id) !== String(req.user._id)) {
      res.status(404);
      throw new Error('Order not found');
    }
    res.json({ success: true, order });
  })
);

const listShopOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find(shopOrderFilter(req.shop._id)).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, orders });
});
router.get('/seller-orders', isSeller, listShopOrders);
router.get('/get-seller-all-orders/:shopId', isSeller, listShopOrders);

router.put(
  '/update-order-status/:id',
  isSeller,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!FULFILMENT_STATUSES.includes(status)) {
      res.status(400);
      throw new Error('Invalid order status');
    }

    const order = await Order.findById(req.params.id);
    if (!order || !orderBelongsToShop(order, req.shop._id)) {
      res.status(404);
      throw new Error('Order not found');
    }
    if (
      order.status === 'Delivered' ||
      order.status === 'Cancelled' ||
      REFUND_STATUSES.includes(order.status)
    ) {
      res.status(400);
      throw new Error(`This order is already ${order.status.toLowerCase()} and can't be changed`);
    }

    order.status = status;

    if (status === 'Cancelled') {
      await releaseStock(order.cart);
      if (order.paymentInfo?.type === 'Credit Card' && order.paymentInfo?.status === 'succeeded') {
        const refund = await getStripe().refunds.create({
          payment_intent: order.paymentInfo.id,
          amount: toCents(order.totalPrice),
        });
        order.refundId = refund.id;
        order.paymentInfo.status = 'refunded';
      }
    }

    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      if (order.paymentInfo?.type === 'Cash On Delivery') {
        order.paymentInfo.status = 'succeeded';
        order.paidAt = new Date();
      }
      if (!order.sellerCredited) {
        await Shop.updateOne({ _id: req.shop._id }, { $inc: { availableBalance: sellerEarnings(order) } });
        order.sellerCredited = true;
      }
    }

    await order.save();
    notifyStatus(order);

    res.status(200).json({ success: true, order });
  })
);

// Shopper asks for a refund on a delivered order.
router.put(
  '/order-refund/:id',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order || String(order.user?._id) !== String(req.user._id)) {
      res.status(404);
      throw new Error('Order not found');
    }
    if (order.status !== 'Delivered') {
      res.status(400);
      throw new Error('Refunds can be requested once an order has been delivered');
    }

    order.status = 'Processing refund';
    await order.save();

    res.status(200).json({
      success: true,
      order,
      message: 'Refund request sent to the seller',
    });
  })
);

// Seller approves or rejects a refund request.
router.put(
  '/order-refund-success/:id',
  isSeller,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!['Refund Success', 'Refund Rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid refund status');
    }
    const order = await Order.findById(req.params.id);
    if (!order || !orderBelongsToShop(order, req.shop._id)) {
      res.status(404);
      throw new Error('Order not found');
    }
    if (order.status.toLowerCase() !== 'processing refund') {
      res.status(400);
      throw new Error('There is no pending refund request for this order');
    }

    if (status === 'Refund Success') {
      if (order.paymentInfo?.type === 'Credit Card' && order.paymentInfo?.id && !order.refundId) {
        const refund = await getStripe().refunds.create({
          payment_intent: order.paymentInfo.id,
          amount: toCents(order.totalPrice),
        });
        order.refundId = refund.id;
        order.paymentInfo.status = 'refunded';
      }
      await releaseStock(order.cart);
      if (order.sellerCredited) {
        await Shop.updateOne({ _id: req.shop._id }, { $inc: { availableBalance: -sellerEarnings(order) } });
        order.sellerCredited = false;
      }
    }

    order.status = status;
    await order.save();
    notifyStatus(order);

    res.json({
      success: true,
      order,
      message: status === 'Refund Success' ? 'Refund issued' : 'Refund rejected',
    });
  })
);

router.get(
  '/seller-refund-orders/:shopId',
  isSeller,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({
      ...shopOrderFilter(req.shop._id),
      status: { $in: [...REFUND_STATUSES, 'Processing Refund'] },
    }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  })
);

router.get(
  '/admin-all-orders',
  isAdmin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  })
);

export default router;
