import './config/env.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter, sanitizeInput } from './middleware/security.js';
import { isProduction } from './config/env.js';
import user from './controllers/userController.js';
import shop from './controllers/shopController.js';
import product from './controllers/productController.js';
import event from './controllers/eventController.js';
import coupon from './controllers/couponController.js';
import order from './controllers/orderController.js';
import payment from './controllers/paymentController.js';
import withdraw from './controllers/withdrawController.js';
import conversation from './controllers/conversationController.js';
import message from './controllers/messageController.js';

const app = express();

// Behind nginx / a cloud load balancer: trust the first proxy so secure
// cookies and rate limiting see the real client.
app.set('trust proxy', 1);
app.disable('x-powered-by');

export const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173'];
if (process.env.FRONTEND_URL) {
  for (const url of process.env.FRONTEND_URL.split(',')) {
    allowedOrigins.push(url.trim().replace(/\/$/, ''));
  }
}

app.use(
  helmet({
    // The API serves JSON only; images are loaded by the frontend from CDNs.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, health checks)
      if (!origin) return callback(null, true);
      callback(null, allowedOrigins.includes(origin.replace(/\/$/, '')));
    },
    credentials: true,
  })
);
app.use(compression());

// CSRF defence: auth cookies are SameSite=None in production, so refuse
// state-changing requests that a browser sent from an untrusted origin.
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (SAFE_METHODS.has(req.method) || !origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
    return next();
  }
  res.status(403).json({ success: false, message: 'Request origin not allowed' });
});

// Base64 image uploads (product photos, avatars) need a generous limit.
app.use(express.json({ limit: '15mb' }));
app.use(cookieParser());
app.use(sanitizeInput);

app.get('/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({ status: dbReady ? 'ok' : 'degraded', timestamp: Date.now() });
});

app.get('/', (req, res) => {
  res.json({ name: 'Bazaarly API', status: 'ok' });
});

if (isProduction) app.use('/api', apiLimiter);

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

app.use(notFound);
app.use(errorHandler);

export default app;
