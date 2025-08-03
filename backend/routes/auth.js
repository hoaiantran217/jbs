const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middlewares/auth');

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, bankAccount, bankName, balance, referralCode } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });
    
    let userRole = 'user';
    const userCount = await User.countDocuments();
    // Nếu là user đầu tiên, tự động là admin
    if (userCount === 0) {
      userRole = 'admin';
    } else if (role === 'admin' && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === 'admin') userRole = 'admin';
      } catch {}
    } else if (role === 'user') {
      userRole = 'user';
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

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Sử dụng email làm mã giới thiệu
    const newReferralCode = email;
    
    const userData = { 
      name, 
      email, 
      password: hashedPassword, 
      role: userRole,
      bankAccount: bankAccount || '',
      bankName: bankName || '',
      balance: balance || 0,
      referralCode: newReferralCode,
      referredBy: referredBy
    };
    
    const user = new User(userData);
    await user.save();

    // Áp dụng khuyến mãi cho thành viên mới
    const promotionController = require('../controllers/promotionController');
    const promotionApplied = await promotionController.applyPromotionToNewUser(user._id);
    if (promotionApplied) {
      console.log(`🎁 Promotion applied to new user: ${user.email}`);
    }

    // Nếu có người giới thiệu, cập nhật thống kê và tạo thông báo
    if (referredBy) {
      await User.findByIdAndUpdate(referredBy, {
        $inc: { referralCount: 1 },
        $push: {
          referralHistory: {
            referredUser: user._id,
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
        message: `${user.name} đã đăng ký với mã giới thiệu của bạn!`,
        type: 'referral',
        data: {
          referredUserId: user._id,
          referredUserName: user.name,
          referredUserEmail: user.email
        }
      });
      await notification.save();
      
      console.log(`Referral count updated and notification created for user ${referredBy}`);
    }

    res.status(201).json({ message: 'Đăng ký thành công', role: userRole });
  } catch (err) {
    console.error('Error in register:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Kiểm tra mã giới thiệu
router.post('/check-referral', async (req, res) => {
  try {
    const { referralCode } = req.body;
    
    if (!referralCode || !referralCode.trim()) {
      return res.status(400).json({ 
        valid: false, 
        message: 'Vui lòng nhập email người giới thiệu' 
      });
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(referralCode)) {
      return res.status(400).json({ 
        valid: false, 
        message: 'Email không hợp lệ' 
      });
    }

    const referrer = await User.findOne({ email: referralCode.toLowerCase() });
    if (!referrer) {
      return res.status(404).json({ 
        valid: false, 
        message: 'Email người giới thiệu không tồn tại' 
      });
    }

    res.json({
      valid: true,
      referrerName: referrer.name,
      message: 'Email người giới thiệu hợp lệ'
    });
  } catch (err) {
    console.error('Error checking referral code:', err);
    res.status(500).json({ 
      valid: false, 
      message: 'Lỗi server' 
    });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Tìm user bằng email hoặc username
    const user = await User.findOne({
      $or: [
        { email: email },
        { username: email }
      ]
    });
    
    if (!user) return res.status(400).json({ message: 'Sai email/tên đăng nhập hoặc mật khẩu' });
    if (!user.isActive) return res.status(400).json({ message: 'Tài khoản đã bị khóa' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Sai email/tên đăng nhập hoặc mật khẩu' });
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        username: user.username,
        role: user.role 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Tạo admin mới (route ẩn)
router.post('/create-admin', async (req, res) => {
  try {
    console.log('Create admin request received:', req.body);
    
    const { username, email, password, fullName, phone } = req.body;
    
    // Validation
    if (!username || !email || !password || !fullName) {
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user admin mới
    const adminUser = new User({
      username,
      email,
      password: hashedPassword,
      name: fullName,
      phone,
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('Admin created successfully:', adminUser._id);

    res.status(201).json({ 
      message: 'Tạo admin thành công',
      user: {
        id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    });
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo admin: ' + err.message });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Vui lòng nhập email' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
    }
    
    // Tạo reset token (có thể sử dụng JWT với thời gian ngắn)
    const resetToken = jwt.sign(
      { id: user._id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Trong thực tế, bạn sẽ gửi email với link reset
    // Hiện tại chỉ trả về token để test
    res.json({
      message: 'Link reset password đã được gửi đến email của bạn',
      resetToken: resetToken // Chỉ trả về trong môi trường development
    });
  } catch (err) {
    console.error('Error in forgot password:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ message: 'Token không hợp lệ' });
    }
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error('Error in reset password:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Logout (optional - for server-side token invalidation)
router.post('/logout', auth, (req, res) => {
  // Trong thực tế, bạn có thể lưu token vào blacklist
  // Hiện tại chỉ trả về thông báo thành công
  res.json({ message: 'Đăng xuất thành công' });
});

// Refresh token
router.post('/refresh-token', auth, (req, res) => {
  try {
    // Tạo token mới với thời gian dài hơn
    const newToken = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token: newToken,
      message: 'Token đã được làm mới'
    });
  } catch (err) {
    console.error('Error refreshing token:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Check if email exists
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Vui lòng nhập email' });
    }
    
    const user = await User.findOne({ email });
    res.json({ 
      exists: !!user,
      message: user ? 'Email đã tồn tại' : 'Email có thể sử dụng'
    });
  } catch (err) {
    console.error('Error checking email:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Check if username exists
router.post('/check-username', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập' });
    }
    
    const user = await User.findOne({ username });
    res.json({ 
      exists: !!user,
      message: user ? 'Tên đăng nhập đã tồn tại' : 'Tên đăng nhập có thể sử dụng'
    });
  } catch (err) {
    console.error('Error checking username:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working!' });
});

module.exports = router; 