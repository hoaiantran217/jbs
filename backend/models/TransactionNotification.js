const mongoose = require('mongoose');

const transactionNotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  type: { 
    type: String, 
    enum: ['deposit', 'withdraw', 'identity_verification'], 
    required: true 
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  transactionCode: { type: String, required: true },
  amount: { type: Number, required: true },
  bankInfo: {
    bankName: String,
    accountNumber: String,
    accountName: String,
  },
  // Thông tin xác minh danh tính
  identityInfo: {
    documentType: String, // 'id_card', 'passport', 'driver_license'
    documentNumber: String,
    fullName: String,
    dateOfBirth: Date,
    nationality: String,
    address: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  },
  isRead: { type: Boolean, default: false },
  expiresAt: { type: Date, default: function() {
    // Thông báo hết hạn sau 24 giờ
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
  }},
}, { timestamps: true });

module.exports = mongoose.model('TransactionNotification', transactionNotificationSchema); 