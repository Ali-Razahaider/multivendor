import express from "express";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import { isSeller } from "../middleware/authMiddleware.js";

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

export default router;
