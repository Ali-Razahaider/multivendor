import express from 'express';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import user from './controllers/userController.js';
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

// error handling (traversy media)
app.use(notFound);
app.use(errorHandler);

export default app;
