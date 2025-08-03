const User = require('../models/User');
const Transaction = require('../models/Transaction');
const InvestmentPackage = require('../models/InvestmentPackage');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin: lấy thống kê tổng quan
exports.getDashboardStats = async (req, res) => {
  try {
    // USERS
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    const [totalUsers, activeUsers, newThisWeek] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', isActive: true }),
      User.countDocuments({ role: 'user', createdAt: { $gte: weekAgo } })
    ]);

    // TRANSACTIONS
    const [
      totalTransactions,
      depositCount,
      withdrawCount,
      investmentCount,
      interestCount,
      pendingCount,
      approvedCount,
      rejectedCount,
      recentTransactions
    ] = await Promise.all([
      Transaction.countDocuments(),
      Transaction.countDocuments({ type: 'deposit' }),
      Transaction.countDocuments({ type: 'withdraw' }),
      Transaction.countDocuments({ type: 'investment' }),
      Transaction.countDocuments({ type: 'interest' }),
      Transaction.countDocuments({ status: 'pending' }),
      Transaction.countDocuments({ status: 'approved' }),
      Transaction.countDocuments({ status: 'rejected' }),
      Transaction.countDocuments({ createdAt: { $gte: weekAgo } })
    ]);

    // TRANSACTION AMOUNTS
    const [
      totalDeposits,
      totalWithdrawals,
      totalInterest,
      totalInvestments
    ] = await Promise.all([
      Transaction.aggregate([
        { $match: { type: 'deposit', status: 'approved' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Transaction.aggregate([
        { $match: { type: 'withdraw', status: 'approved' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Transaction.aggregate([
        { $match: { type: 'interest', status: 'approved' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Transaction.aggregate([
        { $match: { type: 'investment', status: 'approved' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    // PACKAGES
    const [totalPackages, activePackages] = await Promise.all([
      InvestmentPackage.countDocuments(),
      InvestmentPackage.countDocuments({ isActive: true })
    ]);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisWeek: newThisWeek
      },
      transactions: {
        total: totalTransactions,
        byType: {
          deposit: depositCount,
          withdraw: withdrawCount,
          investment: investmentCount,
          interest: interestCount
        },
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        recent: {
          transactions: recentTransactions
        }
      },
      amounts: {
        totalDeposits: totalDeposits[0]?.total || 0,
        totalWithdrawals: totalWithdrawals[0]?.total || 0,
        totalInterest: totalInterest[0]?.total || 0,
        totalInvestments: totalInvestments[0]?.total || 0
      },
      packages: {
        total: totalPackages,
        active: activePackages
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Admin: Reset toàn bộ database (CHỈ DÙNG KHI CẦN THIẾT!)
exports.resetDatabase = async (req, res) => {
  try {
    console.log('⚠️  ADMIN ĐANG RESET DATABASE!');
    
    // Xóa tất cả collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      console.log(`🗑️  Đang xóa collection: ${collection.name}`);
      await mongoose.connection.db.dropCollection(collection.name);
    }

    // Tạo lại admin user mặc định
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@zuna.com',
      password: hashedPassword,
      role: 'admin',
      balance: 0,
      isActive: true
    });
    await adminUser.save();

    res.json({ 
      message: '✅ Đã reset toàn bộ database thành công!',
      warning: '⚠️  Tất cả dữ liệu đã bị xóa vĩnh viễn!'
    });
    
  } catch (error) {
    console.error('❌ Lỗi khi reset database:', error);
    res.status(500).json({ message: 'Lỗi khi reset database', error: error.message });
  }
};

// Lấy thống kê chi tiết theo thời gian
exports.getTimeBasedStats = async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    let startDate = new Date();
    
    switch (period) {
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // Thống kê giao dịch theo ngày
    const transactionStats = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: "$type"
          },
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.date": 1 }
      }
    ]);

    // Thống kê người dùng mới theo ngày
    const userStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      period,
      startDate,
      transactionStats,
      userStats
    });
  } catch (err) {
    console.error('Time-based stats error:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 

// Xóa toàn bộ dữ liệu database (CHỈ DÀNH CHO ADMIN)
exports.clearAllData = async (req, res) => {
  try {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền thực hiện hành động này' });
    }

    const { confirmation, password } = req.body;
    
    // Yêu cầu xác nhận đặc biệt
    if (confirmation !== 'DELETE_ALL_DATA_CONFIRM') {
      return res.status(400).json({ 
        message: 'Xác nhận không đúng. Vui lòng nhập: DELETE_ALL_DATA_CONFIRM' 
      });
    }

    // Kiểm tra password admin
    const admin = await User.findById(req.user.id);
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Mật khẩu admin không đúng' });
    }

    console.log('🚨 ADMIN CLEARING ALL DATABASE DATA...');
    console.log('Admin:', req.user.email);
    console.log('Time:', new Date().toISOString());

    // Xóa tất cả collections
    const collections = [
      'users',
      'transactions', 
      'investments',
      'investmentpackages',
      'posts',
      'notifications',
      'reviews',
      'bankinfos',
      'attendances',
      'teammembers',
      'investmentdata',
      'identityverifications',
      'withdrawalnotifications',
      'transactionnotifications',
      'securityconfigs',
      'referraltransactions'
    ];

    let deletedCount = 0;
    for (const collectionName of collections) {
      try {
        const collection = mongoose.connection.collection(collectionName);
        const result = await collection.deleteMany({});
        deletedCount += result.deletedCount;
        console.log(`✅ Deleted ${result.deletedCount} documents from ${collectionName}`);
      } catch (err) {
        console.log(`⚠️ Error deleting ${collectionName}:`, err.message);
      }
    }

    // Tạo admin mặc định
    const defaultAdmin = new User({
      username: 'admin',
      email: 'admin@jbs.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Administrator',
      role: 'admin',
      isActive: true,
      balance: 0,
      referralCode: 'admin@jbs.com'
    });
    await defaultAdmin.save();

    console.log('✅ Created default admin account');
    console.log('📊 Total documents deleted:', deletedCount);

    res.json({ 
      message: 'Đã xóa toàn bộ dữ liệu thành công',
      deletedCount,
      defaultAdmin: {
        email: 'admin@jbs.com',
        password: 'admin123'
      }
    });

  } catch (err) {
    console.error('❌ Error clearing database:', err);
    res.status(500).json({ message: 'Lỗi khi xóa dữ liệu' });
  }
}; 

// Điều khiển console output
exports.controlConsole = async (req, res) => {
  try {
    const { action, levels } = req.body;
    const consoleManager = require('../utils/consoleManager');

    switch (action) {
      case 'disableAll':
        consoleManager.disableAll();
        res.json({ message: 'Đã chặn tất cả console output' });
        break;
      
      case 'disableLevels':
        if (levels && Array.isArray(levels)) {
          consoleManager.disableLevels(levels);
          res.json({ message: `Đã chặn console levels: ${levels.join(', ')}` });
        } else {
          res.status(400).json({ message: 'Thiếu tham số levels' });
        }
        break;
      
      case 'restoreAll':
        consoleManager.restoreAll();
        res.json({ message: 'Đã khôi phục tất cả console output' });
        break;
      
      case 'getStatus':
        const status = consoleManager.getStatus();
        res.json({ 
          message: 'Trạng thái console output',
          status 
        });
        break;
      
      default:
        res.status(400).json({ message: 'Hành động không hợp lệ' });
    }
  } catch (err) {
    console.error('❌ Error controlling console:', err);
    res.status(500).json({ message: 'Lỗi khi điều khiển console' });
  }
}; 