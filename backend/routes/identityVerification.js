const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { uploadIdentity, uploadMultiple } = require('../middlewares/upload');
const {
  submitVerification,
  getMyVerification,
  getAllVerifications,
  getVerificationById,
  processVerification,
  uploadIdImage
} = require('../controllers/identityVerificationController');

// User routes (require authentication)
router.post('/submit', auth, submitVerification);
router.get('/my-verification', auth, getMyVerification);
router.post('/upload-image', auth, uploadIdentity.single('image'), uploadIdImage);
router.post('/upload-multiple', auth, uploadMultiple.array('images', 5), uploadIdImage);



// Admin routes (require authentication)
router.get('/admin', auth, getAllVerifications);
router.get('/admin/:id', auth, getVerificationById);
router.put('/admin/:id/process', auth, processVerification);

module.exports = router; 