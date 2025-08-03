const express = require('express');
const router = express.Router();
const referralTransactionController = require('../controllers/referralTransactionController');
const { auth, requireRole } = require('../middlewares/auth');

// Admin routes
router.get('/', auth, requireRole('admin'), referralTransactionController.getAllReferralTransactions);
router.patch('/:id/approve', auth, requireRole('admin'), referralTransactionController.approveReferralTransaction);
router.get('/stats', auth, requireRole('admin'), referralTransactionController.getReferralStats);

module.exports = router; 