const mongoose = require('mongoose');

const investmentPackageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Tên gói đầu tư là bắt buộc'], 
    unique: true,
    trim: true,
    minlength: [2, 'Tên gói phải có ít nhất 2 ký tự'],
    maxlength: [100, 'Tên gói không được quá 100 ký tự']
  },
  description: { 
    type: String,
    trim: true,
    maxlength: [500, 'Mô tả không được quá 500 ký tự']
  },
  interestRate: { 
    type: Number, 
    required: [true, 'Lãi suất là bắt buộc'],
    min: [0.01, 'Lãi suất phải lớn hơn 0'],
    max: [100, 'Lãi suất không được quá 100%']
  }, // % của số tiền đầu tư
  duration: { 
    type: Number, 
    required: [true, 'Thời hạn là bắt buộc'],
    min: [1, 'Thời hạn phải ít nhất 1 ngày'],
    max: [3650, 'Thời hạn không được quá 10 năm']
  }, // số ngày
  minAmount: { 
    type: Number, 
    required: [true, 'Số tiền tối thiểu là bắt buộc'],
    min: [1000, 'Số tiền tối thiểu phải ít nhất 1,000 đ']
  },
  maxAmount: { 
    type: Number, 
    required: [true, 'Số tiền tối đa là bắt buộc'],
    min: [1000, 'Số tiền tối đa phải ít nhất 1,000 đ']
  },
  active: { type: Boolean, default: true },
  image: { 
    type: String,
    trim: true
  },
  // Các trường mới cho admin nhập thủ công
  investorCount: {
    type: String,
    default: "0",
    trim: true
  }, // Số nhà đầu tư đã tham gia (string)
  totalInvested: {
    type: String,
    default: "0",
    trim: true
  }, // Tổng số tiền đã đầu tư (string)
  progressPercent: {
    type: Number,
    default: 0,
    min: [0, 'Tiến độ phải từ 0%'],
    max: [100, 'Tiến độ không được quá 100%']
  }, // Tiến độ đầu tư 1-100% (number)
}, { timestamps: true });

// Custom validator để đảm bảo maxAmount > minAmount
investmentPackageSchema.pre('save', function(next) {
  if (this.maxAmount <= this.minAmount) {
    const error = new Error('Số tiền tối đa phải lớn hơn số tiền tối thiểu');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

investmentPackageSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.maxAmount && update.minAmount && update.maxAmount <= update.minAmount) {
    const error = new Error('Số tiền tối đa phải lớn hơn số tiền tối thiểu');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

module.exports = mongoose.model('InvestmentPackage', investmentPackageSchema); 