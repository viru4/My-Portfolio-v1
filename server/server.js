require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { isProduction, isDevelopment, port, allowedOrigins, validateEnv } = require('./config/env');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const compression = require('compression');
const rateLimit = require('express-rate-limit');

validateEnv();

const app = express();
const distPath = path.join(__dirname, '../client/dist');
const indexPath = path.join(distPath, 'index.html');
const uploadsPath = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

if (isProduction) {
  app.set('trust proxy', 1);
}

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(helmet({
  contentSecurityPolicy: isProduction ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
      formAction: ["'self'", 'mailto:'],
      navigateTo: ["'self'", 'mailto:', 'https:'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"]
    }
  } : false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(compression());

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 15 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts. Please try again later.' }
});
app.use('/api/auth/login', authLimiter);

app.use('/uploads', express.static(uploadsPath, {
  maxAge: isProduction ? '7d' : 0,
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, {
    maxAge: isProduction ? '1d' : 0,
    index: false
  }));
}

app.get('/api/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    success: dbReady,
    status: dbReady ? 'healthy' : 'degraded',
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/education', require('./routes/education'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/social', require('./routes/social'));
app.use('/api/resume', require('./routes/resume'));

if (isDevelopment) {
  app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'MERN backend server is online!' });
  });
}

app.use('/api', notFoundHandler);

if (fs.existsSync(indexPath)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/uploads') || req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(indexPath, (err) => {
      if (err) next(err);
    });
  });
}

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`✓ Server running on port ${port} [${process.env.NODE_ENV || 'development'}]`);
  if (isProduction) {
    console.log(`✓ Serving frontend from ${distPath}`);
    console.log(`✓ CORS allowed origins: ${Array.isArray(allowedOrigins) ? allowedOrigins.join(', ') : allowedOrigins}`);
  }
});

const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(async () => {
    try {
      await mongoose.connection.close(false);
      console.log('✓ MongoDB connection closed');
    } catch (err) {
      console.error('✗ Error closing MongoDB connection:', err.message);
    }
    process.exit(0);
  });

  setTimeout(() => {
    console.error('✗ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown('uncaughtException');
});

module.exports = app;
