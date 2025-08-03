const Review = require('../models/Review');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Tạo review mới (chỉ admin)
exports.createReview = async (req, res) => {
  try {
    console.log('🔄 Creating review:', req.body);
    
    let avatarUrl = req.body.avatar;
    if (req.file) {
      console.log('📸 Uploading avatar...');
      const upload = await cloudinary.uploader.upload(req.file.path, { folder: 'zuna-invest/reviews' });
      avatarUrl = upload.secure_url;
      
      // Xóa file local nếu tồn tại và là file local
      if (req.file.path && !req.file.path.startsWith('http')) {
        try {
          fs.unlinkSync(req.file.path);
          console.log('✅ Local file deleted successfully');
        } catch (unlinkError) {
          console.warn('⚠️ Could not delete local file:', unlinkError.message);
        }
      }
      
      console.log('✅ Avatar uploaded successfully');
    }

    const reviewData = {
      reviewerName: req.body.reviewerName,
      comment: req.body.comment,
      rating: Number(req.body.rating),
      avatar: avatarUrl,
      createdBy: req.user.id
    };

    const review = new Review(reviewData);
    await review.save();
    
    console.log('✅ Review created successfully');
    res.status(201).json(review);
  } catch (err) {
    console.error('❌ Error creating review:', err);
    res.status(400).json({ message: 'Tạo đánh giá thất bại', error: err.message });
  }
};

// Lấy tất cả reviews (admin)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('❌ Error getting reviews:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy reviews công khai (cho frontend)
exports.getPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isActive: true })
      .select('reviewerName comment rating avatar createdAt')
      .sort({ createdAt: -1 })
      // .limit(10); // Giới hạn 10 reviews mới nhất
    res.json(reviews);
  } catch (err) {
    console.error('❌ Error getting public reviews:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy review theo ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('createdBy', 'name email');
    if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    res.json(review);
  } catch (err) {
    console.error('❌ Error getting review:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật review
exports.updateReview = async (req, res) => {
  try {
    console.log('🔄 Updating review:', { id: req.params.id, body: req.body });
    
    let avatarUrl = req.body.avatar;
    if (req.file) {
      console.log('📸 Uploading new avatar...');
      const upload = await cloudinary.uploader.upload(req.file.path, { folder: 'zuna-invest/reviews' });
      avatarUrl = upload.secure_url;
      
      // Xóa file local nếu tồn tại và là file local
      if (req.file.path && !req.file.path.startsWith('http')) {
        try {
          fs.unlinkSync(req.file.path);
          console.log('✅ Local file deleted successfully');
        } catch (unlinkError) {
          console.warn('⚠️ Could not delete local file:', unlinkError.message);
        }
      }
      
      console.log('✅ New avatar uploaded successfully');
    }

    const updateFields = {
      reviewerName: req.body.reviewerName,
      comment: req.body.comment,
      rating: Number(req.body.rating),
      isActive: req.body.isActive
    };
    
    if (avatarUrl !== undefined) {
      updateFields.avatar = avatarUrl;
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).populate('createdBy', 'name email');
    
    if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    
    console.log('✅ Review updated successfully');
    res.json(review);
  } catch (err) {
    console.error('❌ Error updating review:', err);
    res.status(400).json({ message: 'Cập nhật thất bại', error: err.message });
  }
};

// Xóa review
exports.deleteReview = async (req, res) => {
  try {
    console.log('🔄 Deleting review:', req.params.id);
    
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    
    console.log('✅ Review deleted successfully');
    res.json({ message: 'Đã xóa đánh giá' });
  } catch (err) {
    console.error('❌ Error deleting review:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Toggle trạng thái active
exports.toggleActive = async (req, res) => {
  try {
    console.log('🔄 Toggling review status:', { id: req.params.id, active: req.body.isActive });
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    ).populate('createdBy', 'name email');
    
    if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    
    console.log('✅ Review status updated successfully');
    res.json(review);
  } catch (err) {
    console.error('❌ Error toggling review status:', err);
    res.status(400).json({ message: 'Cập nhật trạng thái thất bại', error: err.message });
  }
}; 