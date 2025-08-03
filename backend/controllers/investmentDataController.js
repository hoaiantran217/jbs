const InvestmentData = require('../models/InvestmentData');

// Lấy dữ liệu đầu tư (public)
const getInvestmentData = async (req, res) => {
  try {
    const investmentData = await InvestmentData.findOne({ isActive: true });
    
    if (!investmentData) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu đầu tư' });
    }

    res.json({
      success: true,
      data: investmentData
    });
  } catch (error) {
    console.error('Error getting investment data:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy dữ liệu đầu tư (admin)
const getInvestmentDataAdmin = async (req, res) => {
  try {
    const investmentData = await InvestmentData.findOne({ isActive: true });
    
    res.json({
      success: true,
      data: investmentData
    });
  } catch (error) {
    console.error('Error getting investment data admin:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật tổng số tiền đầu tư
const updateTotalInvested = async (req, res) => {
  try {
    const { totalInvested } = req.body;

    if (!totalInvested) {
      return res.status(400).json({ message: 'Tổng số tiền đầu tư là bắt buộc' });
    }

    let investmentData = await InvestmentData.findOne({ isActive: true });
    
    if (!investmentData) {
      investmentData = new InvestmentData({ totalInvested });
    } else {
      investmentData.totalInvested = totalInvested;
    }

    await investmentData.save();

    res.json({
      success: true,
      message: 'Cập nhật tổng số tiền đầu tư thành công',
      data: investmentData
    });
  } catch (error) {
    console.error('Error updating total invested:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Thêm hoạt động đầu tư mới
const addActiveInvestment = async (req, res) => {
  try {
    const { name, amount, type, time } = req.body;

    if (!name || !amount || !type || !time) {
      return res.status(400).json({ 
        message: 'Tên, số tiền, loại và thời gian là bắt buộc' 
      });
    }

    if (!['deposit', 'withdrawal'].includes(type)) {
      return res.status(400).json({ 
        message: 'Loại phải là deposit hoặc withdrawal' 
      });
    }

    let investmentData = await InvestmentData.findOne({ isActive: true });
    
    if (!investmentData) {
      investmentData = new InvestmentData({
        totalInvested: "92,548,200,000",
        activeInvestments: []
      });
    }

    // Thêm hoạt động mới vào đầu danh sách
    investmentData.activeInvestments.unshift({
      name,
      amount,
      type,
      time
    });

    // Giữ tối đa 50 hoạt động
    if (investmentData.activeInvestments.length > 50) {
      investmentData.activeInvestments = investmentData.activeInvestments.slice(0, 50);
    }

    await investmentData.save();

    res.json({
      success: true,
      message: 'Thêm hoạt động đầu tư thành công',
      data: investmentData
    });
  } catch (error) {
    console.error('Error adding active investment:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa hoạt động đầu tư
const deleteActiveInvestment = async (req, res) => {
  try {
    const { investmentId } = req.params;

    const investmentData = await InvestmentData.findOne({ isActive: true });
    
    if (!investmentData) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu đầu tư' });
    }

    investmentData.activeInvestments = investmentData.activeInvestments.filter(
      investment => investment._id.toString() !== investmentId
    );

    await investmentData.save();

    res.json({
      success: true,
      message: 'Xóa hoạt động đầu tư thành công',
      data: investmentData
    });
  } catch (error) {
    console.error('Error deleting active investment:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa tất cả hoạt động đầu tư
const clearAllActiveInvestments = async (req, res) => {
  try {
    const investmentData = await InvestmentData.findOne({ isActive: true });
    
    if (!investmentData) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu đầu tư' });
    }

    investmentData.activeInvestments = [];
    await investmentData.save();

    res.json({
      success: true,
      message: 'Xóa tất cả hoạt động đầu tư thành công',
      data: investmentData
    });
  } catch (error) {
    console.error('Error clearing all active investments:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getInvestmentData,
  getInvestmentDataAdmin,
  updateTotalInvested,
  addActiveInvestment,
  deleteActiveInvestment,
  clearAllActiveInvestments
}; 