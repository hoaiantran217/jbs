const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middlewares/auth');
const { getDashboardStats, getTimeBasedStats, resetDatabase, clearAllData, controlConsole } = require('../controllers/dashboardController');

// Lấy thống kê tổng quan cho dashboard
router.get('/stats', auth, getDashboardStats);

// Lấy thống kê theo thời gian
router.get('/time-stats', auth, getTimeBasedStats);

// ⚠️  RESET DATABASE - CHỈ DÙNG KHI CẦN THIẾT!
router.post('/reset-database', auth, resetDatabase);

// Xóa toàn bộ dữ liệu database (CHỈ DÀNH CHO ADMIN)
router.post('/clear-all-data', auth, requireRole('admin'), clearAllData);

// Điều khiển console output (CHỈ DÀNH CHO ADMIN)
router.post('/console-control', auth, requireRole('admin'), controlConsole);

module.exports = router; 