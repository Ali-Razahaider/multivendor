import express from 'express';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';

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

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: 'default_avatar_id',
        url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      },
    });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        success: true,
        user,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      generateToken(res, user._id);

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

export default router;
