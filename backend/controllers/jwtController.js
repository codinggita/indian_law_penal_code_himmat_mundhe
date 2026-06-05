const jwt = require('jsonwebtoken');

// @desc    Get JWT protected profile
// @route   GET /api/v1/jwt/profile
// @access  Private
exports.getJwtProfile = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
    message: 'Accessed JWT protected profile'
  });
};

// @desc    Get JWT dashboard
// @route   GET /api/v1/jwt/dashboard
// @access  Private
exports.getJwtDashboard = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user.name,
      role: req.user.role,
      widgets: ['laws', 'analytics', 'reports']
    },
    message: 'Welcome to your protected dashboard'
  });
};

// @desc    Generate JWT Token (Manual test endpoint)
// @route   POST /api/v1/jwt/generate-token
// @access  Public
exports.generateToken = (req, res, next) => {
  const { id, role } = req.body;
  if (!id) return res.status(400).json({ success: false, message: 'Please provide user id' });

  const token = jwt.sign({ id, role: role || 'user' }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

  res.status(200).json({ success: true, token });
};

// @desc    Verify JWT Token
// @route   POST /api/v1/jwt/verify-token
// @access  Public
exports.verifyToken = (req, res, next) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: 'Please provide token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    res.status(200).json({ success: true, valid: true, decoded });
  } catch (err) {
    res.status(401).json({ success: false, valid: false, error: err.message });
  }
};

// @desc    Refresh JWT Token
// @route   POST /api/v1/jwt/refresh-token
// @access  Public
exports.refreshToken = (req, res, next) => {
  // Mock refresh logic. Normally you'd verify a refresh token from DB/cookie.
  const { oldToken } = req.body;
  try {
    // Ignore expiration to extract payload
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET || 'secret', { ignoreExpiration: true });
    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    });
    res.status(200).json({ success: true, token: newToken });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// @desc    Revoke Token
// @route   DELETE /api/v1/jwt/revoke-token
// @access  Private
exports.revokeToken = (req, res, next) => {
  // To truly revoke a JWT, you usually add it to a blacklist or delete it from the client.
  res.status(200).json({ success: true, message: 'Token revoked (Client must clear it)' });
};

// @desc    Access protected laws
// @route   GET /api/v1/jwt/private-laws
// @access  Private
exports.getPrivateLaws = (req, res, next) => {
  res.status(200).json({ success: true, message: 'These are private laws only visible to authenticated users.' });
};

// @desc    Access protected analytics
// @route   GET /api/v1/jwt/private-analytics
// @access  Private
exports.getPrivateAnalytics = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Private analytics data.' });
};
