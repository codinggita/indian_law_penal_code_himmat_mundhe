const rateLimit = require('express-rate-limit');

// 1. Global Rate Limiter
// Applied to all API routes by default to prevent general abuse
exports.globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 10 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// 2. Auth Rate Limiter
// Stricter limits for login, register, password reset to prevent brute force attacks
exports.authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 requests per windowMs as requested by user
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 10 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Search & Analytics Rate Limiter
// Protects endpoints that perform heavy database queries
exports.searchLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    success: false,
    message: 'Too many search/analytics requests, please try again after 10 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. Admin Rate Limiter
// Strictest limit for sensitive admin routes
exports.adminLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: {
    success: false,
    message: 'Too many admin requests, please try again after 10 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
