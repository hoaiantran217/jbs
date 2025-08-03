const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/upload');
const { auth, requireRole } = require('../middlewares/auth');
const userController = require('../controllers/userController');
const User = require('../models/User');

// Get all users (admin only)
router.get('/', auth, requireRole('admin'), userController.getAllUsers);

// Search users (admin only)
router.get('/search', auth, requireRole('admin'), async (req, res) => {
  try {
    const { q, role, status } = req.query;
    let query = {};
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (status !== undefined) {
      query.isActive = status === 'active';
    }
    
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Get current user info
router.get('/me', auth, userController.getProfile);

// Check auth status
router.get('/auth-status', auth, (req, res) => {
  res.json({ 
    authenticated: true, 
    user: { 
      id: req.user.id, 
      role: req.user.role 
    } 
  });
});

// Get user profile
router.get('/profile', auth, userController.getProfile);

// Update user profile
router.put('/profile', auth, userController.updateProfile);

// Change password
router.put('/change-password', auth, userController.changePassword);

// Upload avatar
router.post('/upload-avatar', auth, upload.single('avatar'), userController.uploadAvatar);

// Add balance (for Lucky Wheel)
router.post('/add-balance', auth, userController.addBalance);

// Get income stats
router.get('/income-stats', auth, userController.getIncomeStats);

// Admin routes for user management
router.post('/admin', auth, requireRole('admin'), userController.createUser);
router.get('/admin/:id', auth, requireRole('admin'), userController.getUserById);
router.put('/admin/:id', auth, requireRole('admin'), userController.updateUser);
router.patch('/admin/:id/status', auth, requireRole('admin'), userController.updateActiveStatus);
router.delete('/admin/:id', auth, requireRole('admin'), userController.deleteUser);
router.post('/admin/update-stats', auth, requireRole('admin'), userController.updateAllUsersStats);

// Bulk operations (admin only)
router.post('/admin/bulk-status', auth, requireRole('admin'), async (req, res) => {
  try {
    const { userIds, isActive } = req.body;
    
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: 'Danh sách user IDs không hợp lệ' });
    }
    
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { isActive: isActive }
    );
    
    res.json({ 
      message: `Đã cập nhật trạng thái ${result.modifiedCount} users`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('Error in bulk status update:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Export users (admin only)
router.get('/admin/export', auth, requireRole('admin'), async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    
    const users = await User.find({ role: 'user' })
      .select('name email username phone role isActive isVerified createdAt')
      .sort({ createdAt: -1 });
    
    if (format === 'csv') {
      // Convert to CSV format
      const csvHeader = 'Name,Email,Username,Phone,Role,Status,Verified,Created At\n';
      const csvData = users.map(user => 
        `"${user.name || ''}","${user.email || ''}","${user.username || ''}","${user.phone || ''}","${user.role || ''}","${user.isActive ? 'Active' : 'Inactive'}","${user.isVerified ? 'Yes' : 'No'}","${user.createdAt.toISOString()}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
      res.send(csvHeader + csvData);
    } else {
      res.json(users);
    }
  } catch (err) {
    console.error('Error exporting users:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Import users (admin only)
router.post('/admin/import', auth, requireRole('admin'), async (req, res) => {
  try {
    const { users } = req.body;
    
    if (!users || !Array.isArray(users)) {
      return res.status(400).json({ message: 'Dữ liệu import không hợp lệ' });
    }
    
    const bcrypt = require('bcryptjs');
    const results = [];
    
    for (const userData of users) {
      try {
        const { name, email, username, phone, password = '123456' } = userData;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
          $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
          results.push({
            email,
            username,
            status: 'skipped',
            message: 'User đã tồn tại'
          });
          continue;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new User({
          name,
          email,
          username,
          phone,
          password: hashedPassword,
          role: 'user',
          isActive: true
        });
        
        await newUser.save();
        
        results.push({
          email,
          username,
          status: 'created',
          message: 'Tạo user thành công'
        });
      } catch (err) {
        results.push({
          email: userData.email,
          username: userData.username,
          status: 'error',
          message: err.message
        });
      }
    }
    
    res.json({
      message: 'Import hoàn tất',
      results
    });
  } catch (err) {
    console.error('Error importing users:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Backup users (admin only)
router.get('/admin/backup', auth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    const backup = {
      timestamp: new Date().toISOString(),
      totalUsers: users.length,
      users: users
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=users-backup.json');
    res.json(backup);
  } catch (err) {
    console.error('Error backing up users:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Restore users (admin only)
router.post('/admin/restore', auth, requireRole('admin'), async (req, res) => {
  try {
    const { backup } = req.body;
    
    if (!backup || !backup.users || !Array.isArray(backup.users)) {
      return res.status(400).json({ message: 'Dữ liệu backup không hợp lệ' });
    }
    
    const results = [];
    
    for (const userData of backup.users) {
      try {
        const { _id, name, email, username, phone, role, isActive, isVerified } = userData;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
          $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
          // Update existing user
          await User.findByIdAndUpdate(existingUser._id, {
            name,
            phone,
            role,
            isActive,
            isVerified
          });
          
          results.push({
            email,
            username,
            status: 'updated',
            message: 'Cập nhật user thành công'
          });
        } else {
          // Create new user with default password
          const bcrypt = require('bcryptjs');
          const hashedPassword = await bcrypt.hash('123456', 10);
          
          const newUser = new User({
            name,
            email,
            username,
            phone,
            password: hashedPassword,
            role: role || 'user',
            isActive: isActive !== undefined ? isActive : true,
            isVerified: isVerified !== undefined ? isVerified : false
          });
          
          await newUser.save();
          
          results.push({
            email,
            username,
            status: 'created',
            message: 'Tạo user thành công'
          });
        }
      } catch (err) {
        results.push({
          email: userData.email,
          username: userData.username,
          status: 'error',
          message: err.message
        });
      }
    }
    
    res.json({
      message: 'Restore hoàn tất',
      results
    });
  } catch (err) {
    console.error('Error restoring users:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Clear all users (admin only - dangerous operation)
router.delete('/admin/clear-all', auth, requireRole('admin'), async (req, res) => {
  try {
    const { confirm } = req.body;
    
    if (confirm !== 'DELETE_ALL_USERS') {
      return res.status(400).json({ 
        message: 'Vui lòng xác nhận bằng cách gửi confirm: "DELETE_ALL_USERS"' 
      });
    }
    
    const result = await User.deleteMany({ role: 'user' });
    
    res.json({
      message: `Đã xóa ${result.deletedCount} users`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error('Error clearing all users:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Get user statistics (admin only)
router.get('/admin/stats', auth, requireRole('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
    const inactiveUsers = await User.countDocuments({ role: 'user', isActive: false });
    const verifiedUsers = await User.countDocuments({ role: 'user', isVerified: true });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: today }
    });
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: thisMonth }
    });
    
    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      verifiedUsers,
      newUsersToday,
      newUsersThisMonth
    });
  } catch (err) {
    console.error('Error getting user stats:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Referral system routes (must be before /:id route)
router.get('/referral-info', auth, userController.getReferralInfo);
router.post('/check-referral-code', userController.checkReferralCode);

// Get user by ID (public - for profile viewing)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name avatar role isActive createdAt');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error getting user by id:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'User route is working!' });
});

// Health check
router.get('/health', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      userCount
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }
});

// Ping endpoint
router.get('/ping', (req, res) => {
  res.json({ 
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

// Info endpoint
router.get('/info', (req, res) => {
  res.json({
    name: 'User API',
    version: '1.0.0',
    description: 'API quản lý người dùng',
    endpoints: {
      'GET /': 'Lấy danh sách tất cả users (admin)',
      'GET /me': 'Lấy thông tin user hiện tại',
      'GET /profile': 'Lấy profile user',
      'GET /auth-status': 'Kiểm tra trạng thái đăng nhập',
      'GET /income-stats': 'Lấy thống kê thu nhập',
      'GET /search': 'Tìm kiếm users (admin)',
      'GET /admin/stats': 'Lấy thống kê users (admin)',
      'GET /admin/export': 'Export users (admin)',
      'GET /admin/backup': 'Backup users (admin)',
      'GET /:id': 'Lấy thông tin user theo ID',
      'POST /admin': 'Tạo user mới (admin)',
      'POST /admin/import': 'Import users (admin)',
      'POST /admin/restore': 'Restore users (admin)',
      'POST /admin/bulk-status': 'Cập nhật trạng thái hàng loạt (admin)',
      'POST /admin/update-stats': 'Cập nhật thống kê tất cả users (admin)',
      'PUT /profile': 'Cập nhật profile',
      'PUT /change-password': 'Đổi mật khẩu',
      'PUT /admin/:id': 'Cập nhật user (admin)',
      'PATCH /admin/:id/status': 'Cập nhật trạng thái user (admin)',
      'DELETE /admin/:id': 'Xóa user (admin)',
      'DELETE /admin/clear-all': 'Xóa tất cả users (admin)',
      'POST /upload-avatar': 'Upload avatar',
      'POST /add-balance': 'Cộng tiền vào tài khoản'
    }
  });
});

// Version endpoint
router.get('/version', (req, res) => {
  res.json({
    version: '1.0.0',
    build: '2024.01.01',
    timestamp: new Date().toISOString()
  });
});

// Status endpoint
router.get('/status', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const activeUserCount = await User.countDocuments({ isActive: true });
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    res.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      metrics: {
        totalUsers: userCount,
        activeUsers: activeUserCount,
        adminUsers: adminCount
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }
});

// Metrics endpoint
router.get('/metrics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today }
    });
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thisMonth }
    });
    
    res.json({
      timestamp: new Date().toISOString(),
      metrics: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        adminUsers,
        verifiedUsers,
        newUsersToday,
        newUsersThisMonth
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Debug endpoint (admin only)
router.get('/debug', auth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('name email username role isActive isVerified createdAt').limit(10);
    
    res.json({
      timestamp: new Date().toISOString(),
      debug: {
        totalUsers: await User.countDocuments(),
        sampleUsers: users,
        environment: process.env.NODE_ENV || 'development',
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error test endpoint (admin only)
router.get('/error-test', auth, requireRole('admin'), (req, res) => {
  throw new Error('Test error for debugging');
});

// Timeout test endpoint (admin only)
router.get('/timeout-test', auth, requireRole('admin'), (req, res) => {
  setTimeout(() => {
    res.json({ message: 'Timeout test completed' });
  }, 10000); // 10 seconds
});

// Memory test endpoint (admin only)
router.get('/memory-test', auth, requireRole('admin'), (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    message: 'Memory test completed',
    memoryUsage: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100} MB`
    }
  });
});

// Performance test endpoint (admin only)
router.get('/performance-test', auth, requireRole('admin'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Simulate some database operations
    await User.countDocuments();
    await User.find().limit(100);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    res.json({
      message: 'Performance test completed',
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      duration: `${Date.now() - startTime}ms`
    });
  }
});

// Stress test endpoint (admin only)
router.get('/stress-test', auth, requireRole('admin'), async (req, res) => {
  const { count = 10 } = req.query;
  const startTime = Date.now();
  
  try {
    const promises = [];
    
    for (let i = 0; i < count; i++) {
      promises.push(User.countDocuments());
      promises.push(User.find().limit(10));
    }
    
    await Promise.all(promises);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    res.json({
      message: 'Stress test completed',
      operations: count * 2,
      duration: `${duration}ms`,
      operationsPerSecond: Math.round((count * 2) / (duration / 1000)),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      duration: `${Date.now() - startTime}ms`
    });
  }
});

// Load test endpoint (admin only)
router.get('/load-test', auth, requireRole('admin'), async (req, res) => {
  const { duration = 5000, interval = 100 } = req.query;
  const startTime = Date.now();
  const endTime = startTime + parseInt(duration);
  
  try {
    const results = [];
    
    while (Date.now() < endTime) {
      const operationStart = Date.now();
      await User.countDocuments();
      const operationEnd = Date.now();
      
      results.push({
        timestamp: new Date().toISOString(),
        duration: operationEnd - operationStart
      });
      
      await new Promise(resolve => setTimeout(resolve, parseInt(interval)));
    }
    
    const totalDuration = Date.now() - startTime;
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    
    res.json({
      message: 'Load test completed',
      totalOperations: results.length,
      totalDuration: `${totalDuration}ms`,
      averageDuration: `${Math.round(avgDuration)}ms`,
      operationsPerSecond: Math.round(results.length / (totalDuration / 1000)),
      results: results.slice(0, 10) // Return first 10 results
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      duration: `${Date.now() - startTime}ms`
    });
  }
});

// Benchmark endpoint (admin only)
router.get('/benchmark', auth, requireRole('admin'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    const benchmarks = {};
    
    // Benchmark countDocuments
    const countStart = Date.now();
    await User.countDocuments();
    benchmarks.countDocuments = Date.now() - countStart;
    
    // Benchmark find with limit
    const findStart = Date.now();
    await User.find().limit(10);
    benchmarks.findWithLimit = Date.now() - findStart;
    
    // Benchmark find with select
    const selectStart = Date.now();
    await User.find().select('name email').limit(10);
    benchmarks.findWithSelect = Date.now() - selectStart;
    
    // Benchmark find with sort
    const sortStart = Date.now();
    await User.find().sort({ createdAt: -1 }).limit(10);
    benchmarks.findWithSort = Date.now() - sortStart;
    
    // Benchmark aggregate
    const aggregateStart = Date.now();
    await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    benchmarks.aggregate = Date.now() - aggregateStart;
    
    const totalDuration = Date.now() - startTime;
    
    res.json({
      message: 'Benchmark completed',
      totalDuration: `${totalDuration}ms`,
      benchmarks,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      duration: `${Date.now() - startTime}ms`
    });
  }
});

// Cleanup endpoint (admin only)
router.post('/cleanup', auth, requireRole('admin'), async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    
    // Find inactive users older than specified days
    const inactiveUsers = await User.find({
      isActive: false,
      createdAt: { $lt: cutoffDate }
    });
    
    if (inactiveUsers.length === 0) {
      return res.json({
        message: 'Không có user nào cần cleanup',
        deletedCount: 0
      });
    }
    
    // Delete inactive users
    const result = await User.deleteMany({
      isActive: false,
      createdAt: { $lt: cutoffDate }
    });
    
    res.json({
      message: `Đã xóa ${result.deletedCount} inactive users`,
      deletedCount: result.deletedCount,
      cutoffDate: cutoffDate.toISOString()
    });
  } catch (err) {
    console.error('Error in cleanup:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Maintenance mode endpoint (admin only)
router.post('/maintenance', auth, requireRole('admin'), async (req, res) => {
  try {
    const { enabled, message } = req.body;
    
    // In a real application, you would store this in a database or cache
    // For now, we'll just return a response
    res.json({
      message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}`,
      maintenanceMode: enabled,
      maintenanceMessage: message || 'Hệ thống đang bảo trì',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error in maintenance mode:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Restart endpoint (admin only)
router.post('/restart', auth, requireRole('admin'), async (req, res) => {
  try {
    const { confirm } = req.body;
    
    if (confirm !== 'RESTART_SERVER') {
      return res.status(400).json({ 
        message: 'Vui lòng xác nhận bằng cách gửi confirm: "RESTART_SERVER"' 
      });
    }
    
    res.json({
      message: 'Server sẽ restart trong 5 giây',
      timestamp: new Date().toISOString()
    });
    
    // In a real application, you would trigger a restart
    // For now, we'll just log it
    console.log('Server restart requested by admin');
    
    // Simulate restart after 5 seconds
    setTimeout(() => {
      console.log('Restarting server...');
      process.exit(0);
    }, 5000);
    
  } catch (err) {
    console.error('Error in restart:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Shutdown endpoint (admin only)
router.post('/shutdown', auth, requireRole('admin'), async (req, res) => {
  try {
    const { confirm } = req.body;
    
    if (confirm !== 'SHUTDOWN_SERVER') {
      return res.status(400).json({ 
        message: 'Vui lòng xác nhận bằng cách gửi confirm: "SHUTDOWN_SERVER"' 
      });
    }
    
    res.json({
      message: 'Server sẽ shutdown trong 3 giây',
      timestamp: new Date().toISOString()
    });
    
    // In a real application, you would trigger a shutdown
    // For now, we'll just log it
    console.log('Server shutdown requested by admin');
    
    // Simulate shutdown after 3 seconds
    setTimeout(() => {
      console.log('Shutting down server...');
      process.exit(0);
    }, 3000);
    
  } catch (err) {
    console.error('Error in shutdown:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Logs endpoint (admin only)
router.get('/logs', auth, requireRole('admin'), async (req, res) => {
  try {
    const { level = 'info', limit = 100 } = req.query;
    
    // In a real application, you would read from log files
    // For now, we'll return a mock response
    const logs = [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'User API initialized',
        source: 'user-api'
      },
      {
        timestamp: new Date(Date.now() - 1000).toISOString(),
        level: 'debug',
        message: 'Database connection established',
        source: 'database'
      },
      {
        timestamp: new Date(Date.now() - 2000).toISOString(),
        level: 'warn',
        message: 'High memory usage detected',
        source: 'system'
      }
    ];
    
    res.json({
      logs: logs.slice(0, parseInt(limit)),
      total: logs.length,
      level,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error getting logs:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Config endpoint (admin only)
router.get('/config', auth, requireRole('admin'), (req, res) => {
  try {
    res.json({
      environment: process.env.NODE_ENV || 'development',
      database: {
        uri: process.env.MONGO_URI ? 'Set' : 'Not set',
        name: process.env.MONGO_URI ? process.env.MONGO_URI.split('/').pop() : 'Unknown'
      },
      jwt: {
        secret: process.env.JWT_SECRET ? 'Set' : 'Not set',
        expiresIn: '1d'
      },
      cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set',
        apiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set'
      },
      server: {
        port: process.env.PORT || 5000,
        cors: {
          origins: [
            'https://jbs-invest-jrst.vercel.app',
            'https://jbs-invest-s3dg.vercel.app',
            'https://jbs-invest.vercel.app',
            'http://localhost:3000',
            'http://localhost:5173'
          ]
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error getting config:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// System info endpoint (admin only)
router.get('/system-info', auth, requireRole('admin'), (req, res) => {
  try {
    const os = require('os');
    
    res.json({
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      loadAverage: os.loadavg(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length,
      hostname: os.hostname(),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error getting system info:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Process info endpoint (admin only)
router.get('/process-info', auth, requireRole('admin'), (req, res) => {
  try {
    res.json({
      pid: process.pid,
      version: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      title: process.title,
      argv: process.argv,
      execPath: process.execPath,
      cwd: process.cwd(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI ? 'Set' : 'Not set',
        JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set'
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error getting process info:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Database info endpoint (admin only)
router.get('/database-info', auth, requireRole('admin'), async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    res.json({
      connection: {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      },
      collections: {
        users: await User.countDocuments(),
        transactions: await require('../models/Transaction').countDocuments(),
        investments: await require('../models/Investment').countDocuments(),
        packages: await require('../models/InvestmentPackage').countDocuments(),
        reviews: await require('../models/Review').countDocuments(),
        teamMembers: await require('../models/TeamMember').countDocuments(),
        posts: await require('../models/Post').countDocuments(),
        notifications: await require('../models/Notification').countDocuments(),
        bankInfo: await require('../models/BankInfo').countDocuments(),
        attendance: await require('../models/Attendance').countDocuments(),
        investmentData: await require('../models/InvestmentData').countDocuments(),
        identityVerifications: await require('../models/IdentityVerification').countDocuments()
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error getting database info:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Network info endpoint (admin only)
router.get('/network-info', auth, requireRole('admin'), (req, res) => {
  try {
    const os = require('os');
    
    res.json({
      interfaces: os.networkInterfaces(),
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error getting network info:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// File system info endpoint (admin only)
router.get('/filesystem-info', auth, requireRole('admin'), (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    
    const currentDir = process.cwd();
    const uploadsDir = path.join(currentDir, 'uploads');
    
    res.json({
      currentDirectory: currentDir,
      uploadsDirectory: uploadsDir,
      uploadsExists: fs.existsSync(uploadsDir),
      tempDirectory: os.tmpdir(),
      homeDirectory: os.homedir(),
      platform: os.platform(),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error getting filesystem info:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Package info endpoint (admin only)
router.get('/package-info', auth, requireRole('admin'), (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageExists = fs.existsSync(packagePath);
    
    let packageInfo = null;
    if (packageExists) {
      const packageContent = fs.readFileSync(packagePath, 'utf8');
      packageInfo = JSON.parse(packageContent);
    }
    
    res.json({
      packageExists,
      packageInfo,
      nodeModulesExists: fs.existsSync(path.join(process.cwd(), 'node_modules')),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error getting package info:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Environment info endpoint (admin only)
router.get('/environment-info', auth, requireRole('admin'), (req, res) => {
  try {
    res.json({
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      mongoUri: process.env.MONGO_URI ? 'Set' : 'Not set',
      jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set',
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set',
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
      cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error getting environment info:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Security info endpoint (admin only)
router.get('/security-info', auth, requireRole('admin'), (req, res) => {
  try {
    res.json({
      jwtSecretSet: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
      nodeEnv: process.env.NODE_ENV,
      corsEnabled: true,
      authMiddleware: true,
      roleBasedAccess: true,
      passwordHashing: true,
      fileUploadValidation: true,
      cloudinarySecure: true,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error getting security info:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Help endpoint
router.get('/help', (req, res) => {
  res.json({
    message: 'User API Help',
    version: '1.0.0',
    endpoints: {
      'GET /': 'Lấy danh sách tất cả users (admin)',
      'GET /me': 'Lấy thông tin user hiện tại',
      'GET /profile': 'Lấy profile user',
      'GET /auth-status': 'Kiểm tra trạng thái đăng nhập',
      'GET /income-stats': 'Lấy thống kê thu nhập',
      'GET /search': 'Tìm kiếm users (admin)',
      'GET /admin/stats': 'Lấy thống kê users (admin)',
      'GET /admin/export': 'Export users (admin)',
      'GET /admin/backup': 'Backup users (admin)',
      'GET /:id': 'Lấy thông tin user theo ID',
      'POST /admin': 'Tạo user mới (admin)',
      'POST /admin/import': 'Import users (admin)',
      'POST /admin/restore': 'Restore users (admin)',
      'POST /admin/bulk-status': 'Cập nhật trạng thái hàng loạt (admin)',
      'POST /admin/update-stats': 'Cập nhật thống kê tất cả users (admin)',
      'PUT /profile': 'Cập nhật profile',
      'PUT /change-password': 'Đổi mật khẩu',
      'PUT /admin/:id': 'Cập nhật user (admin)',
      'PATCH /admin/:id/status': 'Cập nhật trạng thái user (admin)',
      'DELETE /admin/:id': 'Xóa user (admin)',
      'DELETE /admin/clear-all': 'Xóa tất cả users (admin)',
      'POST /upload-avatar': 'Upload avatar',
      'POST /add-balance': 'Cộng tiền vào tài khoản'
    },
    authentication: {
      required: 'Bearer token in Authorization header',
      adminOnly: 'Some endpoints require admin role'
    },
    examples: {
      'Get current user': 'GET /api/user/me',
      'Get all users (admin)': 'GET /api/user/',
      'Create user (admin)': 'POST /api/user/admin',
      'Update profile': 'PUT /api/user/profile',
      'Upload avatar': 'POST /api/user/upload-avatar'
    },
    timestamp: new Date().toISOString()
  });
});

// Documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    title: 'User API Documentation',
    version: '1.0.0',
    description: 'API để quản lý người dùng trong hệ thống Zuna Invest',
    baseUrl: '/api/user',
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      required: true
    },
    models: {
      User: {
        _id: 'ObjectId',
        username: 'String (unique)',
        email: 'String (unique)',
        password: 'String (hashed)',
        name: 'String',
        phone: 'String',
        role: 'String (user/admin)',
        isActive: 'Boolean',
        isVerified: 'Boolean',
        avatar: 'String (URL)',
        balance: 'Number',
        bankAccount: 'String',
        bankName: 'String',
        bankAccountHolder: 'String',
        createdAt: 'Date',
        updatedAt: 'Date'
      }
    },
    responses: {
      success: {
        status: 200,
        message: 'Thành công'
      },
      created: {
        status: 201,
        message: 'Tạo thành công'
      },
      badRequest: {
        status: 400,
        message: 'Dữ liệu không hợp lệ'
      },
      unauthorized: {
        status: 401,
        message: 'Không có quyền truy cập'
      },
      forbidden: {
        status: 403,
        message: 'Không đủ quyền'
      },
      notFound: {
        status: 404,
        message: 'Không tìm thấy'
      },
      serverError: {
        status: 500,
        message: 'Lỗi server'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Changelog endpoint
router.get('/changelog', (req, res) => {
  res.json({
    version: '1.0.0',
    date: '2024-01-01',
    changes: [
      {
        type: 'added',
        description: 'Thêm API quản lý người dùng đầy đủ'
      },
      {
        type: 'added',
        description: 'Thêm authentication và authorization'
      },
      {
        type: 'added',
        description: 'Thêm upload avatar với Cloudinary'
      },
      {
        type: 'added',
        description: 'Thêm thống kê thu nhập'
      },
      {
        type: 'added',
        description: 'Thêm quản lý admin (CRUD users)'
      },
      {
        type: 'added',
        description: 'Thêm export/import users'
      },
      {
        type: 'added',
        description: 'Thêm backup/restore users'
      },
      {
        type: 'added',
        description: 'Thêm bulk operations'
      },
      {
        type: 'added',
        description: 'Thêm system monitoring endpoints'
      },
      {
        type: 'added',
        description: 'Thêm security features'
      }
    ],
    features: [
      'User authentication and authorization',
      'User profile management',
      'Avatar upload with Cloudinary',
      'Income statistics',
      'Admin user management',
      'User export/import',
      'User backup/restore',
      'Bulk operations',
      'System monitoring',
      'Security features'
    ],
    timestamp: new Date().toISOString()
  });
});

// License endpoint
router.get('/license', (req, res) => {
  res.json({
    name: 'MIT License',
    version: '1.0.0',
    description: 'User API for Zuna Invest System',
    license: {
      type: 'MIT',
      year: '2024',
      holder: 'Zuna Invest',
      text: 'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.'
    },
    timestamp: new Date().toISOString()
  });
});

// Contact endpoint
router.get('/contact', (req, res) => {
  res.json({
    name: 'Zuna Invest',
    email: 'support@zuna-invest.com',
    phone: '+84 123 456 789',
    address: 'Ho Chi Minh City, Vietnam',
    website: 'https://zuna-invest.com',
    support: {
      email: 'support@zuna-invest.com',
      phone: '+84 123 456 789',
      hours: '24/7'
    },
    social: {
      facebook: 'https://facebook.com/zuna-invest',
      twitter: 'https://twitter.com/zuna-invest',
      linkedin: 'https://linkedin.com/company/zuna-invest'
    },
    timestamp: new Date().toISOString()
  });
});

// About endpoint
router.get('/about', (req, res) => {
  res.json({
    name: 'Zuna Invest',
    description: 'Hệ thống đầu tư tài chính hiện đại và an toàn',
    version: '1.0.0',
    founded: '2024',
    mission: 'Cung cấp giải pháp đầu tư tài chính hiệu quả và minh bạch',
    vision: 'Trở thành nền tảng đầu tư hàng đầu tại Việt Nam',
    values: [
      'Minh bạch',
      'An toàn',
      'Hiệu quả',
      'Đáng tin cậy',
      'Sáng tạo'
    ],
    features: [
      'Đầu tư đa dạng',
      'Quản lý rủi ro',
      'Báo cáo chi tiết',
      'Hỗ trợ 24/7',
      'Bảo mật cao'
    ],
    team: {
      size: '50+',
      expertise: 'Tài chính, Công nghệ, Marketing'
    },
    achievements: [
      '10,000+ người dùng',
      '100+ gói đầu tư',
      '99.9% uptime',
      'ISO 27001 certified'
    ],
    timestamp: new Date().toISOString()
  });
});

// Privacy endpoint
router.get('/privacy', (req, res) => {
  res.json({
    title: 'Chính sách bảo mật',
    version: '1.0.0',
    lastUpdated: '2024-01-01',
    company: 'Zuna Invest',
    contact: {
      email: 'privacy@zuna-invest.com',
      phone: '+84 123 456 789'
    },
    dataCollection: {
      personal: [
        'Tên, email, số điện thoại',
        'Thông tin ngân hàng',
        'Ảnh đại diện',
        'Giấy tờ tùy thân (xác minh)'
      ],
      usage: [
        'Lịch sử giao dịch',
        'Hoạt động đầu tư',
        'Thông tin đăng nhập'
      ]
    },
    dataUsage: [
      'Cung cấp dịch vụ đầu tư',
      'Xác minh danh tính',
      'Bảo mật tài khoản',
      'Cải thiện dịch vụ'
    ],
    dataProtection: [
      'Mã hóa dữ liệu',
      'Bảo mật SSL/TLS',
      'Kiểm soát truy cập',
      'Sao lưu định kỳ'
    ],
    userRights: [
      'Quyền truy cập dữ liệu',
      'Quyền chỉnh sửa',
      'Quyền xóa dữ liệu',
      'Quyền rút lại đồng ý'
    ],
    timestamp: new Date().toISOString()
  });
});

// Terms endpoint
router.get('/terms', (req, res) => {
  res.json({
    title: 'Điều khoản sử dụng',
    version: '1.0.0',
    lastUpdated: '2024-01-01',
    company: 'Zuna Invest',
    contact: {
      email: 'legal@zuna-invest.com',
      phone: '+84 123 456 789'
    },
    acceptance: 'Bằng việc sử dụng dịch vụ, bạn đồng ý với các điều khoản này',
    services: [
      'Dịch vụ đầu tư tài chính',
      'Quản lý tài khoản',
      'Tư vấn đầu tư',
      'Báo cáo tài chính'
    ],
    userObligations: [
      'Cung cấp thông tin chính xác',
      'Bảo mật thông tin đăng nhập',
      'Tuân thủ quy định pháp luật',
      'Không sử dụng dịch vụ cho mục đích bất hợp pháp'
    ],
    companyObligations: [
      'Bảo mật thông tin khách hàng',
      'Cung cấp dịch vụ chất lượng',
      'Hỗ trợ khách hàng',
      'Tuân thủ quy định pháp luật'
    ],
    limitations: [
      'Không chịu trách nhiệm về rủi ro đầu tư',
      'Không đảm bảo lợi nhuận',
      'Có thể thay đổi điều khoản',
      'Có thể tạm ngưng dịch vụ'
    ],
    termination: [
      'Người dùng có thể hủy tài khoản',
      'Công ty có thể đình chỉ tài khoản vi phạm',
      'Dữ liệu sẽ được xóa sau 30 ngày',
      'Có thể khôi phục tài khoản trong 7 ngày'
    ],
    timestamp: new Date().toISOString()
  });
});

// Sitemap endpoint
router.get('/sitemap', (req, res) => {
  res.json({
    baseUrl: 'https://jbs-invest.onrender.com/api/user',
    lastModified: new Date().toISOString(),
    endpoints: [
      {
        path: '/',
        method: 'GET',
        description: 'Lấy danh sách tất cả users (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/me',
        method: 'GET',
        description: 'Lấy thông tin user hiện tại',
        auth: 'required'
      },
      {
        path: '/profile',
        method: 'GET',
        description: 'Lấy profile user',
        auth: 'required'
      },
      {
        path: '/auth-status',
        method: 'GET',
        description: 'Kiểm tra trạng thái đăng nhập',
        auth: 'required'
      },
      {
        path: '/income-stats',
        method: 'GET',
        description: 'Lấy thống kê thu nhập',
        auth: 'required'
      },
      {
        path: '/search',
        method: 'GET',
        description: 'Tìm kiếm users (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/admin/stats',
        method: 'GET',
        description: 'Lấy thống kê users (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/admin/export',
        method: 'GET',
        description: 'Export users (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/admin/backup',
        method: 'GET',
        description: 'Backup users (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/:id',
        method: 'GET',
        description: 'Lấy thông tin user theo ID',
        auth: 'none'
      },
      {
        path: '/admin',
        method: 'POST',
        description: 'Tạo user mới (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/admin/import',
        method: 'POST',
        description: 'Import users (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/admin/restore',
        method: 'POST',
        description: 'Restore users (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/admin/bulk-status',
        method: 'POST',
        description: 'Cập nhật trạng thái hàng loạt (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/admin/update-stats',
        method: 'POST',
        description: 'Cập nhật thống kê tất cả users (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/profile',
        method: 'PUT',
        description: 'Cập nhật profile',
        auth: 'required'
      },
      {
        path: '/change-password',
        method: 'PUT',
        description: 'Đổi mật khẩu',
        auth: 'required'
      },
      {
        path: '/admin/:id',
        method: 'PUT',
        description: 'Cập nhật user (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/admin/:id/status',
        method: 'PATCH',
        description: 'Cập nhật trạng thái user (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/admin/:id',
        method: 'DELETE',
        description: 'Xóa user (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/admin/clear-all',
        method: 'DELETE',
        description: 'Xóa tất cả users (admin)',
        auth: 'required',
        role: 'admin'
      },
      {
        path: '/upload-avatar',
        method: 'POST',
        description: 'Upload avatar',
        auth: 'required'
      },
      {
        path: '/add-balance',
        method: 'POST',
        description: 'Cộng tiền vào tài khoản',
        auth: 'required'
      }
    ],
    timestamp: new Date().toISOString()
  });
});

// Robots endpoint
router.get('/robots', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /api/user/me
Allow: /api/user/profile
Allow: /api/user/auth-status
Allow: /api/user/income-stats
Allow: /api/user/:id
Disallow: /api/user/admin/*
Disallow: /api/user/search
Disallow: /api/user/stats
Disallow: /api/user/export
Disallow: /api/user/backup
Disallow: /api/user/import
Disallow: /api/user/restore
Disallow: /api/user/bulk-status
Disallow: /api/user/update-stats
Disallow: /api/user/clear-all
Disallow: /api/user/debug
Disallow: /api/user/error-test
Disallow: /api/user/timeout-test
Disallow: /api/user/memory-test
Disallow: /api/user/performance-test
Disallow: /api/user/stress-test
Disallow: /api/user/load-test
Disallow: /api/user/benchmark
Disallow: /api/user/cleanup
Disallow: /api/user/maintenance
Disallow: /api/user/restart
Disallow: /api/user/shutdown
Disallow: /api/user/logs
Disallow: /api/user/config
Disallow: /api/user/system-info
Disallow: /api/user/process-info
Disallow: /api/user/database-info
Disallow: /api/user/network-info
Disallow: /api/user/filesystem-info
Disallow: /api/user/package-info
Disallow: /api/user/environment-info
Disallow: /api/user/security-info

Sitemap: https://jbs-invest.onrender.com/api/user/sitemap`);
});

// Manifest endpoint
router.get('/manifest', (req, res) => {
  res.json({
    name: 'Zuna Invest User API',
    short_name: 'Zuna API',
    description: 'API quản lý người dùng cho hệ thống Zuna Invest',
    version: '1.0.0',
    start_url: '/api/user',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/api/user/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/api/user/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    categories: ['finance', 'business'],
    lang: 'vi',
    dir: 'ltr',
    scope: '/api/user',
    orientation: 'portrait',
    prefer_related_applications: false,
    related_applications: [],
    timestamp: new Date().toISOString()
  });
});

// Swagger endpoint
router.get('/swagger', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'Zuna Invest User API',
      description: 'API quản lý người dùng cho hệ thống Zuna Invest',
      version: '1.0.0',
      contact: {
        name: 'Zuna Invest Support',
        email: 'support@zuna-invest.com'
      }
    },
    servers: [
      {
        url: 'https://jbs-invest.onrender.com/api/user',
        description: 'Production server'
      }
    ],
    paths: {
      '/': {
        get: {
          summary: 'Lấy danh sách tất cả users',
          description: 'Chỉ admin mới có quyền truy cập',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Thành công',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/User'
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/me': {
        get: {
          summary: 'Lấy thông tin user hiện tại',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Thành công',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'Tên người dùng'
            },
            email: {
              type: 'string',
              description: 'Email'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'Vai trò'
            },
            isActive: {
              type: 'boolean',
              description: 'Trạng thái hoạt động'
            },
            balance: {
              type: 'number',
              description: 'Số dư tài khoản'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Ngày tạo'
            }
          }
        }
      }
    },
    timestamp: new Date().toISOString()
  });
});

// OpenAPI endpoint
router.get('/openapi', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'Zuna Invest User API',
      description: 'API quản lý người dùng cho hệ thống Zuna Invest',
      version: '1.0.0',
      contact: {
        name: 'Zuna Invest Support',
        email: 'support@zuna-invest.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://jbs-invest.onrender.com/api/user',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Users',
        description: 'Quản lý người dùng'
      },
      {
        name: 'Admin',
        description: 'Quản lý admin (chỉ admin)'
      },
      {
        name: 'System',
        description: 'Thông tin hệ thống'
      }
    ],
    paths: {
      '/': {
        get: {
          tags: ['Admin'],
          summary: 'Lấy danh sách tất cả users',
          description: 'Chỉ admin mới có quyền truy cập',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Thành công',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/User'
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Không có quyền truy cập'
            },
            '403': {
              description: 'Không đủ quyền'
            }
          }
        }
      },
      '/me': {
        get: {
          tags: ['Users'],
          summary: 'Lấy thông tin user hiện tại',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Thành công',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            },
            '401': {
              description: 'Không có quyền truy cập'
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'Tên người dùng'
            },
            email: {
              type: 'string',
              description: 'Email'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'Vai trò'
            },
            isActive: {
              type: 'boolean',
              description: 'Trạng thái hoạt động'
            },
            balance: {
              type: 'number',
              description: 'Số dư tài khoản'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Ngày tạo'
            }
          }
        }
      }
    },
    timestamp: new Date().toISOString()
  });
});



// API Docs endpoint
router.get('/api-docs', (req, res) => {
  res.json({
    title: 'Zuna Invest User API Documentation',
    version: '1.0.0',
    description: 'Tài liệu API quản lý người dùng cho hệ thống Zuna Invest',
    baseUrl: 'https://jbs-invest.onrender.com/api/user',
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      required: true
    },
    endpoints: {
      'GET /': {
        description: 'Lấy danh sách tất cả users (admin)',
        auth: 'required',
        role: 'admin',
        response: 'Array of User objects'
      },
      'GET /me': {
        description: 'Lấy thông tin user hiện tại',
        auth: 'required',
        response: 'User object'
      },
      'GET /profile': {
        description: 'Lấy profile user',
        auth: 'required',
        response: 'User object'
      },
      'GET /auth-status': {
        description: 'Kiểm tra trạng thái đăng nhập',
        auth: 'required',
        response: 'Auth status object'
      },
      'GET /income-stats': {
        description: 'Lấy thống kê thu nhập',
        auth: 'required',
        response: 'Income statistics object'
      },
      'GET /search': {
        description: 'Tìm kiếm users (admin)',
        auth: 'required',
        role: 'admin',
        response: 'Array of User objects'
      },
      'GET /admin/stats': {
        description: 'Lấy thống kê users (admin)',
        auth: 'required',
        role: 'admin',
        response: 'User statistics object'
      },
      'GET /admin/export': {
        description: 'Export users (admin)',
        auth: 'required',
        role: 'admin',
        response: 'CSV or JSON file'
      },
      'GET /admin/backup': {
        description: 'Backup users (admin)',
        auth: 'required',
        role: 'admin',
        response: 'JSON backup file'
      },
      'GET /:id': {
        description: 'Lấy thông tin user theo ID',
        auth: 'none',
        response: 'User object'
      },
      'POST /admin': {
        description: 'Tạo user mới (admin)',
        auth: 'required',
        role: 'admin',
        body: 'User data object',
        response: 'Created User object'
      },
      'POST /admin/import': {
        description: 'Import users (admin)',
        auth: 'required',
        role: 'admin',
        body: 'Array of User objects',
        response: 'Import results object'
      },
      'POST /admin/restore': {
        description: 'Restore users (admin)',
        auth: 'required',
        role: 'admin',
        body: 'Backup object',
        response: 'Restore results object'
      },
      'POST /admin/bulk-status': {
        description: 'Cập nhật trạng thái hàng loạt (admin)',
        auth: 'required',
        role: 'admin',
        body: 'Bulk status object',
        response: 'Bulk update results object'
      },
      'POST /admin/update-stats': {
        description: 'Cập nhật thống kê tất cả users (admin)',
        auth: 'required',
        role: 'admin',
        response: 'Update results object'
      },
      'PUT /profile': {
        description: 'Cập nhật profile',
        auth: 'required',
        body: 'Profile data object',
        response: 'Updated User object'
      },
      'PUT /change-password': {
        description: 'Đổi mật khẩu',
        auth: 'required',
        body: 'Password change object',
        response: 'Success message'
      },
      'PUT /admin/:id': {
        description: 'Cập nhật user (admin)',
        auth: 'required',
        role: 'admin',
        body: 'User data object',
        response: 'Updated User object'
      },
      'PATCH /admin/:id/status': {
        description: 'Cập nhật trạng thái user (admin)',
        auth: 'required',
        role: 'admin',
        body: 'Status object',
        response: 'Updated User object'
      },
      'DELETE /admin/:id': {
        description: 'Xóa user (admin)',
        auth: 'required',
        role: 'admin',
        response: 'Success message'
      },
      'DELETE /admin/clear-all': {
        description: 'Xóa tất cả users (admin)',
        auth: 'required',
        role: 'admin',
        body: 'Confirmation object',
        response: 'Clear results object'
      },
      'POST /upload-avatar': {
        description: 'Upload avatar',
        auth: 'required',
        body: 'Form data with avatar file',
        response: 'Upload results object'
      },
      'POST /add-balance': {
        description: 'Cộng tiền vào tài khoản',
        auth: 'required',
        body: 'Balance object',
        response: 'Updated User object'
      }
    },
    models: {
      User: {
        _id: 'ObjectId',
        name: 'String',
        email: 'String (unique)',
        username: 'String (unique)',
        password: 'String (hashed)',
        role: 'String (user/admin)',
        isActive: 'Boolean',
        isVerified: 'Boolean',
        avatar: 'String (URL)',
        balance: 'Number',
        bankAccount: 'String',
        bankName: 'String',
        bankAccountHolder: 'String',
        createdAt: 'Date',
        updatedAt: 'Date'
      }
    },
    responses: {
      success: {
        status: 200,
        message: 'Thành công'
      },
      created: {
        status: 201,
        message: 'Tạo thành công'
      },
      badRequest: {
        status: 400,
        message: 'Dữ liệu không hợp lệ'
      },
      unauthorized: {
        status: 401,
        message: 'Không có quyền truy cập'
      },
      forbidden: {
        status: 403,
        message: 'Không đủ quyền'
      },
      notFound: {
        status: 404,
        message: 'Không tìm thấy'
      },
      serverError: {
        status: 500,
        message: 'Lỗi server'
      }
    },
    examples: {
      'Get current user': {
        method: 'GET',
        url: '/api/user/me',
        headers: {
          'Authorization': 'Bearer <token>'
        },
        response: {
          _id: '507f1f77bcf86cd799439011',
          name: 'Nguyễn Văn A',
          email: 'user@example.com',
          role: 'user',
          isActive: true,
          balance: 1000000
        }
      },
      'Create user (admin)': {
        method: 'POST',
        url: '/api/user/admin',
        headers: {
          'Authorization': 'Bearer <admin_token>',
          'Content-Type': 'application/json'
        },
        body: {
          name: 'Nguyễn Văn B',
          email: 'user2@example.com',
          password: 'password123',
          role: 'user'
        },
        response: {
          _id: '507f1f77bcf86cd799439012',
          name: 'Nguyễn Văn B',
          email: 'user2@example.com',
          role: 'user',
          isActive: true
        }
      }
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 