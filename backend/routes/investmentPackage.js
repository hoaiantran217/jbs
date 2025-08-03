const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/upload');
const { auth, requireRole } = require('../middlewares/auth');
const investmentPackageController = require('../controllers/investmentPackageController');

// Public
router.get('/', investmentPackageController.getAllPackages);
router.get('/:id', investmentPackageController.getPackageById);

// Admin
router.post('/', auth, requireRole('admin'), upload.single('image'), investmentPackageController.createPackage);
router.put('/:id', auth, requireRole('admin'), upload.single('image'), investmentPackageController.updatePackage);
router.delete('/:id', auth, requireRole('admin'), investmentPackageController.deletePackage);

module.exports = router; 