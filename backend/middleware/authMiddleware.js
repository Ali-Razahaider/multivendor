import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Shop from '../models/shopModel.js';
import jwt from 'jsonwebtoken';

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const { auth_token } = req.cookies;
  if (!auth_token) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const userData = jwt.verify(auth_token, process.env.JWT_SECRET);
  const user = await User.findById(userData.userId);
  req.user = user;
  next();
});

const isSeller = asyncHandler(async (req, res, next) => {
  const { shop_token } = req.cookies;
  if (!shop_token) {
    res.status(401);
    throw new Error('Not authorized as seller');
  }
  const shopData = jwt.verify(shop_token, process.env.JWT_SECRET);
  const shop = await Shop.findById(shopData.shopId);
  if (!shop) {
    res.status(401);
    throw new Error('Seller not found');
  }
  req.shop = shop;
  next();
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { auth_token } = req.cookies;
  if (!auth_token) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const userData = jwt.verify(auth_token, process.env.JWT_SECRET);
  const user = await User.findById(userData.userId);
  if (!user || user.role !== 'admin') {
    res.status(403);
    throw new Error('Admin access only');
  }
  req.user = user;
  next();
});

export { isAuthenticated, isSeller, isAdmin };
