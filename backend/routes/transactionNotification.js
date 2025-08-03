const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const transactionNotificationController = require('../controllers/transactionNotificationController');

// Test route để kiểm tra
router.get('/test', (req, res) => {
  res.json({ message: 'Transaction notification router is working' });
});

// Lấy tất cả thông báo của user
router.get('/user', auth, transactionNotificationController.getUserTransactionNotifications);

// Lấy thông báo theo loại
router.get('/user/:type', auth, transactionNotificationController.getNotificationsByType);

// Thống kê thông báo
router.get('/stats', auth, transactionNotificationController.getNotificationStats);

// Đánh dấu thông báo đã đọc
router.patch('/:id/read', auth, transactionNotificationController.markAsRead);

// Lấy thông báo theo ID
router.get('/:id', auth, transactionNotificationController.getTransactionNotificationById);

// Xóa thông báo
router.delete('/:id', auth, transactionNotificationController.deleteTransactionNotification);

// Tạo thông báo giao dịch (admin only)
router.post('/', auth, transactionNotificationController.createTransactionNotification);

// Lấy tất cả thông báo (admin only)
router.get('/', auth, transactionNotificationController.getAllTransactionNotifications);

module.exports = router; 