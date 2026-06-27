import express from 'express';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import user from './controllers/userController.js'
import shop from './controllers/shopController.js'
import product from './controllers/productController.js'
import event from './controllers/eventController.js'
import coupon from './controllers/couponController.js'
import cors from 'cors';
const app = express();

// Config
if (process.env.NODE_ENV !== 'PRODUCTION') {
  dotenv.config({
    path: 'backend/config/.env',
  });
}

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello ');
});

// import routes
app.use('/api/user', user);
app.use('/api/shop', shop);
app.use('/api/product', product);
app.use('/api/event', event);
app.use('/api/coupon', coupon);

// error handling (traversy media)
app.use(notFound);
app.use(errorHandler);

export default app;
