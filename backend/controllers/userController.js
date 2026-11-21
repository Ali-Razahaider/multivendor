import express from 'express';
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { clearAuthCookie } from '../utils/cookies.js';
import asyncHandler from 'express-async-handler';
import sendMail from '../utils/sendMail.js';
import { welcomeTemplate } from '../utils/emailTemplates.js';
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/security.js';
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

const DEFAULT_AVATAR = {
  public_id: 'default_avatar_id',
  url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
};

const findByEmail = (email) => User.findOne({ email }).collation(EMAIL_COLLATION);

router.post(
  '/register',
  authLimiter,
  asyncHandler(async (req, res) => {
    const name = String(req.body.name || '').trim();
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (name.length < 2 || name.length > 60) {
      res.status(400);
      throw new Error('Please enter your full name');
    }
    assertValidEmail(res, email);
    assertStrongPassword(res, password);

    if (await findByEmail(email)) {
      res.status(400);
      throw new Error('An account with this email already exists. Try signing in instead.');
    }

    const activationUrl = await createActivationLink({ name, email, password }, 'user');
    sendActivationEmail(name, email, activationUrl);

    res.status(201).json({
      success: true,
      message: `Please check your email (${email}) to activate your account.`,
    });
  })
);

router.post(
  '/activation',
  asyncHandler(async (req, res) => {
    const { name, email, password } = readActivationToken(res, req.body.activationToken, 'user');

    if (await findByEmail(email)) {
      res.status(400);
      throw new Error('This account is already active. Please sign in.');
    }

    const user = new User({
      name,
      email: normalizeEmail(email),
      password,
      avatar: DEFAULT_AVATAR,
    });
    user.$locals.passwordIsHashed = true;
    await user.save();

    generateToken(res, user._id);
    sendMail({
      email: user.email,
      subject: 'Welcome to Bazaarly',
      message: `Hello ${user.name}, welcome to Bazaarly! Your account has been activated.`,
      html: welcomeTemplate(user.name),
    });

    res.status(201).json({
      success: true,
      message: 'Account activated successfully!',
      user,
    });
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

    const user = await findByEmail(email).select('+password');
    if (!user || !(await user.comparePassword(String(password)))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    generateToken(res, user._id);
    res.status(200).json({ success: true, message: 'Login Successful', user });
  })
);

router.get(
  '/current',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: 'Current user', user: req.user });
  })
);

// No auth required: an expired session must still be able to clear its cookie.
router.post('/logout', (req, res) => {
  clearAuthCookie(res, 'auth_token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

router.post(
  '/forgot-password',
  authLimiter,
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email);
    assertValidEmail(res, email);
    const user = await findByEmail(email);
    if (user) await issuePasswordReset(user, 'user');
    res.json({ success: true, message: RESET_SENT_MESSAGE });
  })
);

router.post(
  '/reset-password/:token',
  authLimiter,
  asyncHandler(async (req, res) => {
    assertStrongPassword(res, req.body.password);
    const user = await findByResetToken(User, req.params.token);
    if (!user) {
      res.status(400);
      throw new Error('This reset link is invalid or has expired');
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;
    await user.save();
    generateToken(res, user._id);
    res.json({
      success: true,
      message: 'Password updated. You are now signed in.',
      user,
    });
  })
);

router.put(
  '/update-profile',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const { name, phoneNumber, oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (req.body.email !== undefined) {
      const email = normalizeEmail(req.body.email);
      if (email !== normalizeEmail(user.email)) {
        assertValidEmail(res, email);
        if (!oldPassword || !(await user.comparePassword(String(oldPassword)))) {
          res.status(401);
          throw new Error('Enter your current password to change your email');
        }
        if (await findByEmail(email)) {
          res.status(400);
          throw new Error('Email already in use');
        }
        user.email = email;
      }
    }

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (trimmed.length < 2 || trimmed.length > 60) {
        res.status(400);
        throw new Error('Please enter your full name');
      }
      user.name = trimmed;
    }
    if (phoneNumber !== undefined) user.phoneNumber = String(phoneNumber).trim().slice(0, 30);

    if (newPassword) {
      if (!oldPassword || !(await user.comparePassword(String(oldPassword)))) {
        res.status(401);
        throw new Error('Current password is incorrect');
      }
      assertStrongPassword(res, newPassword);
      user.password = newPassword;
    }

    await user.save();
    // Re-issue the session cookie: changing the password revokes older tokens.
    if (newPassword) generateToken(res, user._id);

    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  })
);

router.put(
  '/update-avatar',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const { avatar } = req.body;
    if (typeof avatar !== 'string' || !avatar.startsWith('data:image/')) {
      res.status(400);
      throw new Error('Please choose an image file');
    }

    const user = await User.findById(req.user._id);
    const myCloud = await cloudinary.uploader.upload(avatar, {
      folder: 'avatars',
      width: 300,
      crop: 'fill',
    });

    if (user.avatar?.public_id && user.avatar.public_id !== DEFAULT_AVATAR.public_id) {
      cloudinary.uploader.destroy(user.avatar.public_id).catch(() => {});
    }
    user.avatar = { public_id: myCloud.public_id, url: myCloud.secure_url };
    await user.save();

    res.status(200).json({ success: true, user });
  })
);

router.put(
  '/update-user-addresses',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const fields = ['country', 'state', 'city', 'address1', 'address2', 'zipCode', 'addressType'];
    const address = Object.fromEntries(
      fields.map((f) => [
        f,
        String(req.body[f] ?? '')
          .trim()
          .slice(0, 200),
      ])
    );

    if (!address.country || !address.city || !address.address1 || !address.zipCode || !address.addressType) {
      res.status(400);
      throw new Error('Please complete all required address fields');
    }
    if (user.addresses.some((a) => a.addressType === address.addressType)) {
      res.status(400);
      throw new Error(`You already have a ${address.addressType} address`);
    }
    if (user.addresses.length >= 10) {
      res.status(400);
      throw new Error('You can save up to 10 addresses');
    }

    user.addresses.push(address);
    await user.save();
    res.json({ success: true, user });
  })
);

router.delete(
  '/delete-user-address/:id',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { addresses: { _id: req.params.id } } },
      { returnDocument: 'after' }
    );
    res.json({ success: true, user });
  })
);

router.get(
  '/admin-all-users',
  isAdmin,
  asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  })
);

router.delete(
  '/admin-delete-user/:id',
  isAdmin,
  asyncHandler(async (req, res) => {
    if (String(req.params.id) === String(req.user._id)) {
      res.status(400);
      throw new Error("You can't delete your own admin account");
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({ success: true, message: 'User deleted successfully' });
  })
);

// Public profile used by chat. Only non-sensitive fields.
router.get(
  '/user-info/:id',
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(404);
      throw new Error('User not found');
    }
    const user = await User.findById(req.params.id).select('name avatar createdAt');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({ success: true, user });
  })
);

export default router;
