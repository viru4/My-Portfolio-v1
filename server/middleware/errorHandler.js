const { isProduction } = require('../config/env');

const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
};

const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err.stack || err.message);

  const statusCode = err.statusCode || err.status || 500;
  const message = isProduction && statusCode >= 500
    ? 'Something went wrong on the server!'
    : (err.message || 'Something went wrong on the server!');

  res.status(statusCode).json({ success: false, error: message });
};

module.exports = { notFoundHandler, errorHandler };
