import express from 'express';
import asyncHandler from 'express-async-handler';
import Messages from '../models/messageModel.js';

const router = express.Router();

// send a new message — used by both user & seller via chat input
router.post(
  '/create-new-message',
  asyncHandler(async (req, res) => {
    const { conversationId, text, sender, images } = req.body;

    const message = await Messages.create({
      conversationId,
      text,
      sender,
      images: images || undefined,
    });

    res.status(201).json({ success: true, message });
  })
);

// get all messages in a conversation — used by both user & seller when opening a chat
router.get(
  '/get-all-messages/:id',
  asyncHandler(async (req, res) => {
    const messages = await Messages.find({
      conversationId: req.params.id,
    });

    res.json({ success: true, messages });
  })
);

export default router;
