/**
 * A collection of simple, mock middlewares to demonstrate concepts.
 */

// 1. Logger
exports.practiceLogger = (req, res, next) => {
  console.log(`[Practice Logger] ${req.method} ${req.url}`);
  next();
};

// 2. Mock Auth
exports.practiceAuth = (req, res, next) => {
  if (req.query.token === 'secret123') {
    req.practiceUser = { name: 'Practice User' };
    next();
  } else {
    res.status(401).json({ success: false, message: 'Practice Auth Failed. Provide ?token=secret123' });
  }
};

// 3. Mock Cache
exports.practiceCache = (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  console.log('[Practice Cache] Cache headers set.');
  next();
};

// 4. Rate Limiter (Basic mock)
let requestCount = 0;
const MAX_REQUESTS = 5;
exports.practiceRateLimit = (req, res, next) => {
  requestCount++;
  if (requestCount > MAX_REQUESTS) {
    return res.status(429).json({ success: false, message: 'Too many practice requests, slow down!' });
  }
  // Reset for testing after 10 seconds
  setTimeout(() => { requestCount = 0; }, 10000);
  next();
};

// 5. Error Handler (Trigger)
exports.practiceErrorTrigger = (req, res, next) => {
  if (req.query.trigger === 'true') {
    const error = new Error('This is a practice error!');
    error.statusCode = 400;
    return next(error);
  }
  next();
};

// 6. Request Time
exports.practiceRequestTime = (req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
};

// 7. Security Headers
exports.practiceSecurity = (req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('X-XSS-Protection', '1; mode=block');
  next();
};

// 8. CORS (Mocking custom CORS behavior for specific route)
exports.practiceCors = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
};

// 9. Compression (Mock flag)
exports.practiceCompression = (req, res, next) => {
  res.set('Content-Encoding', 'gzip'); // Mock header
  req.isCompressed = true;
  next();
};

// 10. Validation (Mock)
exports.practiceValidation = (req, res, next) => {
  if (!req.query.name) {
    return res.status(400).json({ success: false, message: 'Validation failed: ?name is required' });
  }
  next();
};
