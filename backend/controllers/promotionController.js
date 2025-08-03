const PromotionConfig = require('../models/PromotionConfig');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Lấy cấu hình khuyến mãi hiện tại
exports.getPromotionConfig = async (req, res) => {
  try {
    let config = await PromotionConfig.findOne().sort({ createdAt: -1 });
    
    if (!config) {
      // Tạo cấu hình mặc định nếu chưa có
      config = new PromotionConfig({
        isEnabled: false,
        amount: 0,
        description: 'Khuyến mãi cho thành viên mới'
      });
      await config.save();
    }
    
    res.json(config);
  } catch (err) {
    console.error('Error getting promotion config:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật cấu hình khuyến mãi
exports.updatePromotionConfig = async (req, res) => {
  try {
    const { isEnabled, amount, description } = req.body;
    
    // Validation
    if (amount && ![200000, 500000, 800000].includes(amount)) {
      return res.status(400).json({ 
        message: 'Số tiền khuyến mãi phải là 200k, 500k hoặc 800k' 
      });
    }
    
    let config = await PromotionConfig.findOne().sort({ createdAt: -1 });
    
    if (!config) {
      config = new PromotionConfig();
    }
    
    config.isEnabled = isEnabled !== undefined ? isEnabled : config.isEnabled;
    config.amount = amount !== undefined ? amount : config.amount;
    config.description = description || config.description;
    config.updatedAt = new Date();
    
    await config.save();
    
    res.json({
      message: 'Cập nhật cấu hình khuyến mãi thành công',
      config
    });
  } catch (err) {
    console.error('Error updating promotion config:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Áp dụng khuyến mãi cho user mới
exports.applyPromotionToNewUser = async (userId) => {
  try {
    console.log(`🎁 Applying promotion to new user: ${userId}`);
    
    // Lấy cấu hình khuyến mãi hiện tại
    const config = await PromotionConfig.findOne().sort({ createdAt: -1 });
    
    if (!config || !config.isEnabled || config.amount <= 0) {
      console.log('❌ Promotion is disabled or invalid amount');
      return false;
    }
    
    // Kiểm tra user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return false;
    }
    
    // Kiểm tra user đã được áp dụng khuyến mãi chưa
    const existingPromotion = await Transaction.findOne({
      user: userId,
      type: 'promotion',
      status: 'approved'
    });
    
    if (existingPromotion) {
      console.log('❌ User already received promotion');
      return false;
    }
    
    // Tạo giao dịch khuyến mãi
    const promotionTransaction = new Transaction({
      user: userId,
      type: 'promotion',
      amount: config.amount,
      status: 'approved',
      description: config.description || 'Khuyến mãi cho thành viên mới',
      approvedAt: new Date()
    });
    
    await promotionTransaction.save();
    
    // Cộng tiền vào tài khoản user
    user.balance = (user.balance || 0) + config.amount;
    await user.save();
    
    console.log(`✅ Promotion applied successfully: ${config.amount.toLocaleString()}đ for user ${user.email}`);
    
    // Tạo thông báo cho user
    const Notification = require('../models/Notification');
    const notification = new Notification({
      recipient: userId,
      title: 'Chào mừng thành viên mới! 🎉',
      message: `Bạn đã nhận được ${config.amount.toLocaleString()}đ khuyến mãi từ hệ thống. Chúc bạn đầu tư thành công!`,
      type: 'promotion',
      data: {
        amount: config.amount,
        type: 'new_user_promotion'
      }
    });
    await notification.save();
    
    return true;
  } catch (err) {
    console.error('❌ Error applying promotion:', err);
    return false;
  }
};

// Lấy lịch sử khuyến mãi
exports.getPromotionHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find({
      type: 'promotion',
      status: 'approved'
    })
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
    const total = await Transaction.countDocuments({
      type: 'promotion',
      status: 'approved'
    });
    
    const totalAmount = await Transaction.aggregate([
      {
        $match: {
          type: 'promotion',
          status: 'approved'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    res.json({
      transactions,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (err) {
    console.error('Error getting promotion history:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 