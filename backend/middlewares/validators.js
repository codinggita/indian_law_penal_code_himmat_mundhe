const { check, validationResult, matchedData } = require('express-validator');

// Reusable validation checker middleware
const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors nicely
    const extractedErrors = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: extractedErrors
    });
  }

  // Strip unknown fields by replacing req.body with only the validated data
  req.body = matchedData(req, { locations: ['body'], includeOptionals: true });
  next();
};

// 1. Auth Validation Rules
exports.validateRegister = [
  check('name', 'Name is required').notEmpty().trim().escape(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
  runValidation
];

exports.validateLogin = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists(),
  runValidation
];

exports.validateOtp = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('otp', 'OTP is required and must be 6 digits').isLength({ min: 6, max: 6 }).isNumeric(),
  runValidation
];

exports.validateSendOtp = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  runValidation
];

exports.validateResetPassword = [
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  runValidation
];

// 2. Law Creation/Update Validation Rules
exports.validateLaw = [
  check('title', 'Title is required').notEmpty().trim().escape(),
  check('section', 'Section is required').notEmpty(),
  check('description', 'Description is required').notEmpty().trim().escape(),
  check('chapter').optional().isInt(),
  check('chapter_title').optional().trim().escape(),
  check('category').optional().trim().escape(),
  check('state').optional().trim().escape(),
  check('court').optional().trim().escape(),
  check('bailable').optional().isBoolean(),
  check('cognizable').optional().isBoolean(),
  check('compoundable').optional().isBoolean(),
  runValidation
];

exports.validateLawUpdate = [
  check('title').optional().notEmpty().trim().escape(),
  check('section').optional().notEmpty(),
  check('description').optional().notEmpty().trim().escape(),
  check('chapter').optional().isInt(),
  check('chapter_title').optional().trim().escape(),
  check('category').optional().trim().escape(),
  check('state').optional().trim().escape(),
  check('court').optional().trim().escape(),
  check('bailable').optional().isBoolean(),
  check('cognizable').optional().isBoolean(),
  check('compoundable').optional().isBoolean(),
  check('isArchived').optional().isBoolean(),
  check('isDeleted').optional().isBoolean(),
  runValidation
];
