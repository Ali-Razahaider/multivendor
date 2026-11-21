import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Shop from '../models/shopModel.js';
import jwt from 'jsonwebtoken';

const verify = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// Tokens issued before the last password change are no longer valid.
const issuedBeforePasswordChange = (decoded, account) =>
  account.passwordChangedAt && decoded.iat * 1000 < account.passwordChangedAt.getTime() - 1000;

const resolveUser = async (req) => {
  const decoded = req.cookies?.auth_token && verify(req.cookies.auth_token);
  if (!decoded?.userId) return null;
  const user = await User.findById(decoded.userId);
  if (!user || issuedBeforePasswordChange(decoded, user)) return null;
  return user;
};

const resolveShop = async (req) => {
  const decoded = req.cookies?.shop_token && verify(req.cookies.shop_token);
  if (!decoded?.shopId) return null;
  const shop = await Shop.findById(decoded.shopId);
  if (!shop || issuedBeforePasswordChange(decoded, shop)) return null;
  return shop;
};

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const user = await resolveUser(req);
  if (!user) {
    res.status(401);
    throw new Error('Please sign in to continue');
  }
  req.user = user;
  next();
});

const isSeller = asyncHandler(async (req, res, next) => {
  const shop = await resolveShop(req);
  if (!shop) {
    res.status(401);
    throw new Error('Please sign in to your shop to continue');
  }
  req.shop = shop;
  next();
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const user = await resolveUser(req);
  if (!user) {
    res.status(401);
    throw new Error('Please sign in to continue');
  }
  if (user.role !== 'admin') {
    res.status(403);
    throw new Error('Admin access only');
  }
  req.user = user;
  next();
});

// Chat endpoints are shared by shoppers and sellers. Attaches whichever
// identities the request carries; at least one is required.
const isUserOrSeller = asyncHandler(async (req, res, next) => {
  const [user, shop] = await Promise.all([resolveUser(req), resolveShop(req)]);
  if (!user && !shop) {
    res.status(401);
    throw new Error('Please sign in to continue');
  }
  req.user = user || undefined;
  req.shop = shop || undefined;
  next();
});

export { isAuthenticated, isSeller, isAdmin, isUserOrSeller, verify as verifyToken };
