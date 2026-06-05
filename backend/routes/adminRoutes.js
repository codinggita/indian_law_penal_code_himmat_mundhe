const express = require('express');
const {
  getUsers,
  getUser,
  banUser,
  unbanUser,
  changeRole,
  getReports,
  resolveReport,
  getHealth,
  getLogs,
  toggleMaintenance,
  clearCache,
  getSecurityEvents
} = require('../controllers/adminController');

const { protect, authorize } = require('../middlewares/authMiddleware');
const { adminLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// ALL admin routes require a valid token, the 'admin' role, and strict rate limiting
router.use(adminLimiter);
router.use(protect);
router.use(authorize('admin'));

// User Management
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/unban', unbanUser);
router.patch('/users/:id/role', changeRole);

// Reports Management
router.get('/reports', getReports);
router.patch('/reports/:id/resolve', resolveReport);

// System Management
router.get('/system/health', getHealth);
router.get('/system/logs', getLogs);
router.post('/system/maintenance', toggleMaintenance);
router.delete('/cache/clear', clearCache);
router.get('/security/events', getSecurityEvents);

module.exports = router;
