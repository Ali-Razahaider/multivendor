import express from 'express';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';
import sendMail from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';

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
    const activationUrl = `http://localhost:8000/activation/${activation_token}`;

    await sendMail({
      email: user.email,
      subject: 'Activate your account',
      message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `please check your email:- ${user.email} to activate your account!`,
    });
  })
);

// activation of account and user creation
router.post(
  '/activation/:activation_token',
  asyncHandler(async (req, res, next) => {
    const { activation_token } = req.params;

    const newUser = jwt.verify(activation_token, process.env.JWT_SECRET);

    if (!newUser) {
      res.status(400);
      throw new Error('Invalid token');
    }

    const { name, email, password, avatar } = newUser;

    const user = await User.create({
      name,
      email,
      password,
      avatar,
    });

    generateToken(res, user._id);

    res.status(201).json({
      success: true,
      user,
    });
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
    //force select password to compare the hashed and entered password
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      generateToken(res, user._id);
      //set password to undefined to clear hashed password
      user.password = undefined;

      res.status(200).json({
        success: true,
        message: 'Login Successful',
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
export default router;
