import { setAuthCookie } from './cookies.js';

const generateToken = (res, userId) =>
  setAuthCookie(res, 'auth_token', { userId });

export default generateToken;
