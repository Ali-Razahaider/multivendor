import express from "express";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";
import { isAuthenticated, isSeller, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-product",
  isSeller,
  asyncHandler(async (req, res, next) => {
    const { name, description, price, images, category, countInStock, tags, discountedPrice } = req.body;

    if (!name || !description || !price || !category || countInStock === undefined) {
      res.status(400);
      throw new Error("Name, description, price, category, and stock are required");
    }

    const shop = req.shop;
    const product = await Product.create({
      name,
      description,
      price,
      images: images || [],
      category,
      countInStock,
      tags: tags || "",
      discountedPrice: discountedPrice || undefined,
      shopId: shop._id,
      shop: {
        name: shop.name,
        avatar: shop.avatar,
        ratings: shop.ratings || 0,
      },
    });

    res.status(201).json({ success: true, product });
  })
);

router.get(
  "/all",
  asyncHandler(async (req, res, next) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  })
);

router.get(
  "/shop/:shopId",
  asyncHandler(async (req, res, next) => {
    const products = await Product.find({ shopId: req.params.shopId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  })
);

router.put(
  "/create-new-review",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const { user, rating, comment, productId, orderId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const review = { user, rating, comment, productId };

    const isReviewed = product.reviews.find(
      (rev) => rev.user?._id === req.user._id
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user._id === req.user._id) {
          rev.rating = rating;
          rev.comment = comment;
          rev.user = user;
        }
      });
    } else {
      product.reviews.push(review);
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    await Order.findByIdAndUpdate(
      orderId,
      { $set: { "cart.$[elem].isReviewed": true } },
      { arrayFilters: [{ "elem._id": productId }], new: true }
    );

    res.status(200).json({
      success: true,
      message: "Reviewed successfully!",
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.status(200).json({ success: true, product });
  })
);

router.put(
  "/:id",
  isSeller,
  asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (product.shopId.toString() !== req.shop._id.toString()) {
      res.status(403);
      throw new Error("You can only update your own products");
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, product: updated });
  })
);

router.delete(
  "/:id",
  isSeller,
  asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (product.shopId.toString() !== req.shop._id.toString()) {
      res.status(403);
      throw new Error("You can only delete your own products");
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted" });
  })
);

router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin,
  asyncHandler(async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  })
);

export default router;
