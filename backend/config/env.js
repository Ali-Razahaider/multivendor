import dotenv from 'dotenv';
import { existsSync } from 'fs';

// Load .env only if present. Real environment variables (set by Docker,
// compose, or the cloud platform) always take precedence — dotenv never
// overrides them.
if (existsSync('backend/config/.env')) {
  dotenv.config({ path: 'backend/config/.env', quiet: true });
}

export const isProduction = ['production', 'PRODUCTION'].includes(process.env.NODE_ENV);

const REQUIRED = ['MONGO_DB_URI', 'JWT_SECRET'];
const RECOMMENDED_IN_PRODUCTION = [
  'FRONTEND_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_API_KEY',
  'STRIPE_WEBHOOK_SECRET',
];

export const validateEnv = () => {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  if (!isProduction) return;
  const unset = RECOMMENDED_IN_PRODUCTION.filter((key) => !process.env[key]);
  if (unset.length) {
    console.warn(`Not set: ${unset.join(', ')} — card payments, CORS or webhooks may not work.`);
  }
  if (process.env.JWT_SECRET.length < 32) {
    console.warn(
      'JWT_SECRET is shorter than 32 characters; rotate it to a long random value (openssl rand -hex 32).'
    );
  }
};

// Activation/reset links are signed with a key derived from JWT_SECRET so a
// session token can never be replayed as an activation token (and vice versa).
export const activationSecret = () => process.env.ACTIVATION_SECRET || `${process.env.JWT_SECRET}:activation`;

export const frontendUrl = () => (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
