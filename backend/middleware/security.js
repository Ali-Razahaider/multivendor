import rateLimit from 'express-rate-limit';

// Strip MongoDB operator keys ($gt, $where, ...) and dotted paths from
// user-supplied objects so they can't be smuggled into queries.
const scrub = (value) => {
  if (Array.isArray(value)) return value.map(scrub);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete value[key];
      } else {
        value[key] = scrub(value[key]);
      }
    }
  }
  return value;
};

export const sanitizeInput = (req, res, next) => {
  if (req.body) scrub(req.body);
  if (req.params) scrub(req.params);
  // Express 5 exposes req.query as a getter; scrub in place.
  if (req.query) scrub(req.query);
  next();
};

const limiter = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message },
  });

export const apiLimiter = limiter(15 * 60 * 1000, 600, 'Too many requests, please slow down.');
export const authLimiter = limiter(
  15 * 60 * 1000,
  20,
  'Too many attempts, please try again in a few minutes.'
);
export const paymentLimiter = limiter(
  15 * 60 * 1000,
  40,
  'Too many payment attempts, please try again later.'
);
