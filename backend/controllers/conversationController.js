import express from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { isUserOrSeller, isSeller, isAuthenticated } from '../middleware/authMiddleware.js';
import Conversation from '../models/conversationModel.js';
import Shop from '../models/shopModel.js';

const router = express.Router();

// Ids the signed-in caller may act as (a shopper, a seller, or both).
export const callerIds = (req) => [req.user?._id, req.shop?._id].filter(Boolean).map(String);

export const findOwnConversation = async (req, res, id) => {
  const conversation = mongoose.isValidObjectId(id) && (await Conversation.findById(id));
  if (!conversation || !conversation.members.some((m) => callerIds(req).includes(String(m)))) {
    res.status(404);
    throw new Error('Conversation not found');
  }
  return conversation;
};

// A shopper starts (or reopens) a chat with a shop.
router.post(
  '/create-new-conversation',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const userId = String(req.user._id);
    const sellerId = String(req.body.sellerId || '');
    if (!mongoose.isValidObjectId(sellerId) || !(await Shop.exists({ _id: sellerId }))) {
      res.status(404);
      throw new Error('Shop not found');
    }

    const groupTitle = `${userId}${sellerId}`;
    const existing = await Conversation.findOne({
      members: { $all: [userId, sellerId] },
    });
    if (existing) {
      return res.json({ success: true, conversation: existing });
    }
    const conversation = await Conversation.create({
      members: [userId, sellerId],
      groupTitle,
    });
    res.status(201).json({ success: true, conversation });
  })
);

router.get(
  '/get-all-conversation-seller/:id',
  isSeller,
  asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
      members: { $in: [String(req.shop._id)] },
    }).sort({ updatedAt: -1, createdAt: -1 });
    res.json({ success: true, conversations });
  })
);

router.get(
  '/get-all-conversation-user/:id',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
      members: { $in: [String(req.user._id)] },
    }).sort({ updatedAt: -1, createdAt: -1 });
    res.json({ success: true, conversations });
  })
);

router.put(
  '/update-last-message/:id',
  isUserOrSeller,
  asyncHandler(async (req, res) => {
    const conversation = await findOwnConversation(req, res, req.params.id);
    const lastMessageId = String(req.body.lastMessageId || '');
    conversation.lastMessage = String(req.body.lastMessage ?? '').slice(0, 200);
    conversation.lastMessageId = callerIds(req).includes(lastMessageId) ? lastMessageId : callerIds(req)[0];
    await conversation.save();
    res.json({ success: true, conversation });
  })
);

export default router;
