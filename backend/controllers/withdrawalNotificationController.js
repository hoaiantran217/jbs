const WithdrawalNotification = require('../models/WithdrawalNotification');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Tạo thông báo rút tiền
const createWithdrawalNotification = async (req, res) => {
  try {
    const { transactionId, userId, amount, bankInfo } = req.body;
    
    // Tạo mã giao dịch ngẫu nhiên
    const transactionCode = 'WD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    // Tạo nội dung thông báo
    const now = new Date();
    const formattedDate = now.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const content = `Cảm ơn bạn đã sử dụng dịch vụ của JBS.
Yêu cầu rút tiền của bạn đã được ghi nhận và đang trong quá trình xét duyệt.

🕒 Thời gian xử lý dự kiến: từ 10 đến 120 phút
📌 Mã giao dịch: ${transactionCode}
📅 Thời gian yêu cầu: ${formattedDate}
💵 Số tiền rút: ${amount.toLocaleString('vi-VN')} VNĐ
🏦 Tài khoản nhận: ${bankInfo.bankName}/${bankInfo.accountNumber}/${bankInfo.accountName}

⸻

Lưu ý:
– Trong thời gian xét duyệt, bạn không thể chỉnh sửa hoặc hủy yêu cầu.
– Bạn sẽ nhận được thông báo ngay khi lệnh rút được xử lý thành công.
– Nếu phát sinh sự cố, đội ngũ JBS sẽ liên hệ trực tiếp qua email hoặc số điện thoại đã đăng ký.`;

    const notification = new WithdrawalNotification({
      user: userId,
      transaction: transactionId,
      content,
      transactionCode,
      amount,
      bankInfo
    });
    
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ message: 'Tạo thông báo rút tiền thất bại', error: err.message });
  }
};

// Lấy tất cả thông báo rút tiền của user
const getUserWithdrawalNotifications = async (req, res) => {
  try {
    const notifications = await WithdrawalNotification.find({ 
      user: req.user.id,
      expiresAt: { $gt: new Date() }
    })
    .populate('transaction', 'status createdAt')
    .sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy tất cả thông báo rút tiền (admin only)
const getAllWithdrawalNotifications = async (req, res) => {
  try {
    const notifications = await WithdrawalNotification.find()
      .populate('user', 'name email')
      .populate('transaction', 'status createdAt')
      .sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đánh dấu thông báo đã đọc
const markAsRead = async (req, res) => {
  try {
    const notification = await WithdrawalNotification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }
    
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa thông báo
const deleteWithdrawalNotification = async (req, res) => {
  try {
    const notification = await WithdrawalNotification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }
    res.json({ message: 'Đã xóa thông báo' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy thông báo theo ID
const getWithdrawalNotificationById = async (req, res) => {
  try {
    const notification = await WithdrawalNotification.findById(req.params.id)
      .populate('transaction', 'status createdAt')
      .populate('user', 'name email');
      
    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }
    
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  createWithdrawalNotification,
  getUserWithdrawalNotifications,
  getAllWithdrawalNotifications,
  markAsRead,
  deleteWithdrawalNotification,
  getWithdrawalNotificationById
}; 