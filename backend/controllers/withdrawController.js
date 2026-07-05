import express from 'express';
import { isSeller, isAdmin } from '../middleware/authMiddleware.js';
import asyncHandler from 'express-async-handler';
import Withdraw from '../models/withdrawModel.js';
import Shop from '../models/shopModel.js';
import sendMail from '../utils/sendMail.js';

const router = express.Router();

router.post(
  '/create-withdraw-request',
  isSeller,
  asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const shop = await Shop.findById(req.shop._id);

    if (!shop) {
      res.status(404);
      throw new Error('Shop not found');
    }

    const data = {
      seller: {
        _id: shop._id,
        name: shop.name,
        email: shop.email,
        avatar: shop.avatar,
      },
      amount,
    };

    await sendMail({
      email: shop.email,
      subject: 'Withdraw Request',
      message: `Hello ${shop.name}, Your withdraw request of $${amount} is processing. It will take 3days to 7days to process!`,
    });

    const withdraw = await Withdraw.create(data);

    shop.availableBalance = (shop.availableBalance || 0) - amount;
    await shop.save();

    res.status(201).json({ success: true, withdraw });
  })
);

router.get(
  '/seller-withdraw-requests/:shopId',
  isSeller,
  asyncHandler(async (req, res) => {
    const withdraws = await Withdraw.find({ 'seller._id': req.params.shopId }).sort({ createdAt: -1 });
    res.json({ success: true, withdraws });
  })
);

router.get(
  '/admin-all-withdraws',
  isAdmin,
  asyncHandler(async (req, res) => {
    const withdraws = await Withdraw.find().sort({ createdAt: -1 });
    res.json({ success: true, withdraws });
  })
);

router.put(
  '/update-withdraw-request/:id',
  isAdmin,
  asyncHandler(async (req, res) => {
    const { sellerId, status } = req.body;

    const withdraw = await Withdraw.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!withdraw) {
      res.status(404);
      throw new Error('Withdraw request not found');
    }

    const seller = await Shop.findById(sellerId);

    if (!seller) {
      res.status(404);
      throw new Error('Seller not found');
    }

    const transaction = {
      _id: withdraw._id,
      amount: withdraw.amount,
      updatedAt: withdraw.updatedAt,
      status: withdraw.status,
    };

    seller.transections = [...(seller.transections || []), transaction];

    if (status === 'Rejected') {
      seller.availableBalance = (seller.availableBalance || 0) + withdraw.amount;
    }

    await seller.save();

    await sendMail({
      email: seller.email,
      subject: status === 'Approved' ? 'Payment Confirmation' : 'Withdraw Request Rejected',
      message: status === 'Approved'
        ? `Hello ${seller.name}, Your withdraw request of $${withdraw.amount} is on the way. Delivery time depends on your bank's rules it usually takes 3days to 7days.`
        : `Hello ${seller.name}, Your withdraw request of $${withdraw.amount} has been rejected. The amount has been refunded to your available balance.`,
    });

    res.json({ success: true, withdraw });
  })
);

export default router;
