const mongoose = require('mongoose');

const promotionConfigSchema = new mongoose.Schema({
  isEnabled: { type: Boolean, default: false },
  amount: { type: Number, default: 0 }, // Số tiền khuyến mãi (200k, 500k, 800k)
  description: { type: String, default: 'Khuyến mãi cho thành viên mới' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PromotionConfig', promotionConfigSchema); 