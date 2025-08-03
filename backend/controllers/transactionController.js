const Transaction = require('../models/Transaction');
const User = require('../models/User');
const InvestmentPackage = require('../models/InvestmentPackage');
const cloudinary = require('cloudinary').v2;
const { processReferralBonus } = require('./userController');
const { createReferralTransaction } = require('./referralTransactionController');

// Helper function để cập nhật thống kê tài chính cho user
async function updateUserStats(userId) {
  try {
    // 1. Tính toán lợi nhuận (income) - chỉ tính tiền lãi từ các giao dịch interest
    const interestTransactions = await Transaction.find({
      user: userId,
      type: 'interest',
      status: 'approved'
    });
    
    const totalIncome = interestTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    
    // 2. Tính toán số tiền đã rút (withdrawable) - tổng số tiền đã rút thành công
    const withdrawTransactions = await Transaction.find({
      user: userId,
      type: 'withdraw',
      status: 'approved'
    });
    
    const totalWithdrawn = withdrawTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    
    // 3. Tính toán tổng doanh thu (withdrawing) - gốc + lãi từ các khoản đầu tư đã hoàn thành
    const Investment = require('../models/Investment');
    const completedInvestments = await Investment.find({
      userId: userId,
      status: 'completed'
    });
    
    const totalRevenue = completedInvestments.reduce((sum, inv) => {
      // Tổng doanh thu = gốc + lãi
      const principal = inv.amount || 0;
      const interest = inv.totalInterest || 0;
      return sum + principal + interest;
    }, 0);
    
    // Cập nhật user
    await User.findByIdAndUpdate(userId, {
      income: Math.round(totalIncome),
      withdrawable: Math.round(totalWithdrawn),
      withdrawing: Math.round(totalRevenue)
    });
    
    console.log(`✅ Updated stats for user: ${userId}`);
  } catch (err) {
    console.error(`❌ Error updating stats for user ${userId}:`, err);
  }
}

exports.createTransaction = async (req, res) => {
  try {
    // Kiểm tra xem user đã có lệnh cùng loại đang chờ duyệt chưa
    const existingPendingTransaction = await Transaction.findOne({
      user: req.user.id,
      type: req.body.type,
      status: 'pending'
    });

    if (existingPendingTransaction) {
      const transactionType = req.body.type === 'deposit' ? 'nạp tiền' : 'rút tiền';
      return res.status(400).json({ 
        message: `Bạn đã có một lệnh ${transactionType} đang chờ duyệt. Vui lòng chờ admin xử lý trước khi tạo lệnh mới.` 
      });
    }

    // Validation for withdrawal transactions
    if (req.body.type === 'withdraw') {
      if (req.body.amount < 500000) {
        return res.status(400).json({ message: 'Số tiền rút phải từ 500,000 VNĐ trở lên' });
      }
      
      const user = await User.findById(req.user.id);
      if (user.balance < req.body.amount) {
        return res.status(400).json({ message: 'Số tiền rút không được vượt quá số dư hiện tại' });
      }
    }

    // Validation for deposit transactions
    if (req.body.type === 'deposit') {
      if (req.body.amount < 100000) {
        return res.status(400).json({ message: 'Số tiền nạp phải từ 100,000 VNĐ trở lên' });
      }
    }
    
    const tx = new Transaction({ ...req.body, user: req.user.id });
    await tx.save();
    
    // Tạo transaction notification cho tất cả loại giao dịch
    try {
      const user = await User.findById(req.user.id);
      let bankInfo = {};
      let identityInfo = {};
      
      // Lấy thông tin ngân hàng từ user
      if (user) {
        bankInfo = {
          bankName: user.bankName || '',
          accountNumber: user.bankAccount || '',
          accountName: user.bankAccountHolder || ''
        };
      }
      
      // Tạo thông báo giao dịch tổng hợp
      const notification = new TransactionNotification({
        user: req.user.id,
        transaction: tx._id,
        type: req.body.type,
        amount: req.body.amount,
        bankInfo,
        identityInfo
      });
      
      await notification.save();
      
      // Trả về cả transaction và notification
      res.status(201).json({
        transaction: tx,
        notification: notification
      });
    } catch (notificationErr) {
      console.error('Lỗi tạo transaction notification:', notificationErr);
      // Vẫn trả về transaction nếu tạo notification thất bại
      res.status(201).json(tx);
    }
  } catch (err) {
    res.status(400).json({ message: 'Tạo giao dịch thất bại', error: err.message });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    console.log('🔍 getUserTransactions - User ID:', req.user.id);
    console.log('🔍 getUserTransactions - User object:', req.user);
    
    const txs = await Transaction.find({ user: req.user.id }).populate('package');
    console.log('🔍 getUserTransactions - Found transactions:', txs.length);
    console.log('🔍 getUserTransactions - Transactions:', txs);
    
    res.json(txs);
  } catch (err) {
    console.error('❌ getUserTransactions error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getMyTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find({ user: req.user.id }).populate('package').sort({ createdAt: -1 });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Kiểm tra trạng thái lệnh hiện tại của user
exports.getUserTransactionStatus = async (req, res) => {
  try {
    const pendingDeposit = await Transaction.findOne({
      user: req.user.id,
      type: 'deposit',
      status: 'pending'
    });

    const pendingWithdraw = await Transaction.findOne({
      user: req.user.id,
      type: 'withdraw',
      status: 'pending'
    });

    res.json({
      hasPendingDeposit: !!pendingDeposit,
      hasPendingWithdraw: !!pendingWithdraw,
      pendingDeposit: pendingDeposit,
      pendingWithdraw: pendingWithdraw
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find().populate('user').populate('package');
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Upload proof image for deposit transaction
exports.confirmDeposit = async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được upload' });
    }

    // Kiểm tra loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)' });
    }

    // Kiểm tra kích thước file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ message: 'File quá lớn. Kích thước tối đa 5MB' });
    }

    // Kiểm tra transaction có tồn tại và thuộc về user không
    const transaction = await Transaction.findOne({
      _id: transactionId,
      user: req.user.id,
      type: 'deposit'
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch nạp tiền' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Giao dịch này đã được xử lý' });
    }

    // Upload proof image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'transaction-proofs',
      resource_type: 'image',
    });

    // Cập nhật transaction với proof image
    transaction.proofImage = result.secure_url;
    await transaction.save();

    console.log('✅ Proof uploaded successfully:', result.secure_url);
    res.json({ 
      message: 'Upload proof thành công',
      proofImage: result.secure_url
    });
  } catch (error) {
    console.error("❌ Lỗi trong confirmDeposit:", error);
    res.status(500).json({ message: 'Lỗi upload proof', error: error.message });
  }
};

exports.approveTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Không tìm thấy giao dịch' });
    if (tx.status !== 'pending') return res.status(400).json({ message: 'Giao dịch đã được xử lý' });
    
    // Nếu là nạp tiền và duyệt, kiểm tra referral trước khi cộng tiền
    if (tx.type === 'deposit' && req.body.status === 'approved') {
      const user = await User.findById(tx.user);
      
      console.log(`🔍 === DEBUG REFERRAL LOGIC ===`);
      console.log(`User ID: ${tx.user}`);
      console.log(`User referredBy: ${user.referredBy}`);
      console.log(`User name: ${user.name}`);
      console.log(`Transaction amount: ${tx.amount}`);
      
      // Kiểm tra xem đây có phải lần nạp đầu tiên không (TRƯỚC KHI CỘNG TIỀN)
      const previousDeposits = await Transaction.find({
        user: tx.user,
        type: 'deposit',
        status: 'approved',
        _id: { $ne: tx._id } // Loại trừ giao dịch hiện tại
      });
      
      console.log(`Previous approved deposits count: ${previousDeposits.length}`);
      console.log(`Is first deposit: ${previousDeposits.length === 0}`);
      console.log(`Has referrer: ${!!user.referredBy}`);
      
      // Nếu đây là lần nạp đầu tiên và user có người giới thiệu, tạo ReferralTransaction
      if (previousDeposits.length === 0 && user.referredBy) {
        console.log(`💰 Creating referral transaction for first deposit: ${tx.amount}`);
        
        // Tính thưởng 5% cho lần nạp đầu tiên
        const bonusAmount = Math.round(tx.amount * 0.05);
        
        try {
          // Tạo ReferralTransaction với status pending
          await createReferralTransaction(
            user.referredBy, // referrer
            tx.user, // referredUser
            bonusAmount, // amount
            'first_deposit', // type
            tx._id // depositTransaction
          );
          
          console.log(`✅ Referral transaction created: ${bonusAmount} for referrer ${user.referredBy}`);
        } catch (error) {
          console.error(`❌ Error creating referral transaction:`, error);
        }
      } else if (previousDeposits.length === 0 && !user.referredBy) {
        console.log(`ℹ️ First deposit but no referrer for user ${tx.user}`);
      } else {
        console.log(`ℹ️ Not first deposit for user ${tx.user} (previous deposits: ${previousDeposits.length})`);
      }
      
      // Cộng tiền cho user (SAU KHI KIỂM TRA REFERRAL)
      user.balance = Math.round(user.balance + tx.amount);
      await user.save();
      console.log(`✅ Updated user balance: ${user.balance}`);
    }
    
    // Cập nhật trạng thái transaction
    tx.status = req.body.status;
    
    // Nếu là rút tiền và duyệt, kiểm tra số dư, nếu đủ thì trừ, không đủ thì báo lỗi
    if (tx.type === 'withdraw' && tx.status === 'approved') {
      const user = await User.findById(tx.user);
      if (user.balance < tx.amount) {
        return res.status(400).json({ message: 'Số dư không đủ để rút' });
      }
      user.balance = Math.round(user.balance - tx.amount);
      await user.save();
    }
    
    await tx.save();
    
    // Cập nhật thống kê tài chính cho user khi có giao dịch được duyệt
    if (tx.status === 'approved') {
      await updateUserStats(tx.user);
    }
    
    res.json({ message: 'Cập nhật trạng thái thành công', tx });
  } catch (err) {
    console.error('❌ Error in approveTransaction:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getTransactionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query;
    const filter = { user: userId };
    if (type) filter.type = type;
    const txs = await Transaction.find(filter).populate('package');
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Rollback transaction khi upload proof thất bại
exports.rollbackTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // Kiểm tra transaction có tồn tại và thuộc về user không
    const transaction = await Transaction.findOne({
      _id: transactionId,
      user: req.user.id,
      type: 'deposit',
      status: 'pending'
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch để rollback' });
    }

    // Xóa transaction
    await Transaction.findByIdAndDelete(transactionId);
    
    console.log(`✅ Transaction ${transactionId} rolled back successfully`);
    res.json({ 
      message: 'Rollback thành công',
      transactionId: transactionId
    });
  } catch (error) {
    console.error("❌ Lỗi trong rollbackTransaction:", error);
    res.status(500).json({ message: 'Lỗi rollback transaction', error: error.message });
  }
}; 