import app from './app.js';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from './db/database.js';
import setupSocket from './socket/socketServer.js';

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
