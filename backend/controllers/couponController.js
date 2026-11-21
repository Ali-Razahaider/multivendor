import express from 'express';
import Coupon from '../models/couponModel.js';
import asyncHandler from 'express-async-handler';
import { isSeller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-coupon', isSeller, asyncHandler(async (req, res, next) => {
    const name = String(req.body.name || '').trim();
    const value = Number(req.body.value);
    const minAmount = Number(req.body.minAmount) || 0;
    const maxAmount = Number(req.body.maxAmount) || 0;
    const selectedProduct = req.body.selectedProduct ? String(req.body.selectedProduct).trim() : undefined;

    if (!/^[A-Za-z0-9_-]{3,30}$/.test(name)) {
      res.status(400);
      throw new Error("Coupon codes must be 3–30 letters, numbers, dashes or underscores");
    }
    if (!Number.isFinite(value) || value <= 0 || value > 100) {
      res.status(400);
      throw new Error("Discount must be a percentage between 1 and 100");
    }
    if (minAmount < 0 || maxAmount < 0) {
      res.status(400);
      throw new Error("Amounts can't be negative");
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
      minAmount,
      maxAmount,
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
    const coupon = await Coupon.findOne({ name: String(req.params.name).trim() }).select('name value minAmount maxAmount shopId selectedProduct');
    res.status(200).json({ success: true, couponCode: coupon || null });
}))

router.get('/shop/:shopId', isSeller, asyncHandler(async (req, res, next) => {
    const coupons = await Coupon.find({ shopId: String(req.shop._id) }).sort({ createdAt: -1 });
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
