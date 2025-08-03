const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const withdrawalNotificationController = require('../controllers/withdrawalNotificationController');

// Test route để kiểm tra
router.get('/test', (req, res) => {
  res.json({ message: 'Withdrawal notification router is working' });
});

// Lấy thông báo rút tiền của user
router.get('/user', auth, withdrawalNotificationController.getUserWithdrawalNotifications);

// Đánh dấu thông báo đã đọc
router.patch('/:id/read', auth, withdrawalNotificationController.markAsRead);

// Lấy thông báo theo ID
router.get('/:id', auth, withdrawalNotificationController.getWithdrawalNotificationById);

// Xóa thông báo
router.delete('/:id', auth, withdrawalNotificationController.deleteWithdrawalNotification);

// Tạo thông báo rút tiền (admin only)
router.post('/', auth, withdrawalNotificationController.createWithdrawalNotification);

// Lấy tất cả thông báo rút tiền (admin only)
router.get('/', auth, withdrawalNotificationController.getAllWithdrawalNotifications);

module.exports = router; 