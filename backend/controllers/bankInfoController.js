const BankInfo = require('../models/BankInfo');
const cloudinary = require('cloudinary').v2;

// Upload QR code
exports.uploadQrCode = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được upload' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'qr-codes',
      resource_type: 'image',
    });

      console.log('Cloudinary upload successful:', result.secure_url);

    res.json({ 
      url: result.secure_url,
      public_id: result.public_id 
    });
  } catch (error) {
    console.error('Upload QR code error:', error);
    res.status(500).json({ message: 'Lỗi upload file', error: error.message });
  }
};

// Lấy tất cả thông tin ngân hàng
exports.getAllBankInfo = async (req, res) => {
  try {
    const bankInfos = await BankInfo.find().sort({ createdAt: -1 });
    res.json(bankInfos);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy thông tin ngân hàng theo ID
exports.getBankInfoById = async (req, res) => {
  try {
    const bankInfo = await BankInfo.findById(req.params.id);
    if (!bankInfo) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin ngân hàng' });
    }
    res.json(bankInfo);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Tạo thông tin ngân hàng mới
exports.createBankInfo = async (req, res) => {
  try {
    const { bankName, accountNumber, accountHolder, qrCode, description } = req.body;

    // Kiểm tra xem đã có thông tin ngân hàng với số tài khoản này chưa
    const existingBank = await BankInfo.findOne({ accountNumber });
    if (existingBank) {
      return res.status(400).json({ message: 'Số tài khoản này đã tồn tại' });
    }

    const bankInfo = new BankInfo({
      bankName,
      accountNumber,
      accountHolder,
      qrCode,
      description
    });

    const savedBankInfo = await bankInfo.save();
    res.status(201).json(savedBankInfo);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Cập nhật thông tin ngân hàng
exports.updateBankInfo = async (req, res) => {
  try {
    const { bankName, accountNumber, accountHolder, qrCode, description, isActive } = req.body;

    // Kiểm tra xem số tài khoản mới có trùng với tài khoản khác không
    if (accountNumber) {
      const existingBank = await BankInfo.findOne({ 
        accountNumber, 
        _id: { $ne: req.params.id } 
      });
      if (existingBank) {
        return res.status(400).json({ message: 'Số tài khoản này đã tồn tại' });
      }
    }

    const updatedBankInfo = await BankInfo.findByIdAndUpdate(
      req.params.id,
      {
        bankName,
        accountNumber,
        accountHolder,
        qrCode,
        description,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!updatedBankInfo) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin ngân hàng' });
    }

    res.json(updatedBankInfo);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Xóa thông tin ngân hàng
exports.deleteBankInfo = async (req, res) => {
  try {
    const deletedBankInfo = await BankInfo.findByIdAndDelete(req.params.id);
    
    if (!deletedBankInfo) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin ngân hàng' });
    }

    res.json({ message: 'Xóa thông tin ngân hàng thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy thông tin ngân hàng đang hoạt động (cho frontend)
exports.getActiveBankInfo = async (req, res) => {
  try {
    const activeBankInfos = await BankInfo.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(activeBankInfos);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}; 