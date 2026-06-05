const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SystemLog = require('../models/SystemLog');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: 'No token provided'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
        error: 'User not found'
      });
    }

    // Check if user is banned
    if (req.user.isBanned) {
      return res.status(403).json({
        success: false,
        message: 'Account is banned'
      });
    }

    next();
  } catch (err) {
    await SystemLog.create({
      level: 'warning',
      source: 'authMiddleware',
      message: 'Failed token verification',
      meta: { error: err.message, token }
    });

    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: 'Invalid token'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
