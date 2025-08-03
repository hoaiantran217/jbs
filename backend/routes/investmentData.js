const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const {
  getInvestmentData,
  getInvestmentDataAdmin,
  updateTotalInvested,
  addActiveInvestment,
  deleteActiveInvestment,
  clearAllActiveInvestments
} = require('../controllers/investmentDataController');

// Public routes
router.get('/public', getInvestmentData);

// Admin routes (require authentication)
router.get('/admin', auth, getInvestmentDataAdmin);
router.put('/admin/total-invested', auth, updateTotalInvested);
router.post('/admin/active-investment', auth, addActiveInvestment);
router.delete('/admin/active-investment/:investmentId', auth, deleteActiveInvestment);
router.delete('/admin/active-investments', auth, clearAllActiveInvestments);

module.exports = router; 