import express from 'express';
import asyncHandler from 'express-async-handler';
import { isAuthenticated, isSeller } from '../middleware/authMiddleware.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

const router = express.Router();

// user used route
router.post(
  '/create-order',
  asyncHandler(async (req, res, next) => {
    const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

    const shopItemsMap = new Map();

    for (const item of cart) {
      const shopId = item.shopId;
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }
      shopItemsMap.get(shopId).push(item);
    }

    const orders = [];

    for (const [shopId, items] of shopItemsMap) {
      const order = await Order.create({
        cart: items,
        shippingAddress,
        user,
        totalPrice,
        paymentInfo,
      });
      orders.push(order);
    }

    for (const item of cart) {
      const product = await Product.findById(item._id);
      if (product) {
        product.countInStock -= item.qty;
        product.totalSell += item.qty;
        await product.save();
      }
    }

    res.status(201).json({
      success: true,
      orders,
    });
  })
);

// user used route
router.get(
  '/get-all-orders/:userId',
  asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ 'user._id': req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  })
);

// seller used route
router.get(
  '/get-seller-all-orders/:shopId',
  asyncHandler(async (req, res, next) => {
    const orders = await Order.find({
      'cart.shopId': req.params.shopId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  })
);

// seller used route
router.put(
  '/update-order-status/:id',
  isSeller,
  asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.status = req.body.status;

    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = 'Succeeded';
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
    });
  })
);

// user used route
router.put(
  '/order-refund/:id',
  asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.status = req.body.status;

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
      message: 'Order Refund Request sent successfully!',
    });
  })
);

export default router;
