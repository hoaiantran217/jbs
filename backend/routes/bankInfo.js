const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/upload');
const { auth, requireRole } = require('../middlewares/auth');
const bankInfoController = require('../controllers/bankInfoController');

// Routes cho admin (chỉ admin mới có thể quản lý tài khoản ngân hàng hệ thống)
router.get('/admin', auth, requireRole('admin'), bankInfoController.getAllBankInfo);
router.post('/admin', auth, requireRole('admin'), bankInfoController.createBankInfo);
router.post('/admin/upload-qr', auth, requireRole('admin'), upload.single('qrCode'), bankInfoController.uploadQrCode);
router.get('/admin/:id', auth, requireRole('admin'), bankInfoController.getBankInfoById);
router.put('/admin/:id', auth, requireRole('admin'), bankInfoController.updateBankInfo);
router.delete('/admin/:id', auth, requireRole('admin'), bankInfoController.deleteBankInfo);

// Routes cho frontend (public) - user có thể xem tài khoản ngân hàng hệ thống để nạp tiền
router.get('/public', bankInfoController.getActiveBankInfo);

module.exports = router; 