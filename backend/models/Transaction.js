const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdraw', 'investment', 'interest', 'principal_return', 'promotion'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  maturityStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentPackage' },
  note: { type: String },
  description: { type: String }, // Mô tả giao dịch
  proofImage: { type: String }, // URL của hình ảnh proof
  bankInfo: {
    bankName: String,
    accountNumber: String,
    accountName: String,
  },
  approvedAt: { type: Date }, // Thời gian duyệt giao dịch
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema); 