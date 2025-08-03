const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');
const { auth, requireRole } = require('../middlewares/auth');

// Lấy cấu hình khuyến mãi
router.get('/config', auth, promotionController.getPromotionConfig);

// Cập nhật cấu hình khuyến mãi (chỉ admin)
router.put('/config', auth, requireRole('admin'), promotionController.updatePromotionConfig);

// Lấy lịch sử khuyến mãi
router.get('/history', auth, promotionController.getPromotionHistory);

module.exports = router; 