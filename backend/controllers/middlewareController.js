// @desc    Practice logging middleware
// @route   GET /api/v1/middleware/logger
// @access  Public
exports.loggerPractice = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Logger middleware executed. Check console.' });
};

// @desc    Practice auth middleware
// @route   GET /api/v1/middleware/auth
// @access  Public
exports.authPractice = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Auth practice passed', user: req.practiceUser });
};

// @desc    Practice cache middleware
// @route   GET /api/v1/middleware/cache
// @access  Public
exports.cachePractice = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Check Cache-Control headers in response.' });
};

// @desc    Practice rate limiting
// @route   GET /api/v1/middleware/rate-limit
// @access  Public
exports.rateLimitPractice = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Rate limit middleware passed.' });
};

// @desc    Practice error handling
// @route   GET /api/v1/middleware/error-handler
// @access  Public
exports.errorHandlerPractice = (req, res, next) => {
  res.status(200).json({ success: true, message: 'No error triggered. Pass ?trigger=true to test.' });
};

// @desc    Practice request timing
// @route   GET /api/v1/middleware/request-time
// @access  Public
exports.requestTimePractice = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Request time added.', requestTime: req.requestTime });
};

// @desc    Practice security middleware
// @route   GET /api/v1/middleware/security
// @access  Public
exports.securityPractice = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Check security headers.' });
};

// @desc    Practice CORS middleware
// @route   GET /api/v1/middleware/cors
// @access  Public
exports.corsPractice = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Check CORS headers.' });
};

// @desc    Practice compression middleware
// @route   GET /api/v1/middleware/compression
// @access  Public
exports.compressionPractice = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Check Content-Encoding header.', isCompressed: req.isCompressed });
};

// @desc    Practice validation middleware
// @route   GET /api/v1/middleware/validation
// @access  Public
exports.validationPractice = (req, res, next) => {
  res.status(200).json({ success: true, message: `Validation passed. Name: ${req.query.name}` });
};
