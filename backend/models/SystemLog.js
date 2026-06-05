const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    default: 'info'
  },
  source: {
    type: String,
    required: true,
    default: 'system' // e.g., 'auth', 'database', 'middleware'
  },
  message: {
    type: String,
    required: true
  },
  meta: {
    type: mongoose.Schema.Types.Mixed // Flexible payload for extra data
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SystemLog', systemLogSchema);
