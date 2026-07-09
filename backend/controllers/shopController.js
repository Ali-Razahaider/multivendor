import express from 'express';
import asyncHandler from 'express-async-handler';
import Shop from '../models/shopModel.js';
import { isAuthenticated, isSeller, isAdmin } from '../middleware/authMiddleware.js';
import sendShopToken from '../utils/sendShopToken.js';
import sendMail from '../utils/sendMail.js';
import { activationTemplate, welcomeTemplate } from '../utils/emailTemplates.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

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
        const { name, email, password, phoneNumber, address, zipCode, avatar } = req.body;

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

        let avatarUrl;
        if (avatar) {
            const myCloud = await cloudinary.uploader.upload(avatar, {
                folder: 'avatars',
            });
            avatarUrl = myCloud.secure_url;
        }

        const shopData = {
            name,
            email,
            password,
            phoneNumber,
            address,
            zipCode,
            avatar: avatarUrl,
        };

        const activationToken = createActivationToken(shopData);
        const activationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/activation/${activationToken}?type=shop`;

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
        const isProduction = process.env.NODE_ENV === 'PRODUCTION' || process.env.NODE_ENV === 'production';
        res.clearCookie('shop_token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
        });
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    })
);

router.get(
    '/admin-all-sellers',
    isAdmin,
    asyncHandler(async (req, res) => {
        const sellers = await Shop.find().sort({ createdAt: -1 });
        res.json({ success: true, sellers });
    })
);

router.delete(
    '/admin-delete-seller/:id',
    isAdmin,
    asyncHandler(async (req, res) => {
        const shop = await Shop.findByIdAndDelete(req.params.id);
        if (!shop) {
            res.status(404);
            throw new Error('Seller not found');
        }
        res.json({ success: true, message: 'Seller deleted successfully' });
    })
);

router.put(
    '/update-shop',
    isSeller,
    asyncHandler(async (req, res) => {
        const { name, description, address, phoneNumber, zipCode } = req.body;
        const shop = await Shop.findById(req.shop._id);
        if (!shop) {
            res.status(404);
            throw new Error('Shop not found');
        }
        if (name) shop.name = name;
        if (description !== undefined) shop.description = description;
        if (address) shop.address = address;
        if (phoneNumber) shop.phoneNumber = phoneNumber;
        if (zipCode) shop.zipCode = zipCode;
        await shop.save();
        shop.password = undefined;
        res.json({ success: true, shop });
    })
);

router.put(
    '/update-shop-avatar',
    isSeller,
    asyncHandler(async (req, res) => {
        const { avatar } = req.body;
        if (!avatar) {
            res.status(400);
            throw new Error('No avatar provided');
        }
        const shop = await Shop.findById(req.shop._id);
        if (!shop) {
            res.status(404);
            throw new Error('Shop not found');
        }
        const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: 'avatars',
            width: 150,
        });
        shop.avatar = myCloud.secure_url;
        await shop.save();
        shop.password = undefined;
        res.json({ success: true, shop });
    })
);

router.put(
    '/update-payment-methods',
    isSeller,
    asyncHandler(async (req, res) => {
        const { withdrawMethod } = req.body;
        const seller = await Shop.findByIdAndUpdate(req.shop._id, { withdrawMethod }, { new: true });
        seller.password = undefined;
        res.json({ success: true, seller });
    })
);

router.delete(
    '/delete-withdraw-method',
    isSeller,
    asyncHandler(async (req, res) => {
        const seller = await Shop.findById(req.shop._id);
        if (!seller) {
            res.status(404);
            throw new Error('Seller not found');
        }
        seller.withdrawMethod = null;
        await seller.save();
        seller.password = undefined;
        res.json({ success: true, seller });
    })
);

export default router;
