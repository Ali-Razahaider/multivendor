import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { activationSecret, frontendUrl } from '../config/env.js';
import sendMail from './sendMail.js';
import { activationTemplate, passwordResetTemplate } from './emailTemplates.js';

// Shared helpers for shopper and seller accounts.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MIN_PASSWORD_LENGTH = 8;
const RESET_TTL_MS = 30 * 60 * 1000;

export const normalizeEmail = (email) =>
  String(email || '')
    .trim()
    .toLowerCase();

// Case-insensitive lookups also match accounts created before emails were
// normalized.
export const EMAIL_COLLATION = { locale: 'en', strength: 2 };

export const assertValidEmail = (res, email) => {
  if (!EMAIL_RE.test(email) || email.length > 254) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }
};

export const assertStrongPassword = (res, password) => {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    res.status(400);
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  if (password.length > 72) {
    res.status(400);
    throw new Error('Password must be at most 72 characters');
  }
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    res.status(400);
    throw new Error('Password must include at least one letter and one number');
  }
};

// The activation link carries the pending account, so never put a plaintext
// password in it.
export const createActivationLink = async (payload, kind) => {
  const data = {
    ...payload,
    password: await bcrypt.hash(payload.password, 12),
    kind,
  };
  const token = jwt.sign(data, activationSecret(), { expiresIn: '30m' });
  return `${frontendUrl()}/activation/${token}${kind === 'shop' ? '?type=shop' : ''}`;
};

export const readActivationToken = (res, token, kind) => {
  let data;
  try {
    data = jwt.verify(String(token || ''), activationSecret());
  } catch {
    res.status(400);
    throw new Error('This activation link is invalid or has expired. Please sign up again.');
  }
  if (data.kind !== kind) {
    res.status(400);
    throw new Error('This activation link is not valid here');
  }
  const { iat, exp, kind: _kind, ...account } = data;
  return account;
};

export const sendActivationEmail = (name, email, url, what = 'account') =>
  sendMail({
    email,
    subject: `Activate your Bazaarly ${what}`,
    message: `Hello ${name}, please click the link to activate your ${what}: ${url}`,
    html: activationTemplate(name, url),
  });

const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const issuePasswordReset = async (account, kind) => {
  const token = crypto.randomBytes(32).toString('hex');
  account.resetPasswordToken = hashResetToken(token);
  account.resetPasswordTime = new Date(Date.now() + RESET_TTL_MS);
  await account.save({ validateBeforeSave: false });
  const url = `${frontendUrl()}/reset-password/${token}${kind === 'shop' ? '?type=shop' : ''}`;
  sendMail({
    email: account.email,
    subject: 'Reset your Bazaarly password',
    message: `Hello ${account.name}, reset your password here (valid for 30 minutes): ${url}`,
    html: passwordResetTemplate(account.name, url),
  });
};

export const findByResetToken = (Model, token) =>
  Model.findOne({
    resetPasswordToken: hashResetToken(String(token || '')),
    resetPasswordTime: { $gt: new Date() },
  }).select('+password +resetPasswordToken +resetPasswordTime');

// Same response whether or not the account exists, so emails can't be
// enumerated through the reset form.
export const RESET_SENT_MESSAGE = 'If an account exists for that email, a reset link is on its way.';
