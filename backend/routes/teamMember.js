const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/upload');
const { auth } = require('../middlewares/auth');
const teamMemberController = require('../controllers/teamMemberController');

// Public routes
router.get('/public', teamMemberController.getAllTeamMembers);

// Admin routes (require authentication)
router.get('/', auth, teamMemberController.getAllTeamMembersAdmin);
router.get('/:id', auth, teamMemberController.getTeamMember);
router.post('/', auth, teamMemberController.createTeamMember);
router.put('/:id', auth, teamMemberController.updateTeamMember);
router.delete('/:id', auth, teamMemberController.deleteTeamMember);
router.post('/:id/avatar', auth, upload.single('avatar'), teamMemberController.uploadTeamMemberAvatar);
router.patch('/:id/status', auth, teamMemberController.updateTeamMemberStatus);

module.exports = router; 