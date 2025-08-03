const Transaction = require('../models/Transaction');
const User = require('../models/User');
const InvestmentPackage = require('../models/InvestmentPackage');

// Hàm kiểm tra và xử lý auto maturity
const checkAndProcessAutoMaturity = async () => {
  try {
    console.log('🔄 Bắt đầu kiểm tra auto maturity...');
    
    // Tìm tất cả các khoản đầu tư đã được duyệt nhưng chưa đáo hạn
    const pendingMaturityInvestments = await Transaction.find({
      type: 'investment',
      status: 'approved',
      maturityStatus: 'pending'
    }).populate('package');

    console.log(`📊 Tìm thấy ${pendingMaturityInvestments.length} khoản đầu tư chờ đáo hạn`);

    for (const investment of pendingMaturityInvestments) {
      try {
        // Tính thời gian kết thúc
        const endDate = new Date(investment.createdAt.getTime() + (investment.package.duration * 24 * 60 * 60 * 1000));
        const now = new Date();
        
        // Kiểm tra xem đã hết thời gian chưa
        if (now >= endDate) {
          console.log(`⏰ Khoản đầu tư ${investment._id} đã hết hạn, bắt đầu xử lý auto maturity...`);
          
          // Cập nhật trạng thái đáo hạn
          investment.maturityStatus = 'approved';
          await investment.save();

          // Tìm user
          const user = await User.findById(investment.user);
          if (!user) {
            console.error(`❌ Không tìm thấy user cho khoản đầu tư ${investment._id}`);
            continue;
          }

          // Tính lãi
          const interestAmount = Math.round((investment.amount * investment.package.interestRate) / 100);
          const totalAmount = investment.amount + interestAmount;
          
          console.log(`💰 Cộng lãi cho user ${user._id}:`, {
            investmentAmount: investment.amount,
            interestRate: investment.package.interestRate,
            interestAmount: interestAmount,
            totalAmount: totalAmount,
            oldBalance: user.balance,
            newBalance: user.balance + totalAmount
          });

          // Cập nhật số dư user
          user.balance = Math.round(user.balance + totalAmount);
          await user.save();

          // Tạo transaction lãi
          const interestTransaction = new Transaction({
            user: investment.user,
            amount: interestAmount,
            type: 'interest',
            status: 'approved',
            note: `Lãi ${investment.package.interestRate}% từ gói đầu tư: ${investment.package.name} (auto maturity)`,
          });
          await interestTransaction.save();

          console.log(`✅ Đã xử lý auto maturity thành công cho khoản đầu tư ${investment._id}`);
        }
      } catch (error) {
        console.error(`❌ Lỗi khi xử lý auto maturity cho khoản đầu tư ${investment._id}:`, error);
      }
    }

    console.log('✅ Hoàn thành kiểm tra auto maturity');
  } catch (error) {
    console.error('❌ Lỗi trong quá trình kiểm tra auto maturity:', error);
  }
};

// Chạy kiểm tra mỗi phút
const startAutoMaturityChecker = () => {
  console.log('🚀 Bắt đầu auto maturity checker...');
  
  // Chạy ngay lập tức
  checkAndProcessAutoMaturity();
  
  // Chạy mỗi phút
  setInterval(checkAndProcessAutoMaturity, 60 * 1000);
};

module.exports = {
  checkAndProcessAutoMaturity,
  startAutoMaturityChecker
}; 