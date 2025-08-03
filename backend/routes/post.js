const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middlewares/auth');
const postCtrl = require('../controllers/postController');

// Public
router.get('/', postCtrl.getAllPosts);
router.get('/:id', postCtrl.getPostById);

// Admin only
router.post('/', auth, requireRole('admin'), postCtrl.createPost);
router.put('/:id', auth, requireRole('admin'), postCtrl.updatePost);
router.delete('/:id', auth, requireRole('admin'), postCtrl.deletePost);
router.patch('/:id/active', auth, requireRole('admin'), postCtrl.toggleActive);

module.exports = router; 