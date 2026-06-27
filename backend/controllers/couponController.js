import express from 'express';
import Coupon from '../models/couponModel.js';
import asyncHandler from 'express-async-handler';
import { isSeller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-coupon', isSeller, asyncHandler(async (req, res, next) => {
    const { name, value, minAmount, maxAmount, selectedProduct } = req.body;

    if (!name || !value) {
      res.status(400);
      throw new Error("Coupon name and discount value are required");
    }

    const existing = await Coupon.findOne({ name });
    if (existing) {
      res.status(400);
      throw new Error("Coupon with this name already exists");
    }

    const shop = req.shop;
    const coupon = await Coupon.create({
      name,
      value,
      minAmount: minAmount || 0,
      maxAmount: maxAmount || 0,
      selectedProduct,
      shopId: shop._id,
      shop: {
        name: shop.name,
        avatar: shop.avatar,
      },
    });

    res.status(201).json({ success: true, coupon });
}))

router.get('/get-coupon-value/:name', asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findOne({ name: req.params.name });
    if (!coupon) {
      return res.status(200).json({ success: true, couponCode: null });
    }
    res.status(200).json({ success: true, couponCode: coupon });
}))

router.get('/shop/:shopId', asyncHandler(async (req, res, next) => {
    const coupons = await Coupon.find({ shopId: req.params.shopId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
}))

router.delete('/:id', isSeller, asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      res.status(404);
      throw new Error("Coupon not found");
    }

    if (coupon.shopId.toString() !== req.shop._id.toString()) {
      res.status(403);
      throw new Error("You can only delete your own coupons");
    }

    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Coupon deleted" });
}))

export default router;
