/**
 * Global centralized error handling middleware.
 * Ensures consistent API error responses across the project.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    error: err.name || 'Error'
  };

  // Only expose details/stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  console.error(`[API Error] ${req.method} ${req.originalUrl} -> ${statusCode}: ${err.message}`);
  if (err.stack && process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
