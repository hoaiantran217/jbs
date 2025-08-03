const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true }, // Số tiền nhận được (5k hoặc 10k)
  isWeekend: { type: Boolean, default: false }, // Đánh dấu cuối tuần
}, { timestamps: true });

// Đảm bảo mỗi user chỉ điểm danh 1 lần mỗi ngày
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);