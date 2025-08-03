const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middlewares/auth');
const investmentCtrl = require('../controllers/investmentController');

// Admin: lấy tất cả investments
router.get('/', auth, requireRole('admin'), investmentCtrl.getAllInvestments);
// User: lấy investments của mình
router.get('/me', auth, investmentCtrl.getMyInvestments);
// User: lấy danh sách gói đầu tư đã mua
router.get('/my-packages', auth, investmentCtrl.getMyPurchasedPackages);
// User: tạo investment mới
router.post('/', auth, investmentCtrl.createInvestment);
// Admin: duyệt/từ chối investment
router.patch('/:id/approve', auth, requireRole('admin'), investmentCtrl.approveInvestment);
// Admin: duyệt đáo hạn đầu tư (cộng lãi)
router.patch('/:id/maturity', auth, requireRole('admin'), investmentCtrl.approveMaturity);
// Auto maturity - tự động cộng lãi khi hết thời gian
router.post('/:id/auto-maturity', auth, investmentCtrl.autoMaturity);

module.exports = router; 