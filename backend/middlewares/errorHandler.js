/**
 * Global centralized error handling middleware.
 * Ensures consistent API error responses across the project.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;

  // Log to console for dev
  console.error(`[API Error] ${req.method} ${req.originalUrl} -> ${err.message}`.red || err.message);

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new Error(message);
    error.statusCode = 404;
  }

  // Mongoose duplicate key (MongoServerError)
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new Error(message.join(', '));
    error.statusCode = 400;
  }

  const statusCode = error.statusCode || 500;
  
  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
    error: error.name || 'Error'
  };

  // Only expose details/stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
