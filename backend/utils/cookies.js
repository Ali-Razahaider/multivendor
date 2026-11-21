import jwt from 'jsonwebtoken';
import { isProduction } from '../config/env.js';

const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// Defaults suit a frontend and API on different HTTPS sites. When both are
// served from one origin (e.g. behind the bundled nginx), COOKIE_SAMESITE=lax
// is stricter; COOKIE_SECURE=false is only for plain-HTTP test servers.
export const cookieOptions = () => {
  const secure = process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : isProduction;
  const sameSite = process.env.COOKIE_SAMESITE || (secure ? 'none' : 'lax');
  return { httpOnly: true, secure, sameSite, path: '/' };
};

export const setAuthCookie = (res, name, payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie(name, token, { ...cookieOptions(), maxAge: MAX_AGE });
};

export const clearAuthCookie = (res, name) => {
  res.clearCookie(name, cookieOptions());
};
