const TeamMember = require('../models/TeamMember');

// Get all team members (public)
exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    res.json(teamMembers);
  } catch (err) {
    console.error('Error getting team members:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get all team members (admin)
exports.getAllTeamMembersAdmin = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find()
      .sort({ order: 1, createdAt: -1 });
    res.json(teamMembers);
  } catch (err) {
    console.error('Error getting team members:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get single team member
exports.getTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Không tìm thấy thành viên' });
    }
    res.json(teamMember);
  } catch (err) {
    console.error('Error getting team member:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Create team member
exports.createTeamMember = async (req, res) => {
  try {
    const { name, position, title, description, email, phone, linkedin, experience, education, achievements, order, color } = req.body;

    const teamMember = new TeamMember({
      name,
      position,
      title,
      description,
      email,
      phone,
      linkedin,
      experience,
      education,
      achievements: achievements || [],
      order: order || 0,
      color: color || 'blue'
    });

    await teamMember.save();
    res.status(201).json(teamMember);
  } catch (err) {
    console.error('Error creating team member:', err);
    res.status(400).json({ message: 'Tạo thành viên thất bại', error: err.message });
  }
};

// Update team member
exports.updateTeamMember = async (req, res) => {
  try {
    const { name, position, title, description, email, phone, linkedin, experience, education, achievements, order, isActive, color } = req.body;
    
    // Validate _id
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: 'ID thành viên không hợp lệ' });
    }

    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      {
        name,
        position,
        title,
        description,
        email,
        phone,
        linkedin,
        experience,
        education,
        achievements: achievements || [],
        order: order || 0,
        isActive,
        color: color || 'blue'
      },
      { new: true }
    );

    if (!teamMember) {
      return res.status(404).json({ message: 'Không tìm thấy thành viên' });
    }

    res.json(teamMember);
  } catch (err) {
    console.error('Error updating team member:', err);
    res.status(400).json({ message: 'Cập nhật thành viên thất bại', error: err.message });
  }
};

// Delete team member
exports.deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Không tìm thấy thành viên' });
    }
    res.json({ message: 'Đã xóa thành viên' });
  } catch (err) {
    console.error('Error deleting team member:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Upload team member avatar
exports.uploadTeamMemberAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file ảnh được upload' });
    }

    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Không tìm thấy thành viên' });
    }

    // Upload to Cloudinary
    const cloudinary = require('cloudinary').v2;
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'team-avatars',
      width: 300,
      height: 300,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto'
    });

    // Delete local file after upload to Cloudinary
    const fs = require('fs');
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Update team member avatar
    teamMember.avatar = result.secure_url;
    await teamMember.save();

    res.json({
      message: 'Upload avatar thành công',
      teamMember,
      avatarUrl: result.secure_url
    });
  } catch (error) {
    console.error('Error uploading team member avatar:', error);
    
    // Clean up local file if upload fails
    if (req.file) {
      const fs = require('fs');
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
    
    res.status(500).json({ message: 'Lỗi server khi upload avatar' });
  }
};

// Update team member active status
exports.updateTeamMemberStatus = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    );
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Không tìm thấy thành viên' });
    }
    
    res.json(teamMember);
  } catch (err) {
    console.error('Error updating team member status:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 