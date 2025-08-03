const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/upload');
const { auth, requireRole } = require('../middlewares/auth');
const reviewController = require('../controllers/reviewController');

// Public routes (cho frontend)
router.get('/public', reviewController.getPublicReviews);

// Admin routes (cần đăng nhập và quyền admin)
router.get('/', auth, requireRole('admin'), reviewController.getAllReviews);
router.get('/:id', auth, requireRole('admin'), reviewController.getReviewById);
router.post('/', auth, requireRole('admin'), upload.single('avatar'), reviewController.createReview);
router.put('/:id', auth, requireRole('admin'), upload.single('avatar'), reviewController.updateReview);
router.delete('/:id', auth, requireRole('admin'), reviewController.deleteReview);
router.patch('/:id/active', auth, requireRole('admin'), reviewController.toggleActive);

module.exports = router; 