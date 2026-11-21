import express from 'express';
import { isSeller, isAdmin } from '../middleware/authMiddleware.js';
import asyncHandler from 'express-async-handler';
import Withdraw from '../models/withdrawModel.js';
import Shop from '../models/shopModel.js';
import sendMail from '../utils/sendMail.js';
import { plainNoticeTemplate } from '../utils/emailTemplates.js';

const router = express.Router();

router.post(
  '/create-withdraw-request',
  isSeller,
  asyncHandler(async (req, res) => {
    const amount = Math.round(Number(req.body.amount) * 100) / 100;
    if (!Number.isFinite(amount) || amount < 10) {
      res.status(400);
      throw new Error('The minimum withdrawal is $10');
    }
    if (!req.shop.withdrawMethod) {
      res.status(400);
      throw new Error('Add a withdrawal method first');
    }

    // Atomically debit the balance so concurrent requests can't overdraw it.
    const shop = await Shop.findOneAndUpdate(
      { _id: req.shop._id, availableBalance: { $gte: amount } },
      { $inc: { availableBalance: -amount } },
      { returnDocument: 'after' }
    );
    if (!shop) {
      res.status(400);
      throw new Error('Insufficient balance');
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

    const withdraw = await Withdraw.create(data);

    sendMail({
      email: shop.email,
      subject: 'Withdrawal request received',
      message: `Hello ${shop.name}, your withdrawal request of $${amount} is processing. It usually takes 3–7 days.`,
      html: plainNoticeTemplate('Withdrawal request received', shop.name, `Your withdrawal request of $${amount.toFixed(2)} is processing. It usually takes 3–7 business days.`),
    });

    res.status(201).json({ success: true, withdraw });
  })
);

router.get(
  '/seller-withdraw-requests/:shopId',
  isSeller,
  asyncHandler(async (req, res) => {
    const withdraws = await Withdraw.find({ 'seller._id': { $in: [req.shop._id, String(req.shop._id)] } }).sort({ createdAt: -1 });
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
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      res.status(400);
      throw new Error('Status must be Approved or Rejected');
    }

    // Only pending requests can be decided, and only once.
    const withdraw = await Withdraw.findOneAndUpdate(
      { _id: req.params.id, status: { $nin: ['Approved', 'Rejected'] } },
      { status, updatedAt: Date.now() },
      { returnDocument: 'after' }
    );

    if (!withdraw) {
      res.status(404);
      throw new Error('Pending withdraw request not found');
    }

    const seller = await Shop.findById(withdraw.seller?._id);

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

    sendMail({
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
