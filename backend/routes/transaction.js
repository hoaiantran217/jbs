const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/upload');
const { auth, requireRole } = require('../middlewares/auth');
const transactionController = require('../controllers/transactionController');

// User tạo giao dịch, xem lịch sử của mình
router.post('/', auth, transactionController.createTransaction);
router.get('/me', auth, transactionController.getUserTransactions);
router.get('/my-transactions', auth, transactionController.getMyTransactions);
router.get('/status', auth, transactionController.getUserTransactionStatus);
router.post('/confirm-deposit', auth, upload.single('proofImage'), transactionController.confirmDeposit);
router.delete('/:transactionId/rollback', auth, transactionController.rollbackTransaction);

// Admin xem tất cả giao dịch
router.get('/', auth, requireRole('admin'), transactionController.getAllTransactions);
router.patch('/:id/approve', auth, requireRole('admin'), transactionController.approveTransaction);
router.get('/user/:userId', auth, requireRole('admin'), transactionController.getTransactionsByUser);

module.exports = router; 