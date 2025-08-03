const TransactionNotification = require('../models/TransactionNotification');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Helper function để tạo mã giao dịch
const generateTransactionCode = (type) => {
  const prefix = type === 'deposit' ? 'DP' : type === 'withdraw' ? 'WD' : 'ID';
  return prefix + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Helper function để tạo nội dung thông báo
const generateNotificationContent = (type, transactionCode, amount, bankInfo, identityInfo) => {
  const now = new Date();
  const formattedDate = now.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  switch (type) {
    case 'deposit':
      return `Cảm ơn bạn đã sử dụng dịch vụ của JBS.
Yêu cầu nạp tiền của bạn đã được ghi nhận và đang trong quá trình xét duyệt.

🕒 Thời gian xử lý dự kiến: từ 10 đến 120 phút
📌 Mã giao dịch: ${transactionCode}
📅 Thời gian yêu cầu: ${formattedDate}
💵 Số tiền nạp: ${amount.toLocaleString('vi-VN')} VNĐ

⸻

Lưu ý:
– Trong thời gian xét duyệt, bạn không thể chỉnh sửa hoặc hủy yêu cầu.
– Bạn sẽ nhận được thông báo ngay khi lệnh nạp được xử lý thành công.
– Nếu phát sinh sự cố, đội ngũ JBS sẽ liên hệ trực tiếp qua email hoặc số điện thoại đã đăng ký.`;

    case 'withdraw':
      return `Cảm ơn bạn đã sử dụng dịch vụ của JBS.
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

    case 'identity_verification':
      return `Cảm ơn bạn đã gửi yêu cầu xác minh danh tính.
Thông tin xác minh của bạn đã được ghi nhận và đang trong quá trình xét duyệt.

🕒 Thời gian xử lý dự kiến: từ 30 đến 120 phút
📌 Mã giao dịch: ${transactionCode}
📅 Thời gian yêu cầu: ${formattedDate}
📋 Loại giấy tờ: ${identityInfo.documentType}
👤 Họ tên: ${identityInfo.fullName}

⸻

Lưu ý:
– Trong thời gian xét duyệt, bạn không thể chỉnh sửa hoặc hủy yêu cầu.
– Bạn sẽ nhận được thông báo ngay khi quá trình xác minh hoàn tất.
– Nếu phát sinh sự cố, đội ngũ JBS sẽ liên hệ trực tiếp qua email hoặc số điện thoại đã đăng ký.`;

    default:
      return 'Thông báo giao dịch';
  }
};

// Helper function để tạo tiêu đề thông báo
const generateNotificationTitle = (type) => {
  switch (type) {
    case 'deposit':
      return '💵 Yêu cầu nạp tiền đã được tiếp nhận';
    case 'withdraw':
      return '💸 Yêu cầu rút tiền đã được tiếp nhận';
    case 'identity_verification':
      return '🆔 Yêu cầu xác minh danh tính đã được tiếp nhận';
    default:
      return '📢 Thông báo giao dịch';
  }
};

// Tạo thông báo giao dịch
const createTransactionNotification = async (req, res) => {
  try {
    const { transactionId, userId, type, amount, bankInfo, identityInfo } = req.body;
    
    const transactionCode = generateTransactionCode(type);
    const title = generateNotificationTitle(type);
    const content = generateNotificationContent(type, transactionCode, amount, bankInfo, identityInfo);

    const notification = new TransactionNotification({
      user: userId,
      transaction: transactionId,
      type,
      title,
      content,
      transactionCode,
      amount,
      bankInfo,
      identityInfo
    });
    
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ message: 'Tạo thông báo giao dịch thất bại', error: err.message });
  }
};

// Lấy tất cả thông báo của user
const getUserTransactionNotifications = async (req, res) => {
  try {
    const notifications = await TransactionNotification.find({ 
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

// Lấy tất cả thông báo (admin only)
const getAllTransactionNotifications = async (req, res) => {
  try {
    const notifications = await TransactionNotification.find()
      .populate('user', 'name email')
      .populate('transaction', 'status createdAt')
      .sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy thông báo theo loại
const getNotificationsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const notifications = await TransactionNotification.find({ 
      user: req.user.id,
      type,
      expiresAt: { $gt: new Date() }
    })
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
    const notification = await TransactionNotification.findByIdAndUpdate(
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
const deleteTransactionNotification = async (req, res) => {
  try {
    const notification = await TransactionNotification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }
    res.json({ message: 'Đã xóa thông báo' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy thông báo theo ID
const getTransactionNotificationById = async (req, res) => {
  try {
    const notification = await TransactionNotification.findById(req.params.id)
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

// Thống kê thông báo
const getNotificationStats = async (req, res) => {
  try {
    const stats = await TransactionNotification.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unread: {
            $sum: { $cond: ['$isRead', 0, 1] }
          }
        }
      }
    ]);
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  createTransactionNotification,
  getUserTransactionNotifications,
  getAllTransactionNotifications,
  getNotificationsByType,
  markAsRead,
  deleteTransactionNotification,
  getTransactionNotificationById,
  getNotificationStats
}; 