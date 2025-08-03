const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middlewares/auth');
const notificationCtrl = require('../controllers/notificationController');

// Public
router.get('/', notificationCtrl.getAllNotifications);
router.get('/:id', notificationCtrl.getNotificationById);

// Admin only
router.post('/', auth, requireRole('admin'), notificationCtrl.createNotification);
router.delete('/:id', auth, requireRole('admin'), notificationCtrl.deleteNotification);

module.exports = router; 