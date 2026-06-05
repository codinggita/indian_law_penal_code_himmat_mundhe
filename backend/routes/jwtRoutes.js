const express = require('express');
const {
  getJwtProfile,
  getJwtDashboard,
  generateToken,
  verifyToken,
  refreshToken,
  revokeToken,
  getPrivateLaws,
  getPrivateAnalytics
} = require('../controllers/jwtController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public token manipulation routes
router.post('/generate-token', generateToken);
router.post('/verify-token', verifyToken);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/profile', protect, getJwtProfile);
router.get('/dashboard', protect, getJwtDashboard);
router.delete('/revoke-token', protect, revokeToken);
router.get('/private-laws', protect, getPrivateLaws);
router.get('/private-analytics', protect, getPrivateAnalytics);

module.exports = router;
