const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Investment = require('../models/Investment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
// Không cần import referralCode utils nữa vì sử dụng email

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      // 1. Tính toán lợi nhuận (income) - chỉ tính tiền lãi từ các giao dịch interest
      const interestTransactions = await Transaction.find({
        user: req.user.id,
        type: 'interest',
        status: 'approved'
      });
      
      const totalIncome = interestTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
      
      // 2. Tính toán số tiền đã rút (withdrawable) - tổng số tiền đã rút thành công
      const withdrawTransactions = await Transaction.find({
        user: req.user.id,
        type: 'withdraw',
        status: 'approved'
      });
      
      const totalWithdrawn = withdrawTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
      
      // 3. Tính toán tổng doanh thu (withdrawing) - gốc + lãi từ các khoản đầu tư đã hoàn thành
      const completedInvestments = await Investment.find({
        userId: req.user.id,
        status: 'completed'
      });
      
      const totalRevenue = completedInvestments.reduce((sum, inv) => {
        // Tổng doanh thu = gốc + lãi
        const principal = inv.amount || 0;
        const interest = inv.totalInterest || 0;
        return sum + principal + interest;
      }, 0);
      
      // Cập nhật thông tin user
      user.income = Math.round(totalIncome);
      user.withdrawable = Math.round(totalWithdrawn);
      user.balance = Math.round(user.balance || 0);
      user.withdrawing = Math.round(totalRevenue);
    }
    res.json(user);
  } catch (err) {
    console.error('Error in getProfile:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error getting user by id:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, name, phone, role = 'user', referralCode } = req.body;
    
    // Validation
    if (!username || !email || !password || !name) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }
    
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Kiểm tra username đã tồn tại
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    // Xử lý mã giới thiệu (email)
    let referredBy = null;
    if (referralCode && referralCode.trim()) {
      // Kiểm tra email hợp lệ
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(referralCode)) {
        return res.status(400).json({ message: 'Email người giới thiệu không hợp lệ' });
      }
      
      // Tìm user có email này
      const referrer = await User.findOne({ email: referralCode.toLowerCase() });
      if (!referrer) {
        return res.status(400).json({ message: 'Email người giới thiệu không tồn tại' });
      }
      
      referredBy = referrer._id;
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Sử dụng email làm mã giới thiệu
    const newReferralCode = email;

    // Tạo user mới
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name,
      phone,
      role,
      isActive: true,
      referralCode: newReferralCode,
      referredBy: referredBy
    });

    await newUser.save();
    console.log('User created successfully:', newUser._id);

    // Áp dụng khuyến mãi cho thành viên mới
    const promotionController = require('./promotionController');
    const promotionApplied = await promotionController.applyPromotionToNewUser(newUser._id);
    if (promotionApplied) {
      console.log(`🎁 Promotion applied to new user: ${newUser.email}`);
    }

    // Nếu có người giới thiệu, cập nhật thống kê và tạo thông báo
    if (referredBy) {
      await User.findByIdAndUpdate(referredBy, {
        $inc: { referralCount: 1 },
        $push: {
          referralHistory: {
            referredUser: newUser._id,
            amount: 0, // Chưa có thưởng vì chưa nạp tiền
            type: 'new_referral',
            date: new Date()
          }
        }
      });
      
      // Tạo thông báo cho người giới thiệu
      const Notification = require('../models/Notification');
      const notification = new Notification({
        recipient: referredBy,
        title: 'Người được giới thiệu mới',
        message: `${newUser.name} đã đăng ký với mã giới thiệu của bạn!`,
        type: 'referral',
        data: {
          referredUserId: newUser._id,
          referredUserName: newUser.name,
          referredUserEmail: newUser.email
        }
      });
      await notification.save();
      
      console.log(`Referral count updated and notification created for user ${referredBy}`);
    }

    res.status(201).json({ 
      message: 'Tạo user thành công',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        referralCode: newUser.referralCode
      }
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo user: ' + err.message });
  }
};

exports.updateActiveStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    
    // Chỉ cho phép cập nhật những trường được phép
    const updateFields = {};
    if (req.body.name !== undefined) updateFields.name = req.body.name;
    if (req.body.email !== undefined) updateFields.email = req.body.email;
    if (req.body.role !== undefined) updateFields.role = req.body.role;
    if (req.body.balance !== undefined) updateFields.balance = Number(req.body.balance);
    if (req.body.isActive !== undefined) updateFields.isActive = req.body.isActive;
    if (req.body.bankAccount !== undefined) updateFields.bankAccount = req.body.bankAccount;
    if (req.body.bankName !== undefined) updateFields.bankName = req.body.bankName;
    if (req.body.bankAccountHolder !== undefined) updateFields.bankAccountHolder = req.body.bankAccountHolder;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    
    console.log('✅ User updated successfully');
    res.json(user);
  } catch (err) {
    console.error('❌ Error updating user:', err);
    res.status(400).json({ message: 'Cập nhật thất bại', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log('🔄 Delete user request:', { userId: req.params.id });
    
    const user = await User.findById(req.params.id);
    if (!user) {
      console.log('❌ User not found:', req.params.id);
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }
    
    // Không cho phép xóa admin
    if (user.role === 'admin') {
      console.log('❌ Cannot delete admin user:', req.params.id);
      return res.status(403).json({ message: 'Không thể xóa tài khoản admin' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    console.log('✅ User deleted successfully');
    res.json({ message: 'Đã xóa user' });
  } catch (err) {
    console.error('❌ Error deleting user:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, bankAccount, bankName, bankAccountHolder, avatar } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if account is locked
    if (user.isActive === false) {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bankAccount !== undefined) user.bankAccount = bankAccount;
    if (bankName !== undefined) user.bankName = bankName;
    if (bankAccountHolder !== undefined) user.bankAccountHolder = bankAccountHolder;
    
    // Handle avatar removal
    if (avatar === null) {
      user.avatar = null;
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if account is locked
    if (user.isActive === false) {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// API để lấy thống kê thu nhập chi tiết
exports.getIncomeStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Lấy tất cả giao dịch lãi đã được duyệt
    const interestTransactions = await Transaction.find({
      user: userId,
      type: 'interest',
      status: 'approved'
    }).sort({ createdAt: -1 });
    
    // Tính tổng thu nhập
    const totalIncome = interestTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    
    // Tính thu nhập theo tháng (6 tháng gần nhất)
    const monthlyIncome = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthTransactions = interestTransactions.filter(tx => {
        const txDate = new Date(tx.createdAt);
        return txDate >= month && txDate < nextMonth;
      });
      
      const monthTotal = monthTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
      
      monthlyIncome.push({
        month: month.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
        income: monthTotal,
        count: monthTransactions.length
      });
    }
    
    // Lấy giao dịch lãi gần nhất
    const recentInterests = interestTransactions.slice(0, 10);
    
    res.json({
      totalIncome: Math.round(totalIncome),
      monthlyIncome,
      recentInterests,
      totalTransactions: interestTransactions.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// API để cập nhật thống kê tài chính cho tất cả users (chỉ admin)
exports.updateAllUsersStats = async (req, res) => {
  try {
    console.log('🔄 Updating financial stats for all users...');
    
    const users = await User.find({ role: 'user' });
    let updatedCount = 0;
    
    for (const user of users) {
      try {
        // 1. Tính toán lợi nhuận (income) - chỉ tính tiền lãi từ các giao dịch interest
        const interestTransactions = await Transaction.find({
          user: user._id,
          type: 'interest',
          status: 'approved'
        });
        
        const totalIncome = interestTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
        
        // 2. Tính toán số tiền đã rút (withdrawable) - tổng số tiền đã rút thành công
        const withdrawTransactions = await Transaction.find({
          user: user._id,
          type: 'withdraw',
          status: 'approved'
        });
        
        const totalWithdrawn = withdrawTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
        
        // 3. Tính toán tổng doanh thu (withdrawing) - gốc + lãi từ các khoản đầu tư đã hoàn thành
        const completedInvestments = await Investment.find({
          userId: user._id,
          status: 'completed'
        });
        
        const totalRevenue = completedInvestments.reduce((sum, inv) => {
          // Tổng doanh thu = gốc + lãi
          const principal = inv.amount || 0;
          const interest = inv.totalInterest || 0;
          return sum + principal + interest;
        }, 0);
        
        // Cập nhật user
        await User.findByIdAndUpdate(user._id, {
          income: Math.round(totalIncome),
          withdrawable: Math.round(totalWithdrawn),
          withdrawing: Math.round(totalRevenue)
        });
        
        updatedCount++;
        console.log(`✅ Updated stats for user: ${user.email}`);
      } catch (userError) {
        console.error(`❌ Error updating user ${user.email}:`, userError);
      }
    }
    
    console.log(`✅ Successfully updated stats for ${updatedCount} users`);
    res.json({ 
      message: `Đã cập nhật thống kê cho ${updatedCount} users`,
      updatedCount 
    });
  } catch (err) {
    console.error('❌ Error updating all users stats:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 

// Test endpoint để kiểm tra authentication
exports.testAuth = async (req, res) => {
  try {
    console.log('🧪 Test auth endpoint called');
    console.log('🔍 User from token:', req.user);
    
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'Authentication successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (err) {
    console.error('❌ Test auth error:', err);
    res.status(500).json({ message: 'Test auth failed', error: err.message });
  }
}; 

// Upload avatar to Cloudinary
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn hình ảnh' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
      width: 300,
      height: 300,
      crop: 'fill',
      gravity: 'face'
    });

    // Update user avatar
    user.avatar = result.secure_url;
    await user.save();

    // Delete old file if exists
    if (req.file) {
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }

    res.json({
      success: true,
      message: 'Avatar đã được cập nhật thành công',
      avatar: result.secure_url
    });

  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi upload avatar' });
  }
}; 

// Add balance (for Lucky Wheel)
exports.addBalance = async (req, res) => {
  try {
    console.log('🔍 add-balance endpoint called');
    console.log('Request body:', req.body);
    console.log('User ID:', req.user.id);

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      console.log('❌ Invalid amount:', amount);
      return res.status(400).json({
        success: false,
        message: 'Số tiền không hợp lệ'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('❌ User not found:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    console.log('💰 Current balance:', user.balance);
    console.log('💰 Adding amount:', amount);

    // Cộng tiền vào tài khoản
    user.balance = (user.balance || 0) + amount;
    await user.save();

    console.log('✅ New balance:', user.balance);

    res.json({
      success: true,
      message: `Đã cộng ${amount.toLocaleString()}đ vào tài khoản`,
      newBalance: user.balance
    });

  } catch (error) {
    console.error('❌ Lỗi khi cộng tiền:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cộng tiền'
    });
  }
}; 

// Lấy thông tin giới thiệu của user
exports.getReferralInfo = async (req, res) => {
  try {
    console.log('Getting referral info for user:', req.user.id);
    
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    console.log('User found:', user.name, 'Email:', user.email);

    // Tạo referralCode cho user mới (không có referralCode)
    if (!user.referralCode) {
      console.log('User has no referral code, creating new one...');
      try {
        await User.findByIdAndUpdate(user._id, { referralCode: user.email });
        user.referralCode = user.email;
        console.log('Created referral code for user:', user.referralCode);
      } catch (err) {
        console.error('Error creating referral code:', err);
        // Không tạo referralCode nếu có lỗi
        user.referralCode = null;
      }
    }

    // Lấy danh sách người được giới thiệu
    const referredUsers = await User.find({ referredBy: req.user.id })
      .select('name email createdAt')
      .sort({ createdAt: -1 });

    console.log('Found referred users:', referredUsers.length);

    // Lấy thông tin người giới thiệu (nếu có)
    let referrer = null;
    if (user.referredBy) {
      referrer = await User.findById(user.referredBy).select('name email');
      console.log('Referrer found:', referrer?.name);
    }

    const response = {
      referralCode: user.referralCode || null,
      referralCount: user.referralCount || 0,
      referralEarnings: user.referralEarnings || 0,
      referralHistory: [],
      referredUsers,
      referrer
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (err) {
    console.error('Error getting referral info:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      message: 'Lỗi server',
      error: err.message,
      details: err.toString()
    });
  }
};

// Kiểm tra mã giới thiệu (email)
exports.checkReferralCode = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Vui lòng nhập email người giới thiệu' });
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(code)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    const referrer = await User.findOne({ email: code.toLowerCase() });
    if (!referrer) {
      return res.status(404).json({ message: 'Email người giới thiệu không tồn tại' });
    }

    res.json({
      valid: true,
      referrerName: referrer.name,
      message: 'Email người giới thiệu hợp lệ'
    });
  } catch (err) {
    console.error('Error checking referral code:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Tính thưởng giới thiệu cho lần nạp đầu tiên
exports.processReferralBonus = async (userId, depositAmount) => {
  try {
    console.log(`🎯 Starting referral bonus process for user ${userId}, amount: ${depositAmount}`);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log(`❌ User not found: ${userId}`);
      return;
    }
    
    if (!user.referredBy) {
      console.log(`❌ User ${userId} has no referrer`);
      return;
    }

    // Tính thưởng 5% cho lần nạp đầu tiên
    const bonusAmount = Math.round(depositAmount * 0.05);
    console.log(`💰 Calculated bonus: ${bonusAmount} (5% of ${depositAmount})`);
    
    // Lấy thông tin người giới thiệu
    const referrer = await User.findById(user.referredBy);
    if (!referrer) {
      console.log(`❌ Referrer not found: ${user.referredBy}`);
      return;
    }
    
    console.log(`👤 Referrer: ${referrer.name} (${referrer.email})`);
    
    // Tạo ReferralTransaction với status pending (không tự động cộng tiền)
    const ReferralTransaction = require('../models/ReferralTransaction');
    const transaction = new ReferralTransaction({
      referrer: user.referredBy,
      referredUser: userId,
      amount: bonusAmount,
      type: 'first_deposit',
      status: 'pending'
    });
    
    await transaction.save();
    
    console.log(`📝 Created referral transaction: ${bonusAmount} for referrer ${user.referredBy}`);
    console.log(`✅ Referral transaction created successfully: ${bonusAmount} for user ${user.referredBy}`);
  } catch (err) {
    console.error('❌ Error processing referral bonus:', err);
  }
};

// Tính thưởng giới thiệu cho lợi nhuận hàng tháng
exports.processMonthlyReferralBonus = async (userId, profitAmount) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.referredBy) {
      return;
    }

    // Tính thưởng 1-2% cho lợi nhuận hàng tháng
    const bonusPercentage = Math.random() < 0.5 ? 0.01 : 0.02; // 1% hoặc 2%
    const bonusAmount = Math.round(profitAmount * bonusPercentage);
    
    if (bonusAmount > 0) {
      // Cập nhật thông tin người giới thiệu
      await User.findByIdAndUpdate(user.referredBy, {
        $inc: { 
          balance: bonusAmount,
          referralEarnings: bonusAmount
        },
        $push: {
          referralHistory: {
            referredUser: userId,
            amount: bonusAmount,
            type: 'monthly_profit',
            date: new Date()
          }
        }
      });

      console.log(`Monthly referral bonus processed: ${bonusAmount} for user ${user.referredBy}`);
    }
  } catch (err) {
    console.error('Error processing monthly referral bonus:', err);
  }
}; 