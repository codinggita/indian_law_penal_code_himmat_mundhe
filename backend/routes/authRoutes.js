const express = require('express');
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  sendOtp,
  verifyOtp,
  getSessions
} = require('../controllers/authController');

const { protect } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');
const { 
  validateRegister, 
  validateLogin, 
  validateSendOtp, 
  validateOtp, 
  validateResetPassword 
} = require('../middlewares/validators');

const router = express.Router();

// Public routes (Rate limited to prevent brute force)
router.use(authLimiter);

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateSendOtp, forgotPassword);
router.post('/reset-password/:resettoken', validateResetPassword, resetPassword);
router.post('/reset-password', validateResetPassword, resetPassword); // Sometimes passed in body
router.post('/verify-email', validateOtp, verifyEmail);
router.post('/send-otp', validateSendOtp, sendOtp);
router.post('/verify-otp', validateOtp, verifyOtp);

// Protected routes
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);
router.get('/sessions', protect, getSessions);

module.exports = router;
