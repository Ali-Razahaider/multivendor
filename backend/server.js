import app from './app.js';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from './db/database.js';
import setupSocket from './socket/socketServer.js';
import { v2 as cloudinary } from 'cloudinary';

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server for handling uncaught exception');
  process.exit(1);
});

if (process.env.NODE_ENV !== 'PRODUCTION') {
  dotenv.config({
    path: 'backend/config/.env',
  });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();

const server = http.createServer(app);
setupSocket(server);

server.listen(process.env.PORT, () => {
  const url = process.env.BACKEND_URL || `http://localhost:${process.env.PORT}`;
  console.log(`Server is running on ${url}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log('Shutting down the server for unhandled promise rejection');
  server.close(() => {
    process.exit(1);
  });
});
