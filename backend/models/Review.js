const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewerName: { 
    type: String, 
    required: [true, 'Tên người đánh giá là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên không được quá 100 ký tự']
  },
  comment: { 
    type: String, 
    required: [true, 'Nội dung đánh giá là bắt buộc'],
    trim: true,
    maxlength: [1000, 'Nội dung đánh giá không được quá 1000 ký tự']
  },
  rating: { 
    type: Number, 
    required: [true, 'Đánh giá sao là bắt buộc'],
    min: [1, 'Đánh giá tối thiểu là 1 sao'],
    max: [5, 'Đánh giá tối đa là 5 sao']
  },
  avatar: { 
    type: String, 
    default: null // URL của avatar, null thì dùng icon mặc định
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema); 