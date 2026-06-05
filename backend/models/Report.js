const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  reportedEntity: {
    type: mongoose.Schema.ObjectId, // Could be a Law ID, User ID, etc.
    required: true
  },
  entityModel: {
    type: String,
    required: true,
    enum: ['Law', 'User'] // Expandable
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for the report']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  resolutionNotes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
