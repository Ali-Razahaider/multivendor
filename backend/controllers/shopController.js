import express from 'express';
import asyncHandler from 'express-async-handler';
import Shop from '../models/shopModel.js';
import { isAuthenticated, isSeller } from '../middleware/authMiddleware.js';
import sendShopToken from '../utils/sendShopToken.js';
import sendMail from '../utils/sendMail.js';
import { activationTemplate, welcomeTemplate } from '../utils/emailTemplates.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '10m',
    });
};

// create shop
router.post(
    '/create-shop',
    asyncHandler(async (req, res, next) => {
        const { name, email, password, phoneNumber, address, zipCode } = req.body;

        if (!name || !email || !password || !phoneNumber || !address || !zipCode) {
            res.status(400);
            throw new Error('All fields are required');
        }

        if (password.length < 6) {
            res.status(400);
            throw new Error('Password should be at least 6 characters long');
        }

        const existingShop = await Shop.findOne({ email });
        if (existingShop) {
            res.status(400);
            throw new Error('Shop with this email already exists');
        }

        const shopData = {
            name,
            email,
            password,
            phoneNumber,
            address,
            zipCode,
        };

        const activationToken = createActivationToken(shopData);
        const activationUrl = `http://localhost:5173/activation/${activationToken}?type=shop`;

        try {
            await sendMail({
                email: shopData.email,
                subject: 'Activate your shop',
                message: `Hello ${shopData.name}, please click on the link to activate your shop: ${activationUrl}`,
                html: activationTemplate(shopData.name, activationUrl),
            });
        } catch (mailErr) {
            res.status(500);
            throw new Error('Failed to send activation email');
        }

        res.status(201).json({
            success: true,
            message: `Please check your email:- ${shopData.email} to activate your shop!`,
        });
    })
);

// activate shop
router.post(
    '/activation',
    asyncHandler(async (req, res, next) => {
        const { activationToken } = req.body;

        let newShop;
        try {
            newShop = jwt.verify(activationToken, process.env.JWT_SECRET);
        } catch (err) {
            res.status(400);
            throw new Error('Invalid or expired activation token');
        }

        const existingShop = await Shop.findOne({ email: newShop.email });
        if (existingShop) {
            res.status(400);
            throw new Error('Shop already exists');
        }

        const shop = await Shop.create(newShop);

        sendShopToken(res, shop._id);
        try {
            await sendMail({
                email: shop.email,
                subject: 'Welcome to Our Platform',
                message: `Hello ${shop.name}, welcome to our platform! Your shop has been successfully activated. You can now log in and start managing your shop.`,
                html: welcomeTemplate(shop.name),
            });
        } catch (mailErr) {
            res.status(500);
            throw new Error('Failed to send welcome email');
        }

        res.status(201).json({
            success: true,
            message: 'Shop activated successfully!',
            shop,
        });
    })
);

// login shop
router.post(
    '/login',
    asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide email and password');
        }

        const shop = await Shop.findOne({ email }).select('+password');

        if (!shop) {
            res.status(401);
            throw new Error('Shop not found');
        }

        if (await shop.comparePassword(password)) {
            sendShopToken(res, shop._id);
            shop.password = undefined;
            res.status(200).json({
                success: true,
                message: 'Login successful',
                shop,
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    })
);

// get seller (for Redux loadSeller action)
router.get(
    '/getSeller',
    isSeller,
    asyncHandler(async (req, res, next) => {
        res.status(200).json({
            success: true,
            shop: req.shop,
        });
    })
);

// get shop info by ID (public)
router.get(
    '/get-shop-info/:id',
    asyncHandler(async (req, res, next) => {
        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            res.status(404);
            throw new Error('Shop not found');
        }
        res.status(200).json({ success: true, shop });
    })
);

// logout shop
router.post(
    '/logout',
    isSeller,
    asyncHandler(async (req, res, next) => {
        res.clearCookie('shop_token');
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    })
);

export default router;
