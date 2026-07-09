import express from 'express';
import asyncHandler from 'express-async-handler';
import Messages from '../models/messageModel.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// send a new message — used by both user & seller via chat input
router.post(
  '/create-new-message',
  asyncHandler(async (req, res) => {
    const { conversationId, text, sender, images } = req.body;

    const messageData = {
      conversationId,
      text,
      sender,
    };

    if (images) {
      const myCloud = await cloudinary.uploader.upload(images, {
        folder: "messages",
      });
      messageData.images = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const message = await Messages.create(messageData);

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
