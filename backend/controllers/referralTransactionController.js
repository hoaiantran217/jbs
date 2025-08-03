const ReferralTransaction = require('../models/ReferralTransaction');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// Admin: Lấy tất cả giao dịch giới thiệu
exports.getAllReferralTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const type = req.query.type;
    
    // Xây dựng filter
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    // Tính toán skip cho phân trang
    const skip = (page - 1) * limit;
    
    // Thực hiện query với phân trang và sắp xếp
    const transactions = await ReferralTransaction.find(filter)
      .populate('referrer', 'name email')
      .populate('referredUser', 'name email')
      .populate('approvedBy', 'name')
      .populate('depositTransaction', 'amount createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Đếm tổng số records
    const total = await ReferralTransaction.countDocuments(filter);
    
    res.json({
      transactions: transactions,
      total: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error getting referral transactions:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Admin: Duyệt giao dịch giới thiệu
exports.approveReferralTransaction = async (req, res) => {
  try {
    const { status, reason } = req.body;
    const transactionId = req.params.id;
    
    const transaction = await ReferralTransaction.findById(transactionId)
      .populate('referrer', 'name email balance')
      .populate('referredUser', 'name email');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch giới thiệu' });
    }
    
    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Giao dịch đã được xử lý' });
    }
    
    // Cập nhật trạng thái
    transaction.status = status;
    transaction.approvedBy = req.user.id;
    transaction.approvedAt = new Date();
    
    if (status === 'rejected' && reason) {
      transaction.reason = reason;
    }
    
    await transaction.save();
    
    // Nếu duyệt, cộng tiền cho người giới thiệu
    if (status === 'approved') {
      const referrer = await User.findById(transaction.referrer._id);
      referrer.balance = Math.round(referrer.balance + transaction.amount);
      referrer.referralEarnings = Math.round((referrer.referralEarnings || 0) + transaction.amount);
      
      // Cập nhật referralHistory
      referrer.referralHistory.push({
        referredUser: transaction.referredUser._id,
        amount: transaction.amount,
        type: transaction.type,
        date: new Date()
      });
      
      await referrer.save();
      
      // Tạo thông báo cho người giới thiệu
      const notification = new Notification({
        recipient: transaction.referrer._id,
        title: 'Thưởng giới thiệu đã được duyệt',
        message: `Bạn nhận được ${transaction.amount.toLocaleString()} VNĐ thưởng giới thiệu từ ${transaction.referredUser.name}!`,
        type: 'referral_bonus_approved',
        data: {
          referredUserId: transaction.referredUser._id,
          referredUserName: transaction.referredUser.name,
          bonusAmount: transaction.amount,
          type: transaction.type
        }
      });
      await notification.save();
      
      console.log(`✅ Referral transaction approved: ${transaction.amount} for user ${transaction.referrer._id}`);
    } else if (status === 'rejected') {
      // Tạo thông báo từ chối
      const notification = new Notification({
        recipient: transaction.referrer._id,
        title: 'Thưởng giới thiệu bị từ chối',
        message: `Thưởng giới thiệu ${transaction.amount.toLocaleString()} VNĐ từ ${transaction.referredUser.name} đã bị từ chối.${reason ? ` Lý do: ${reason}` : ''}`,
        type: 'referral_bonus_rejected',
        data: {
          referredUserId: transaction.referredUser._id,
          referredUserName: transaction.referredUser.name,
          bonusAmount: transaction.amount,
          reason: reason
        }
      });
      await notification.save();
      
      console.log(`❌ Referral transaction rejected: ${transaction.amount} for user ${transaction.referrer._id}`);
    }
    
    res.json({ 
      message: `Giao dịch giới thiệu đã được ${status === 'approved' ? 'duyệt' : 'từ chối'}`,
      transaction: transaction
    });
  } catch (err) {
    console.error('Error approving referral transaction:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Tạo giao dịch giới thiệu mới (được gọi từ processReferralBonus)
exports.createReferralTransaction = async (referrerId, referredUserId, amount, type, depositTransactionId) => {
  try {
    const transaction = new ReferralTransaction({
      referrer: referrerId,
      referredUser: referredUserId,
      amount: amount,
      type: type,
      status: 'pending',
      depositTransaction: depositTransactionId
    });
    
    await transaction.save();
    console.log(`📝 Created referral transaction: ${amount} for referrer ${referrerId}`);
    return transaction;
  } catch (err) {
    console.error('Error creating referral transaction:', err);
    throw err;
  }
};

// Lấy thống kê giao dịch giới thiệu
exports.getReferralStats = async (req, res) => {
  try {
    const stats = await ReferralTransaction.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    const totalStats = await ReferralTransaction.aggregate([
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          approvedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          }
        }
      }
    ]);
    
    res.json({
      stats: stats,
      total: totalStats[0] || {
        totalCount: 0,
        totalAmount: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0
      }
    });
  } catch (err) {
    console.error('Error getting referral stats:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 