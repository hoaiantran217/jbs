const IdentityVerification = require('../models/IdentityVerification');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo'
});

// Người dùng gửi yêu cầu xác minh danh tính
const submitVerification = async (req, res) => {
  try {
    const { fullName, dateOfBirth, idType, idNumber, frontImage, backImage } = req.body;
    const userId = req.user.id;

    // Kiểm tra xem người dùng đã có yêu cầu xác minh chưa
    const existingVerification = await IdentityVerification.findOne({ userId });
    if (existingVerification) {
      return res.status(400).json({ 
        message: 'Bạn đã có yêu cầu xác minh danh tính. Vui lòng chờ xử lý.' 
      });
    }

    // Tạo yêu cầu xác minh mới
    const verification = new IdentityVerification({
      userId,
      fullName,
      dateOfBirth,
      idType,
      idNumber,
      frontImage,
      backImage
    });

    await verification.save();

    res.json({
      success: true,
      message: 'Gửi yêu cầu xác minh danh tính thành công',
      data: verification
    });
  } catch (error) {
    console.error('Error submitting verification:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Người dùng xem trạng thái xác minh của mình
const getMyVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    const verification = await IdentityVerification.findOne({ userId });

    if (!verification) {
      return res.json({
        success: true,
        data: null,
        message: 'Chưa có yêu cầu xác minh danh tính'
      });
    }

    res.json({
      success: true,
      data: verification
    });
  } catch (error) {
    console.error('Error getting verification:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Admin lấy danh sách tất cả yêu cầu xác minh
const getAllVerifications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const verifications = await IdentityVerification.find(query)
      .populate('userId', 'username email fullName')
      .populate('processedBy', 'username fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await IdentityVerification.countDocuments(query);

    res.json({
      success: true,
      data: verifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error getting all verifications:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Admin xem chi tiết yêu cầu xác minh
const getVerificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const verification = await IdentityVerification.findById(id)
      .populate('userId', 'username email fullName phone')
      .populate('processedBy', 'username fullName');

    if (!verification) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu xác minh' });
    }

    res.json({
      success: true,
      data: verification
    });
  } catch (error) {
    console.error('Error getting verification by id:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Admin xử lý yêu cầu xác minh
const processVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const adminId = req.user.id;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const verification = await IdentityVerification.findById(id);
    if (!verification) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu xác minh' });
    }

    if (verification.status !== 'pending') {
      return res.status(400).json({ message: 'Yêu cầu này đã được xử lý' });
    }

    // Cập nhật trạng thái
    verification.status = status;
    verification.adminNotes = adminNotes || '';
    verification.processedAt = new Date();
    verification.processedBy = adminId;

    await verification.save();

    // Nếu được chấp thuận, cập nhật trạng thái xác minh của user
    if (status === 'approved') {
      await User.findByIdAndUpdate(verification.userId, {
        isVerified: true,
        verifiedAt: new Date()
      });
    }

    res.json({
      success: true,
      message: `Xử lý yêu cầu xác minh ${status === 'approved' ? 'thành công' : 'từ chối'}`,
      data: verification
    });
  } catch (error) {
    console.error('Error processing verification:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Upload ảnh giấy tờ với Cloudinary (như avatar)
const uploadIdImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng tải lên ảnh' });
    }

    console.log('Upload ID image file info:', {
      path: req.file.path,
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Multer-storage-cloudinary đã tự động upload lên Cloudinary
    res.json({
      success: true,
      message: 'Tải ảnh thành công',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        secureUrl: req.file.path
      }
    });
  } catch (error) {
    console.error('Error uploading ID image:', error);
    res.status(500).json({ message: 'Lỗi khi tải ảnh' });
  }
};



module.exports = {
  submitVerification,
  getMyVerification,
  getAllVerifications,
  getVerificationById,
  processVerification,
  uploadIdImage
}; 