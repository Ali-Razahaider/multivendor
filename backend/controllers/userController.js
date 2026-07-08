import express from 'express';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';
import sendMail from '../utils/sendMail.js';
import { activationTemplate, welcomeTemplate } from '../utils/emailTemplates.js';
import jwt from 'jsonwebtoken';
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post(
  '/register',
  asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const userEmail = await User.findOne({ email });

    if (userEmail) {
      res.status(400);
      throw new Error('User Already Exists!');
    }

    const user = {
      name,
      email,
      password,
      avatar: {
        public_id: 'default_avatar_id',
        url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      },
    };
    const activation_token = createActivationToken(user);
    const activationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/activation/${activation_token}`;

    sendMail({
      email: user.email,
      subject: 'Activate your account',
      message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      html: activationTemplate(user.name, activationUrl),
    }).catch(err => console.error('Email send failed:', err));

    res.status(201).json({
      success: true,
      message: `please check your email:- ${user.email} to activate your account!`,
    });
  })
);

// activation of account and user creation
router.post(
  '/activation',
  asyncHandler(async (req, res, next) => {
    const { activationToken } = req.body;

    const newUser = jwt.verify(activationToken, process.env.JWT_SECRET);

    if (!newUser) {
      res.status(400);
      throw new Error('Invalid token');
    }

    const { email } = newUser;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error('User already exists ');
    }

    const user = await User.create({
      ...newUser,
    });

    generateToken(res, user._id);

    await sendMail({
      email: user.email,
      subject: 'Welcome to Our Platform',
      message: `Hello ${user.name}, welcome to our platform! Your account has been activated successfully.`,
      html: welcomeTemplate(user.name),
    });

    res.status(201).json({
      success: true,
      message: 'Account activated successfully!',
      user,
    });
  })
);
//login user
router.post(
  '/login',
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }
    //force select password to compare the hashed and entered password
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      generateToken(res, user._id);
      //set password to undefined to clear hashed password
      user.password = undefined;

      res.status(200).json({
        success: true,
        message: 'Login Successful',
        user,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  })
);
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '10m',
  });
};

//Get current user
router.get(
  '/current',
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    res.status(200).json({
      success: true,
      message: 'Current user',
      user: req.user,
    });
  })
);

//logout user

router.post('/logout', isAuthenticated, asyncHandler(async (req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'PRODUCTION' || process.env.NODE_ENV === 'production';
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}))

//update user profile
router.put(
  '/update-profile',
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const { name, email, phoneNumber, oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email already in use');
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    if (newPassword) {
      if (!oldPassword) {
        res.status(400);
        throw new Error('Please provide your current password');
      }
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        res.status(401);
        throw new Error('Current password is incorrect');
      }
      user.password = newPassword;
    }

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
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
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({ success: true, message: 'User deleted successfully' });
  })
);

router.get(
  '/user-info/:id',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({ success: true, user });
  })
);

export default router;
