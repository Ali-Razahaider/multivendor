import express from 'express';
import asyncHandler from 'express-async-handler';
import Messages from '../models/messageModel.js';
import { isUserOrSeller } from '../middleware/authMiddleware.js';
import { callerIds, findOwnConversation } from './conversationController.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

router.post(
  '/create-new-message',
  isUserOrSeller,
  asyncHandler(async (req, res) => {
    const { conversationId, images } = req.body;
    const conversation = await findOwnConversation(req, res, conversationId);
    const text = String(req.body.text ?? '')
      .trim()
      .slice(0, 2000);

    // The sender must be the caller's identity within this conversation.
    const ids = callerIds(req);
    const sender = ids.includes(String(req.body.sender))
      ? String(req.body.sender)
      : ids.find((id) => conversation.members.map(String).includes(id));

    const messageData = {
      conversationId: String(conversation._id),
      text,
      sender,
    };

    if (images) {
      if (typeof images !== 'string' || !images.startsWith('data:image/')) {
        res.status(400);
        throw new Error('Attachments must be images');
      }
      const myCloud = await cloudinary.uploader.upload(images, {
        folder: 'messages',
      });
      messageData.images = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    } else if (!text) {
      res.status(400);
      throw new Error('Message cannot be empty');
    }

    const message = await Messages.create(messageData);
    res.status(201).json({ success: true, message });
  })
);

router.get(
  '/get-all-messages/:id',
  isUserOrSeller,
  asyncHandler(async (req, res) => {
    const conversation = await findOwnConversation(req, res, req.params.id);
    const messages = await Messages.find({
      conversationId: String(conversation._id),
    }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  })
);

export default router;
