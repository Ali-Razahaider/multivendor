import express from 'express';
import dotenv from 'dotenv';

// Config
if (process.env.NODE_ENV !== 'PRODUCTION') {
  dotenv.config({
    path: 'backend/config/.env',
  });
}
const app = express();
export default app;
