import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
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
export default isAuthenticated;
