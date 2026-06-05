const User = require('../models/User');
const Report = require('../models/Report');
const SystemLog = require('../models/SystemLog');

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/v1/admin/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Ban user
// @route   PATCH /api/v1/admin/users/:id/ban
// @access  Private/Admin
exports.banUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    await SystemLog.create({
      level: 'warning', source: 'admin', message: `User banned: ${user.email}`, meta: { adminId: req.user.id, targetId: user.id }
    });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Unban user
// @route   PATCH /api/v1/admin/users/:id/unban
// @access  Private/Admin
exports.unbanUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await SystemLog.create({
      level: 'info', source: 'admin', message: `User unbanned: ${user.email}`, meta: { adminId: req.user.id, targetId: user.id }
    });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Change user role
// @route   PATCH /api/v1/admin/users/:id/role
// @access  Private/Admin
exports.changeRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reports
// @route   GET /api/v1/admin/reports
// @access  Private/Admin
exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().populate('reporter', 'name email');
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (err) {
    next(err);
  }
};

// @desc    Resolve report
// @route   PATCH /api/v1/admin/reports/:id/resolve
// @access  Private/Admin
exports.resolveReport = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;
    const report = await Report.findByIdAndUpdate(req.params.id, { status, resolutionNotes }, { new: true });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

// @desc    Get system health
// @route   GET /api/v1/admin/system/health
// @access  Private/Admin
exports.getHealth = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      status: 'Healthy'
    }
  });
};

// @desc    Get system logs
// @route   GET /api/v1/admin/system/logs
// @access  Private/Admin
exports.getLogs = async (req, res, next) => {
  try {
    const logs = await SystemLog.find().sort('-createdAt').limit(100);
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle maintenance mode (Mock)
// @route   POST /api/v1/admin/system/maintenance
// @access  Private/Admin
exports.toggleMaintenance = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Maintenance mode toggled.' });
};

// @desc    Clear system cache (Mock)
// @route   DELETE /api/v1/admin/cache/clear
// @access  Private/Admin
exports.clearCache = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Cache cleared successfully.' });
};

// @desc    Get security events
// @route   GET /api/v1/admin/security/events
// @access  Private/Admin
exports.getSecurityEvents = async (req, res, next) => {
  try {
    const events = await SystemLog.find({ level: { $in: ['warning', 'critical'] } }).sort('-createdAt').limit(50);
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
};
