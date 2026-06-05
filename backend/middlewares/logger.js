/**
 * Request Logging Middleware.
 * Logs every incoming request method, URL, and timestamp to console.
 */
const logger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString();
    console.log(`[DEBUG - ${timestamp}] ${req.method} ${req.originalUrl} | IP: ${req.ip}`);
  }
  next();
};

module.exports = logger;
