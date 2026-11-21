import express from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Shop from '../models/shopModel.js';
import { isSeller, isAdmin } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/security.js';
import sendShopToken from '../utils/sendShopToken.js';
import { clearAuthCookie } from '../utils/cookies.js';
import sendMail from '../utils/sendMail.js';
import { welcomeTemplate } from '../utils/emailTemplates.js';
import {
  EMAIL_COLLATION,
  RESET_SENT_MESSAGE,
  assertStrongPassword,
  assertValidEmail,
  createActivationLink,
  findByResetToken,
  issuePasswordReset,
  normalizeEmail,
  readActivationToken,
  sendActivationEmail,
} from '../utils/accountAuth.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

const PUBLIC_SHOP_FIELDS = 'name avatar description address createdAt';
const findByEmail = (email) => Shop.findOne({ email }).collation(EMAIL_COLLATION);
const clean = (value, max = 200) =>
  String(value ?? '')
    .trim()
    .slice(0, max);
const isImageData = (value) => typeof value === 'string' && value.startsWith('data:image/');

router.post(
  '/create-shop',
  authLimiter,
  asyncHandler(async (req, res) => {
    const name = clean(req.body.name, 80);
    const email = normalizeEmail(req.body.email);
    const phoneNumber = clean(req.body.phoneNumber, 30);
    const address = clean(req.body.address);
    const zipCode = clean(req.body.zipCode, 20);
    const { password, avatar } = req.body;

    if (!name || !phoneNumber || !address || !zipCode) {
      res.status(400);
      throw new Error('All fields are required');
    }
    assertValidEmail(res, email);
    assertStrongPassword(res, password);

    if (await findByEmail(email)) {
      res.status(400);
      throw new Error('A shop with this email already exists');
    }

    let avatarUrl;
    if (avatar) {
      if (!isImageData(avatar)) {
        res.status(400);
        throw new Error('Shop logo must be an image');
      }
      const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: 'avatars',
        width: 300,
        crop: 'fill',
      });
      avatarUrl = myCloud.secure_url;
    }

    const activationUrl = await createActivationLink(
      {
        name,
        email,
        password,
        phoneNumber,
        address,
        zipCode,
        avatar: avatarUrl,
      },
      'shop'
    );
    sendActivationEmail(name, email, activationUrl, 'shop');

    res.status(201).json({
      success: true,
      message: `Please check your email (${email}) to activate your shop.`,
    });
  })
);

router.post(
  '/activation',
  asyncHandler(async (req, res) => {
    const data = readActivationToken(res, req.body.activationToken, 'shop');

    if (await findByEmail(data.email)) {
      res.status(400);
      throw new Error('This shop is already active. Please sign in.');
    }

    const shop = new Shop({
      name: data.name,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      address: data.address,
      zipCode: data.zipCode,
      ...(data.avatar ? { avatar: data.avatar } : {}),
    });
    shop.$locals.passwordIsHashed = true;
    await shop.save();

    sendShopToken(res, shop._id);
    sendMail({
      email: shop.email,
      subject: 'Your Bazaarly shop is live',
      message: `Hello ${shop.name}, your shop has been activated. You can now sign in and start selling.`,
      html: welcomeTemplate(shop.name),
    });

    res.status(201).json({ success: true, message: 'Shop activated successfully!', shop });
  })
);

router.post(
  '/login',
  authLimiter,
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const shop = await findByEmail(email).select('+password');
    if (!shop || !(await shop.comparePassword(String(password)))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    sendShopToken(res, shop._id);
    res.status(200).json({ success: true, message: 'Login successful', shop });
  })
);

router.post(
  '/forgot-password',
  authLimiter,
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email);
    assertValidEmail(res, email);
    const shop = await findByEmail(email);
    if (shop) await issuePasswordReset(shop, 'shop');
    res.json({ success: true, message: RESET_SENT_MESSAGE });
  })
);

router.post(
  '/reset-password/:token',
  authLimiter,
  asyncHandler(async (req, res) => {
    assertStrongPassword(res, req.body.password);
    const shop = await findByResetToken(Shop, req.params.token);
    if (!shop) {
      res.status(400);
      throw new Error('This reset link is invalid or has expired');
    }
    shop.password = req.body.password;
    shop.resetPasswordToken = undefined;
    shop.resetPasswordTime = undefined;
    await shop.save();
    sendShopToken(res, shop._id);
    res.json({
      success: true,
      message: 'Password updated. You are now signed in.',
      shop,
    });
  })
);

router.get(
  '/getSeller',
  isSeller,
  asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, shop: req.shop });
  })
);

// Public storefront details only — no email, balances or payout info.
router.get(
  '/get-shop-info/:id',
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(404);
      throw new Error('Shop not found');
    }
    const shop = await Shop.findById(req.params.id).select(PUBLIC_SHOP_FIELDS);
    if (!shop) {
      res.status(404);
      throw new Error('Shop not found');
    }
    res.status(200).json({ success: true, shop });
  })
);

router.post('/logout', (req, res) => {
  clearAuthCookie(res, 'shop_token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

router.get(
  '/admin-all-sellers',
  isAdmin,
  asyncHandler(async (req, res) => {
    const sellers = await Shop.find().sort({ createdAt: -1 });
    res.json({ success: true, sellers });
  })
);

router.delete(
  '/admin-delete-seller/:id',
  isAdmin,
  asyncHandler(async (req, res) => {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) {
      res.status(404);
      throw new Error('Seller not found');
    }
    res.json({ success: true, message: 'Seller deleted successfully' });
  })
);

router.put(
  '/update-shop',
  isSeller,
  asyncHandler(async (req, res) => {
    const shop = req.shop;
    const { name, description, address, phoneNumber, zipCode } = req.body;
    if (name) shop.name = clean(name, 80);
    if (description !== undefined) shop.description = clean(description, 2000);
    if (address) shop.address = clean(address);
    if (phoneNumber) shop.phoneNumber = clean(phoneNumber, 30);
    if (zipCode) shop.zipCode = clean(zipCode, 20);
    await shop.save();
    res.json({ success: true, shop });
  })
);

router.put(
  '/update-shop-avatar',
  isSeller,
  asyncHandler(async (req, res) => {
    const { avatar } = req.body;
    if (!isImageData(avatar)) {
      res.status(400);
      throw new Error('Please choose an image file');
    }
    const myCloud = await cloudinary.uploader.upload(avatar, {
      folder: 'avatars',
      width: 300,
      crop: 'fill',
    });
    req.shop.avatar = myCloud.secure_url;
    await req.shop.save();
    res.json({ success: true, shop: req.shop });
  })
);

router.put(
  '/update-payment-methods',
  isSeller,
  asyncHandler(async (req, res) => {
    const input = req.body.withdrawMethod || {};
    const withdrawMethod = {
      bankName: clean(input.bankName, 100),
      branch: clean(input.branch, 100),
      accountNumber: clean(input.accountNumber, 40),
      accountName: clean(input.accountName, 100),
    };
    if (!withdrawMethod.bankName || !withdrawMethod.accountNumber || !withdrawMethod.accountName) {
      res.status(400);
      throw new Error('Bank name, account number and holder name are required');
    }
    req.shop.withdrawMethod = withdrawMethod;
    await req.shop.save();
    res.json({ success: true, seller: req.shop });
  })
);

router.delete(
  '/delete-withdraw-method',
  isSeller,
  asyncHandler(async (req, res) => {
    req.shop.withdrawMethod = null;
    await req.shop.save();
    res.json({ success: true, seller: req.shop });
  })
);

export default router;
