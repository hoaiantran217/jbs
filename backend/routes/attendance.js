const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { auth } = require('../middlewares/auth');

// Điểm danh hàng ngày
router.post('/checkin', auth, attendanceController.checkIn);

// Lấy trạng thái điểm danh hôm nay
router.get('/today-status', auth, attendanceController.getTodayStatus);

// Lấy lịch sử điểm danh
router.get('/history', auth, attendanceController.getAttendanceHistory);

// Lấy thống kê điểm danh
router.get('/stats', auth, attendanceController.getAttendanceStats);

module.exports = router;