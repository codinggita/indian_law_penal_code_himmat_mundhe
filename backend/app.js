require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const lawRoutes = require('./routes/lawRoutes');
const filterRoutes = require('./routes/filterRoutes');
const searchRoutes = require('./routes/searchRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');
const jwtRoutes = require('./routes/jwtRoutes');
const adminRoutes = require('./routes/adminRoutes');
const middlewareRoutes = require('./routes/middlewareRoutes');

const app = express();

// 1. Database Connection
connectDB();

// 2. Global Middlewares
app.use(cors());
app.use(express.json());
app.use(logger); // Custom request logger middleware (Good-to-Have #1)

const { globalLimiter } = require('./middlewares/rateLimiter');
app.use('/api/', globalLimiter);

// 3. API Routes
app.use('/api/v1/laws/filter', filterRoutes);
app.use('/api/v1/laws', lawRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jwt', jwtRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/middleware', middlewareRoutes);



// Health Check API (Good-to-Have #2)
// Simple endpoint to check server and database status.
app.get('/api/v1/health', async (req, res) => {
  const mongooseState = require('mongoose').connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({
    success: true,
    message: 'Server is healthy and running.',
    timestamp: new Date().toISOString(),
    status: {
      uptime: process.uptime(),
      express: 'OK',
      database: states[mongooseState] || 'unknown'
    }
  });
});

// 4. Fallback route for 404
app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// 5. Global Error Handler (Good-to-Have #3)
app.use(errorHandler);

// 6. Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` Server is running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(` Port: ${PORT}`);
  console.log(` Local Address: http://localhost:${PORT}`);
  console.log(` Health Check:  http://localhost:${PORT}/api/v1/health`);
  console.log(`==================================================`);
});

module.exports = app; // Exported for integration testing if needed
