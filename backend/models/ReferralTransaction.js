const mongoose = require('mongoose');

const referralTransactionSchema = new mongoose.Schema({
  referrer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Người giới thiệu
  referredUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Người được giới thiệu
  amount: { 
    type: Number, 
    required: true 
  }, // Số tiền thưởng
  type: { 
    type: String, 
    enum: ['first_deposit', 'monthly_profit'], 
    default: 'first_deposit' 
  }, // Loại thưởng
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }, // Trạng thái
  depositTransaction: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Transaction' 
  }, // Link đến giao dịch nạp tiền
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }, // Admin duyệt
  approvedAt: { 
    type: Date 
  }, // Thời gian duyệt
  reason: { 
    type: String 
  }, // Lý do từ chối (nếu có)
}, { 
  timestamps: true 
});

// Index để tối ưu query
referralTransactionSchema.index({ referrer: 1, status: 1 });
referralTransactionSchema.index({ referredUser: 1 });
referralTransactionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ReferralTransaction', referralTransactionSchema); 