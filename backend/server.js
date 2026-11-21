import { validateEnv } from './config/env.js';
import app from './app.js';
import http from 'http';
import mongoose from 'mongoose';
import connectDB from './db/database.js';
import setupSocket from './socket/socketServer.js';
import { v2 as cloudinary } from 'cloudinary';

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception, shutting down:', err);
  process.exit(1);
});

validateEnv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

await connectDB();

const server = http.createServer(app);
setupSocket(server);

const port = process.env.PORT || 8000;
server.listen(port, () => {
  const url = process.env.BACKEND_URL || `http://localhost:${port}`;
  console.log(`Server is running on ${url}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received, closing server`);
  server.close(async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
  // Force exit if connections don't drain in time.
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection, shutting down:', err);
  server.close(() => process.exit(1));
});
