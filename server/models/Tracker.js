const mongoose = require('mongoose');

const TrackerSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true
  },
  targetPhone: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Documents expire after 24 hours
  },
  // Captured Data
  clickedAt: Date,
  ip: String,
  network: {
    isp: String,
    asn: String,
    city: String,
    region: String,
    country: String,
    deviceType: String // e.g. "Mobile", "Desktop" - inferred from User-Agent
  },
  status: {
    type: String,
    enum: ['PENDING', 'CLICKED'],
    default: 'PENDING'
  }
});

module.exports = mongoose.model('Tracker', TrackerSchema);
