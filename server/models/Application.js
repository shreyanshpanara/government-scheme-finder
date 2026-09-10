const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true,
    },
    referenceNumber: {
      type: String,
      trim: true,
      default: '',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: [
        'Not Applied',
        'Applied',
        'Under Review',
        'Approved',
        'Rejected',
        'Completed',
      ],
      default: 'Applied',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    timeline: [
      {
        status: { type: String, required: true },
        date: { type: Date, default: Date.now },
        comment: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate tracking of same scheme by same user
ApplicationSchema.index({ user: 1, scheme: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
