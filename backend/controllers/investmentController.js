const Transaction = require('../models/Transaction');
const User = require('../models/User');
const InvestmentPackage = require('../models/InvestmentPackage');

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

// Admin: lấy tất cả investments
exports.getAllInvestments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || '-createdAt'; // Mặc định sắp xếp theo thứ tự mới nhất
    const status = req.query.status;
    const maturityStatus = req.query.maturityStatus;
    
    // Xây dựng query filter
    const filter = { type: 'investment' };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (maturityStatus && maturityStatus !== 'all') {
      filter.maturityStatus = maturityStatus;
    }
    
    // Tính toán skip cho phân trang
    const skip = (page - 1) * limit;
    
    // Thực hiện query với phân trang và sắp xếp
    const investments = await Transaction.find(filter)
      .populate('user', 'name email')
      .populate('package')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Đếm tổng số records để tính pagination
    const total = await Transaction.countDocuments(filter);
    
    res.json({
      investments: investments,
      total: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error getting investments:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// User: lấy investments của chính mình
exports.getMyInvestments = async (req, res) => {
  try {
    const investments = await Transaction.find({ type: 'investment', user: req.user.id })
      .populate('package');
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// User: lấy danh sách gói đầu tư đã mua
exports.getMyPurchasedPackages = async (req, res) => {
  try {
    const purchasedPackages = await Transaction.find({ 
      type: 'investment', 
      user: req.user.id,
      status: { $in: ['approved', 'pending'] }
    })
    .populate('package')
    .select('package status createdAt');
    
    // Lấy danh sách packageId đã mua
    const purchasedPackageIds = purchasedPackages.map(inv => inv.package._id.toString());
    
    res.json({
      purchasedPackages: purchasedPackages,
      purchasedPackageIds: purchasedPackageIds
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.createInvestment = async (req, res) => {
  try {
    const { packageId, amount } = req.body;
    if (!packageId || !amount) return res.status(400).json({ message: 'Thiếu thông tin gói hoặc số tiền' });
    
    // Chuyển đổi amount thành số
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Số tiền không hợp lệ' });
    }
    
    // Kiểm tra gói đầu tư có tồn tại không
    const pkg = await InvestmentPackage.findById(packageId);
    if (!pkg) return res.status(404).json({ message: 'Không tìm thấy gói đầu tư' });
    
    // Kiểm tra user đã mua gói này chưa
    const existingInvestment = await Transaction.findOne({
      user: req.user.id,
      package: packageId,
      type: 'investment',
      status: { $in: ['approved', 'pending'] } // Chỉ kiểm tra các giao dịch đã duyệt hoặc đang chờ
    });
    
    if (existingInvestment) {
      return res.status(400).json({ message: 'Bạn đã mua gói đầu tư này rồi. Mỗi gói chỉ được mua 1 lần.' });
    }
    
    // Kiểm tra số tiền có hợp lệ không
    if (numAmount < pkg.minAmount || numAmount > pkg.maxAmount) {
      return res.status(400).json({ 
        message: `Số tiền phải từ ${pkg.minAmount.toLocaleString()} đến ${pkg.maxAmount.toLocaleString()} đ` 
      });
    }
    
    // Kiểm tra số dư user và trừ tiền ngay lập tức
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    
    if (user.balance < numAmount) {
      return res.status(400).json({ message: 'Số dư không đủ để đầu tư' });
    }
    
    // Trừ tiền user ngay lập tức
    user.balance = Math.round(user.balance - numAmount);
    await user.save();
    
    // Tạo transaction đầu tư với status approved ngay lập tức
    const tx = new Transaction({
      user: req.user.id,
      package: packageId,
      amount: numAmount,
      type: 'investment',
      status: 'approved', // Thành công ngay lập tức
      maturityStatus: 'pending', // Chờ admin duyệt đáo hạn
      startDate: new Date(),
      endDate: new Date(Date.now() + pkg.duration * 24 * 60 * 60 * 1000), // Tính ngày đáo hạn
    });
    await tx.save();
    
    // Trả về thông tin transaction với số dư đã cập nhật
    res.status(201).json({
      message: 'Đầu tư thành công! Gói đầu tư đã được kích hoạt.',
      transaction: tx,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance // Số dư đã được trừ
      }
    });
  } catch (err) {
    res.status(400).json({ message: 'Tạo lịch sử đầu tư thất bại', error: err.message });
  }
}; 

// Admin: duyệt/từ chối investment (chỉ cho các trường hợp đặc biệt)
exports.approveInvestment = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' hoặc 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const transaction = await Transaction.findById(req.params.id).populate('package');
    if (!transaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch đầu tư' });
    }

    if (transaction.type !== 'investment') {
      return res.status(400).json({ message: 'Không phải giao dịch đầu tư' });
    }

    // Chỉ xử lý các giao dịch pending (trường hợp đặc biệt)
    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Giao dịch đã được xử lý hoặc đã được duyệt tự động' });
    }

    // Cập nhật trạng thái
    transaction.status = status;
    await transaction.save();

    let user = null;
    if (status === 'approved') {
      // Trừ tiền user khi duyệt (chỉ cho trường hợp đặc biệt)
      user = await User.findById(transaction.user);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
      }

      if (user.balance < transaction.amount) {
        return res.status(400).json({ message: 'Số dư user không đủ để thực hiện giao dịch' });
      }

      // Trừ tiền đầu tư
      user.balance = Math.round(user.balance - transaction.amount);
      await user.save();
      
      // Cập nhật ngày bắt đầu và kết thúc
      transaction.startDate = new Date();
      transaction.endDate = new Date(Date.now() + transaction.package.duration * 24 * 60 * 60 * 1000);
      await transaction.save();
    }

    res.json({
      message: status === 'approved' ? `Đã duyệt đầu tư thành công! Lãi ${transaction.package.interestRate}% sẽ được cộng khi đáo hạn.` : 'Đã từ chối đầu tư!',
      transaction,
      user: user ? {
        _id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance
      } : null
    });
  } catch (err) {
    res.status(400).json({ message: 'Xử lý đầu tư thất bại', error: err.message });
  }
};

// Admin: duyệt đáo hạn đầu tư (cộng lãi)
exports.approveMaturity = async (req, res) => {
  try {
    console.log('🔄 Bắt đầu xử lý đáo hạn...');
    const { status } = req.body; // 'approved' hoặc 'rejected'
    console.log('📋 Status:', status);
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const transaction = await Transaction.findById(req.params.id).populate('package');
    if (!transaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch đầu tư' });
    }

    if (transaction.type !== 'investment') {
      return res.status(400).json({ message: 'Không phải giao dịch đầu tư' });
    }

    if (transaction.status !== 'approved') {
      return res.status(400).json({ message: 'Giao dịch đầu tư chưa được duyệt' });
    }

    if (transaction.maturityStatus !== 'pending') {
      return res.status(400).json({ message: 'Đáo hạn đã được xử lý' });
    }

    // Cập nhật trạng thái đáo hạn
    transaction.maturityStatus = status;
    await transaction.save();

    let user = null;
    if (status === 'approved') {
      // Cộng lãi khi duyệt đáo hạn
      user = await User.findById(transaction.user);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
      }

      // Tính lãi theo phần trăm của số tiền được gửi
      const interestAmount = Math.round((transaction.amount * transaction.package.interestRate) / 100);
      console.log('💰 Tính lãi:', {
        amount: transaction.amount,
        interestRate: transaction.package.interestRate,
        interestAmount: interestAmount
      });
      
      // Cộng cả tiền gốc và tiền lãi vào số dư
      const totalAmount = transaction.amount + interestAmount;
      console.log('💳 Cập nhật số dư user:', {
        oldBalance: user.balance,
        totalAmount: totalAmount,
        newBalance: user.balance + totalAmount
      });
      user.balance = Math.round(user.balance + totalAmount);
      await user.save();
      console.log('✅ Đã cập nhật số dư user');
      
      // Tạo transaction lãi
      try {
        console.log('📝 Tạo transaction lãi với data:', {
          user: transaction.user,
          amount: interestAmount,
          type: 'interest',
          status: 'approved',
          note: `Lãi ${transaction.package.interestRate}% từ gói đầu tư: ${transaction.package.name} (đáo hạn)`
        });
        
        const interestTransaction = new Transaction({
          user: transaction.user,
          amount: interestAmount,
          type: 'interest',
          status: 'approved',
          note: `Lãi ${transaction.package.interestRate}% từ gói đầu tư: ${transaction.package.name} (đáo hạn)`,
        });
        await interestTransaction.save();
        console.log('✅ Đã tạo transaction lãi');
        
        // Cập nhật thống kê tài chính cho user
        await updateUserStats(transaction.user);
      } catch (interestError) {
        console.error('❌ Lỗi khi tạo transaction lãi:', interestError);
        throw new Error('Lỗi khi tạo transaction lãi: ' + interestError.message);
      }
      
      // Tạo transaction hoàn vốn (tiền gốc) - TẠM THỜI BỎ QUA
      console.log('⚠️  Tạm thời bỏ qua tạo transaction principal_return');
      /*
      try {
        const principalTransaction = new Transaction({
          user: transaction.user,
          amount: transaction.amount,
          type: 'principal_return',
          status: 'approved',
          note: `Hoàn vốn gốc từ gói đầu tư: ${transaction.package.name} (đáo hạn)`,
        });
        await principalTransaction.save();
        console.log('✅ Đã tạo transaction hoàn vốn gốc');
      } catch (principalError) {
        console.error('❌ Lỗi khi tạo transaction hoàn vốn gốc:', principalError);
        throw new Error('Lỗi khi tạo transaction hoàn vốn gốc: ' + principalError.message);
      }
      */
    }

    res.json({
      message: status === 'approved' ? `Đã duyệt đáo hạn và cộng tiền gốc + lãi ${transaction.package.interestRate}% thành công!` : 'Đã từ chối đáo hạn!',
      transaction,
      user: user ? {
        _id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance
      } : null
    });
  } catch (err) {
    res.status(400).json({ message: 'Xử lý đáo hạn thất bại', error: err.message });
  }
}; 

// Auto maturity - tự động cộng lãi khi hết thời gian
exports.autoMaturity = async (req, res) => {
  try {
    console.log('🔄 Bắt đầu xử lý auto maturity...');
    
    const transaction = await Transaction.findById(req.params.id).populate('package');
    if (!transaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch đầu tư' });
    }

    if (transaction.type !== 'investment') {
      return res.status(400).json({ message: 'Không phải giao dịch đầu tư' });
    }

    if (transaction.status !== 'approved') {
      return res.status(400).json({ message: 'Giao dịch đầu tư chưa được duyệt' });
    }

    if (transaction.maturityStatus !== 'pending') {
      return res.status(400).json({ message: 'Đáo hạn đã được xử lý' });
    }

    // Kiểm tra xem đã hết thời gian chưa
    const endDate = new Date(transaction.createdAt.getTime() + (transaction.package.duration * 24 * 60 * 60 * 1000));
    const now = new Date();
    
    if (now < endDate) {
      return res.status(400).json({ message: 'Chưa đến thời gian đáo hạn' });
    }

    // Cập nhật trạng thái đáo hạn
    transaction.maturityStatus = 'approved';
    await transaction.save();

    // Cộng lãi khi đáo hạn
    const user = await User.findById(transaction.user);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    // Tính lãi theo phần trăm của số tiền được gửi
    const interestAmount = Math.round((transaction.amount * transaction.package.interestRate) / 100);
    console.log('💰 Tính lãi:', {
      amount: transaction.amount,
      interestRate: transaction.package.interestRate,
      interestAmount: interestAmount
    });
    
    // Cộng cả tiền gốc và tiền lãi vào số dư
    const totalAmount = transaction.amount + interestAmount;
    console.log('💳 Cập nhật số dư user:', {
      oldBalance: user.balance,
      totalAmount: totalAmount,
      newBalance: user.balance + totalAmount
    });
    user.balance = Math.round(user.balance + totalAmount);
    await user.save();
    console.log('✅ Đã cập nhật số dư user');
    
    // Tạo transaction lãi
    try {
      console.log('📝 Tạo transaction lãi với data:', {
        user: transaction.user,
        amount: interestAmount,
        type: 'interest',
        status: 'approved',
        note: `Lãi ${transaction.package.interestRate}% từ gói đầu tư: ${transaction.package.name} (auto maturity)`
      });
      
      const interestTransaction = new Transaction({
        user: transaction.user,
        amount: interestAmount,
        type: 'interest',
        status: 'approved',
        note: `Lãi ${transaction.package.interestRate}% từ gói đầu tư: ${transaction.package.name} (auto maturity)`,
      });
      await interestTransaction.save();
      console.log('✅ Đã tạo transaction lãi');
      
      // Cập nhật thống kê tài chính cho user
      await updateUserStats(transaction.user);
    } catch (interestError) {
      console.error('❌ Lỗi khi tạo transaction lãi:', interestError);
      throw new Error('Lỗi khi tạo transaction lãi: ' + interestError.message);
    }

    res.json({
      message: `Đã tự động đáo hạn và cộng tiền gốc + lãi ${transaction.package.interestRate}% thành công!`,
      transaction,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance
      }
    });
  } catch (err) {
    res.status(400).json({ message: 'Xử lý auto maturity thất bại', error: err.message });
  }
}; 