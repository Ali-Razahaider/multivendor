import express from 'express';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import user from './controllers/userController.js'
import shop from './controllers/shopController.js'
import product from './controllers/productController.js'
import event from './controllers/eventController.js'
import coupon from './controllers/couponController.js'
import order from './controllers/orderController.js'
import payment from './controllers/paymentController.js'
import withdraw from './controllers/withdrawController.js'
import conversation from './controllers/conversationController.js'
import message from './controllers/messageController.js'
import cors from 'cors';
const app = express();

// Config
if (process.env.NODE_ENV !== 'PRODUCTION') {
  dotenv.config({
    path: 'backend/config/.env',
  });
}

const allowedOrigins = ['http://localhost:5173'];
if (process.env.FRONTEND_URL) {
  const cleanUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
  allowedOrigins.push(cleanUrl);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      const cleanOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(cleanOrigin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.get('/', (req, res) => {
  res.send('Hello ');
});

// import routes
app.use('/api/user', user);
app.use('/api/shop', shop);
app.use('/api/product', product);
app.use('/api/event', event);
app.use('/api/coupon', coupon);
app.use('/api/order', order);
app.use('/api/payment', payment);
app.use('/api/withdraw', withdraw);
app.use('/api/conversation', conversation);
app.use('/api/message', message);

// error handling (traversy media)
app.use(notFound);
app.use(errorHandler);

export default app;
