const express = require('express');
const {
  loggerPractice,
  authPractice,
  cachePractice,
  rateLimitPractice,
  errorHandlerPractice,
  requestTimePractice,
  securityPractice,
  corsPractice,
  compressionPractice,
  validationPractice
} = require('../controllers/middlewareController');

const {
  practiceLogger,
  practiceAuth,
  practiceCache,
  practiceRateLimit,
  practiceErrorTrigger,
  practiceRequestTime,
  practiceSecurity,
  practiceCors,
  practiceCompression,
  practiceValidation
} = require('../middlewares/practiceMiddlewares');

const router = express.Router();

router.get('/logger', practiceLogger, loggerPractice);
router.get('/auth', practiceAuth, authPractice);
router.get('/cache', practiceCache, cachePractice);
router.get('/rate-limit', practiceRateLimit, rateLimitPractice);
router.get('/error-handler', practiceErrorTrigger, errorHandlerPractice);
router.get('/request-time', practiceRequestTime, requestTimePractice);
router.get('/security', practiceSecurity, securityPractice);
router.get('/cors', practiceCors, corsPractice);
router.get('/compression', practiceCompression, compressionPractice);
router.get('/validation', practiceValidation, validationPractice);

module.exports = router;
