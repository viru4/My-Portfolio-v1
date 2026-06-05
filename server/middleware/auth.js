const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authorized, token missing' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get admin from the token and attach to request
    req.admin = await Admin.findById(decoded.id).select('-passwordHash');
    
    if (!req.admin) {
      return res.status(401).json({ success: false, error: 'Not authorized, admin user not found' });
    }

    next();
  } catch (err) {
    console.error(`Auth Middleware Error: ${err.message}`);
    return res.status(401).json({ success: false, error: 'Not authorized, token invalid or expired' });
  }
};

module.exports = { protect };
