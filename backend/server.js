import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './db/database.js';

// Handle Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server for handling uncaught exception');
  process.exit(1);
});

// Config
if (process.env.NODE_ENV !== 'PRODUCTION') {
  dotenv.config({
    path: 'backend/config/.env',
  });
}

// connect db
connectDB();

// create server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// Unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log('Shutting down the server for unhandled promise rejection');

  server.close(() => {
    process.exit(1);
  });
});
