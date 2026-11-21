import { isProduction } from '../config/env.js';

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode >= 400 ? res.statusCode : err.status || err.statusCode || 500;
  let message = typeof err === 'string' ? err : err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = `${Object.keys(err.keyValue || {}).join(', ') || 'Value'} already exists`;
  }

  if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Upload is too large';
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 400;
    message = 'This link is invalid or has expired';
  }

  if (statusCode >= 500) {
    console.error(err);
    // Never leak internals from unexpected failures in production.
    if (isProduction) message = 'Something went wrong. Please try again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export { notFound, errorHandler };
