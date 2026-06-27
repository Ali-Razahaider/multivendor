import express from 'express';
import Events from '../models/eventModel.js';
import asyncHandler from 'express-async-handler';
import { isSeller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-event', isSeller, asyncHandler(async (req, res, next) => {
    const { name, description, price, images, category, startDate, endDate, countInStock, tags, discountedPrice } = req.body;

    if (!name || !description || !price || !category || !startDate || !endDate || countInStock === undefined) {
        res.status(400);
        throw new Error("Name, description, price, category, start/end date, and stock are required");
    }

    const shop = req.shop;
    const event = await Events.create({
        name,
        description,
        price,
        images: images || [],
        category,
        startDate,
        endDate,
        countInStock,
        tags: tags || "",
        discountedPrice: discountedPrice || undefined,
        shopId: shop._id,
        shop: {
            name: shop.name,
            avatar: shop.avatar,
            ratings: shop.ratings || 0,
        },
    });

    res.status(201).json({ success: true, event });
}))

router.get('/all', asyncHandler(async (req, res, next) => {
    const events = await Events.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, events });
}))

router.get('/shop/:shopId', asyncHandler(async (req, res, next) => {
    const events = await Events.find({ shopId: req.params.shopId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, events });
}))

router.get('/:id', asyncHandler(async (req, res, next) => {
    const event = await Events.findById(req.params.id);
    if (!event) {
        res.status(404);
        throw new Error("Event not found");
    }
    res.status(200).json({ success: true, event });
}))

router.put('/:id', isSeller, asyncHandler(async (req, res, next) => {
    const event = await Events.findById(req.params.id);
    if (!event) {
        res.status(404);
        throw new Error("Event not found");
    }

    if (event.shopId.toString() !== req.shop._id.toString()) {
        res.status(403);
        throw new Error("You can only update your own events");
    }

    const updated = await Events.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, event: updated });
}))

router.delete('/:id', isSeller, asyncHandler(async (req, res, next) => {
    const event = await Events.findById(req.params.id);
    if (!event) {
        res.status(404);
        throw new Error("Event not found");
    }

    if (event.shopId.toString() !== req.shop._id.toString()) {
        res.status(403);
        throw new Error("You can only delete your own events");
    }

    await Events.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Event deleted" });
}))

export default router;
