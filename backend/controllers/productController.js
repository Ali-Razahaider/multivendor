import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import asyncHandler from 'express-async-handler';
import { isAuthenticated, isSeller, isAdmin } from '../middleware/authMiddleware.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
const MAX_IMAGES = 6;

const sanitizeProduct = (p) => {
  const prod = typeof p.toObject === 'function' ? p.toObject() : { ...p };
  if (!Array.isArray(prod.images) || prod.images.length === 0) {
    prod.images = [DEFAULT_PRODUCT_IMAGE];
  } else {
    prod.images = prod.images.map((img) => {
      const url = typeof img === 'object' && img?.url ? img.url : img;
      if (
        !url ||
        typeof url !== 'string' ||
        url.includes('loremflickr') ||
        url.includes('localhost') ||
        url.startsWith('/uploads')
      ) {
        return DEFAULT_PRODUCT_IMAGE;
      }
      return url;
    });
  }
  return prod;
};

const uploadImages = async (images) => {
  const list = (Array.isArray(images) ? images : [images]).filter(Boolean).slice(0, MAX_IMAGES);
  const urls = [];
  for (const img of list) {
    if (typeof img !== 'string') continue;
    if (img.startsWith('data:image/')) {
      const result = await cloudinary.uploader.upload(img, {
        folder: 'products',
      });
      urls.push(result.secure_url);
    } else if (/^https:\/\//.test(img)) {
      // Already-hosted image being kept during an edit.
      urls.push(img);
    }
  }
  return urls;
};

// Validates and normalizes the editable product fields. `partial` allows
// updates that only touch some fields.
const readProductFields = (res, body, { partial = false } = {}) => {
  const fields = {};
  const fail = (message) => {
    res.status(400);
    throw new Error(message);
  };
  const has = (key) => body[key] !== undefined && body[key] !== null && body[key] !== '';

  if (has('name')) fields.name = String(body.name).trim().slice(0, 150);
  if (has('description')) fields.description = String(body.description).trim().slice(0, 5000);
  if (has('category')) fields.category = String(body.category).trim().slice(0, 80);
  if (body.tags !== undefined)
    fields.tags = String(body.tags ?? '')
      .trim()
      .slice(0, 300);

  if (has('price')) {
    fields.price = Number(body.price);
    if (!Number.isFinite(fields.price) || fields.price <= 0 || fields.price > 1_000_000)
      fail('Enter a valid price');
  }
  if (body.discountedPrice !== undefined) {
    if (body.discountedPrice === null || body.discountedPrice === '' || Number(body.discountedPrice) === 0) {
      fields.discountedPrice = undefined;
    } else {
      fields.discountedPrice = Number(body.discountedPrice);
      if (!Number.isFinite(fields.discountedPrice) || fields.discountedPrice <= 0)
        fail('Enter a valid sale price');
    }
  }
  if (has('countInStock')) {
    fields.countInStock = Number(body.countInStock);
    if (!Number.isInteger(fields.countInStock) || fields.countInStock < 0)
      fail('Stock must be a whole number');
  }

  if (!partial) {
    for (const key of ['name', 'description', 'category', 'price', 'countInStock']) {
      if (fields[key] === undefined) fail('Name, description, price, category, and stock are required');
    }
  }
  return fields;
};

router.post(
  '/create-product',
  isSeller,
  asyncHandler(async (req, res) => {
    const fields = readProductFields(res, req.body);
    if (fields.discountedPrice && fields.discountedPrice >= fields.price) {
      res.status(400);
      throw new Error('Sale price must be lower than the original price');
    }

    const shop = req.shop;
    const product = await Product.create({
      ...fields,
      images: await uploadImages(req.body.images),
      shopId: shop._id,
      shop: { _id: String(shop._id), name: shop.name, avatar: shop.avatar },
    });

    res.status(201).json({ success: true, product: sanitizeProduct(product) });
  })
);

router.get(
  '/all',
  asyncHandler(async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 }).limit(1000);
    res.status(200).json({ success: true, products: products.map(sanitizeProduct) });
  })
);

router.get(
  '/shop/:shopId',
  asyncHandler(async (req, res) => {
    const products = await Product.find({
      shopId: String(req.params.shopId),
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, products: products.map(sanitizeProduct) });
  })
);

// Declared before '/:id' so the literal path isn't swallowed by the param route.
router.get(
  '/admin-all-products',
  isAdmin,
  asyncHandler(async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products: products.map(sanitizeProduct) });
  })
);

// Only shoppers with a delivered order for the product can review it.
router.put(
  '/create-new-review',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const { productId, orderId } = req.body;
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment ?? '')
      .trim()
      .slice(0, 2000);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      res.status(400);
      throw new Error('Please choose a rating between 1 and 5');
    }
    if (!mongoose.isValidObjectId(productId)) {
      res.status(404);
      throw new Error('Product not found');
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const userId = String(req.user._id);
    const purchase = await Order.findOne({
      ...(mongoose.isValidObjectId(orderId) ? { _id: orderId } : {}),
      'user._id': { $in: [userId, req.user._id] },
      'cart._id': { $in: [String(productId), product._id] },
      status: 'Delivered',
    });
    if (!purchase) {
      res.status(403);
      throw new Error('You can review products after they have been delivered to you');
    }

    const reviewer = {
      _id: userId,
      name: req.user.name,
      avatar: req.user.avatar,
    };
    const existing = product.reviews.find((rev) => String(rev.user?._id) === userId);
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      existing.user = reviewer;
    } else {
      product.reviews.push({
        user: reviewer,
        rating,
        comment,
        productId: String(productId),
      });
    }
    product.ratings = product.reviews.reduce((sum, rev) => sum + rev.rating, 0) / product.reviews.length;
    await product.save({ validateBeforeSave: false });

    await Order.updateOne(
      { _id: purchase._id },
      { $set: { 'cart.$[elem].isReviewed': true } },
      {
        arrayFilters: [{ 'elem._id': { $in: [String(productId), product._id] } }],
      }
    );

    res.status(200).json({ success: true, message: 'Thanks for your review!' });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = mongoose.isValidObjectId(req.params.id) && (await Product.findById(req.params.id));
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.status(200).json({ success: true, product: sanitizeProduct(product) });
  })
);

router.put(
  '/:id',
  isSeller,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product || String(product.shopId) !== String(req.shop._id)) {
      res.status(404);
      throw new Error('Product not found');
    }

    const fields = readProductFields(res, req.body, { partial: true });
    if (req.body.images !== undefined) {
      const images = await uploadImages(req.body.images);
      if (images.length) fields.images = images;
    }

    const price = fields.price ?? product.price;
    const sale = 'discountedPrice' in fields ? fields.discountedPrice : product.discountedPrice;
    if (sale && sale >= price) {
      res.status(400);
      throw new Error('Sale price must be lower than the original price');
    }

    product.set(fields);
    if ('discountedPrice' in fields && fields.discountedPrice === undefined)
      product.discountedPrice = undefined;
    await product.save();

    res.status(200).json({ success: true, product: sanitizeProduct(product) });
  })
);

router.delete(
  '/:id',
  isSeller,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product || String(product.shopId) !== String(req.shop._id)) {
      res.status(404);
      throw new Error('Product not found');
    }
    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product deleted' });
  })
);

export default router;
