const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true }, // Tên đăng nhập (optional)
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String }, // Số điện thoại
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  balance: { type: Number, default: 0 },
  income: { type: Number, default: 0 }, // Thu nhập từ lãi đáo hạn
  withdrawable: { type: Number, default: 0 }, // Số tiền có thể rút
  withdrawing: { type: Number, default: 0 }, // Số tiền đang rút
  isActive: { type: Boolean, default: true },
  bankAccount: { type: String }, // Số tài khoản ngân hàng
  bankName: { type: String },    // Tên ngân hàng
  bankAccountHolder: { type: String }, // Chủ tài khoản ngân hàng
  avatar: { type: String }, // URL ảnh đại diện
  isVerified: { type: Boolean, default: false }, // Trạng thái xác minh danh tính
  verifiedAt: { type: Date }, // Ngày xác minh thành công
  
  // Hệ thống mã mời
  referralCode: { type: String, unique: true, sparse: true }, // Mã giới thiệu của user này
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User đã giới thiệu
  referralCount: { type: Number, default: 0 }, // Số người đã giới thiệu thành công
  referralEarnings: { type: Number, default: 0 }, // Tổng thu nhập từ giới thiệu
  referralHistory: [{ // Lịch sử giới thiệu
    referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number }, // Số tiền thưởng
    type: { type: String, enum: ['new_referral', 'first_deposit', 'monthly_profit'], default: 'first_deposit' },
    date: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 