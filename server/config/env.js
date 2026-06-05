const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];

const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`✗ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (isProduction) {
    if (!process.env.ALLOWED_ORIGIN) {
      console.error('✗ ALLOWED_ORIGIN is required when NODE_ENV=production');
      process.exit(1);
    }

    if (process.env.JWT_SECRET.length < 32) {
      console.error('✗ JWT_SECRET must be at least 32 characters in production');
      process.exit(1);
    }

    const indexPath = path.join(__dirname, '../../client/dist/index.html');
    if (!fs.existsSync(indexPath)) {
      console.error('✗ Production build not found. Run "npm run build" from the project root first.');
      process.exit(1);
    }
  }
};

const parseOrigins = () => {
  const raw = process.env.ALLOWED_ORIGIN || '';
  if (!raw) {
    return isProduction ? [] : true;
  }
  return raw.split(',').map((origin) => origin.trim()).filter(Boolean);
};

module.exports = {
  isProduction,
  isDevelopment,
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  allowedOrigins: parseOrigins(),
  validateEnv,
  generateJwtSecret: () => crypto.randomBytes(64).toString('hex')
};
