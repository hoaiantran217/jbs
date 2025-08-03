const mongoose = require('mongoose');

const withdrawalNotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  title: { type: String, default: '💸 Yêu cầu rút tiền đã được tiếp nhận' },
  content: { type: String, required: true },
  transactionCode: { type: String, required: true },
  amount: { type: Number, required: true },
  bankInfo: {
    bankName: String,
    accountNumber: String,
    accountName: String,
  },
  isRead: { type: Boolean, default: false },
  expiresAt: { type: Date, default: function() {
    // Thông báo hết hạn sau 24 giờ
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
  }},
}, { timestamps: true });

module.exports = mongoose.model('WithdrawalNotification', withdrawalNotificationSchema); 