import express from 'express';
import asyncHandler from 'express-async-handler';
import { isSeller, isAuthenticated } from '../middleware/authMiddleware.js';
import Conversation from '../models/conversationModel.js';

const router = express.Router();

// create a new conversation or return existing one — used by both user & seller
router.post(
  '/create-new-conversation',
  asyncHandler(async (req, res) => {
    const { groupTitle, userId, sellerId } = req.body;

    const existing = await Conversation.findOne({ groupTitle });

    if (existing) {
      res.json({ success: true, conversation: existing });
    } else {
      const conversation = await Conversation.create({
        members: [userId, sellerId],
        groupTitle,
      });
      res.status(201).json({ success: true, conversation });
    }
  })
);

// get all conversations for a seller — used by seller inbox
router.get(
  '/get-all-conversation-seller/:id',
  isSeller,
  asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
      members: { $in: [req.params.id] },
    }).sort({ updatedAt: -1, createdAt: -1 });

    res.json({ success: true, conversations });
  })
);

// get all conversations for a user — used by user inbox
router.get(
  '/get-all-conversation-user/:id',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
      members: { $in: [req.params.id] },
    }).sort({ updatedAt: -1, createdAt: -1 });

    res.json({ success: true, conversations });
  })
);

// update last message preview in conversation list — used by both user & seller when sending a message
router.put(
  '/update-last-message/:id',
  asyncHandler(async (req, res) => {
    const { lastMessage, lastMessageId } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
      lastMessage,
      lastMessageId,
    });

    res.json({ success: true, conversation });
  })
);

export default router;
