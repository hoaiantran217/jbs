const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middlewares/auth');
const securityConfigController = require('../controllers/securityConfigController');

// Lấy cấu hình security (public - cho frontend)
router.get('/public', securityConfigController.getSecurityConfig);

// Lấy cấu hình security (admin only)
router.get('/', auth, requireRole('admin'), securityConfigController.getSecurityConfig);

// Cập nhật cấu hình security (admin only)
router.put('/', auth, requireRole('admin'), securityConfigController.updateSecurityConfig);

// Reset cấu hình security (admin only)
router.post('/reset', auth, requireRole('admin'), securityConfigController.resetSecurityConfig);

module.exports = router; 