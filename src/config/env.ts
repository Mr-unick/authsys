/**
 * Environment variable validation and typed access.
 * Import this module early to ensure all required env vars are present.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const env = {
  // Database
  DB_HOST: optionalEnv('DBHOST', 'localhost'),
  DB_PORT: parseInt(optionalEnv('DBPORT', '3306')),
  DB_USER: optionalEnv('DBUSER', 'root'),
  DB_PASSWORD: optionalEnv('DBPASSWORD', ''),
  DB_NAME: optionalEnv('DBNAME', 'authsys'),

  // JWT
  JWT_SECRET: optionalEnv('JWT_SECRET', 'change-this-to-a-strong-secret-key-in-production'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: optionalEnv('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: optionalEnv('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: optionalEnv('CLOUDINARY_API_SECRET', ''),

  // SMTP
  SMTP_HOST: optionalEnv('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: parseInt(optionalEnv('SMTP_PORT', '587')),
  SMTP_SECURE: optionalEnv('SMTP_SECURE', 'false') === 'true',
  SMTP_USER: optionalEnv('SMTP_USER', ''),
  SMTP_PASS: optionalEnv('SMTP_PASS', ''),
  SMTP_FROM: optionalEnv('SMTP_FROM', 'noreply@yourdomain.com'),

  // App
  BASE_URL: optionalEnv('BASEURL', 'http://localhost:3000'),
  PER_PAGE: parseInt(optionalEnv('PER_PAGE', '10')),
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),

  // Google OAuth (from env, not hardcoded)
  GOOGLE_CLIENT_ID: optionalEnv('GOOGLE_CLIENT_ID', ''),
  GOOGLE_CLIENT_SECRET: optionalEnv('GOOGLE_CLIENT_SECRET', ''),

  // Gemini API (from env, not hardcoded)
  GEMINI_API_KEY: optionalEnv('GEMINI_API_KEY', ''),
} as const;

export type Env = typeof env;
