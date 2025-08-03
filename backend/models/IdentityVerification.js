const mongoose = require('mongoose');

const identityVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  idType: {
    type: String,
    enum: ['CMND', 'CCCD', 'PASSPORT'],
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  frontImage: {
    type: String, // Cloudinary URL
    required: true
  },
  backImage: {
    type: String, // Cloudinary URL
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('IdentityVerification', identityVerificationSchema); 