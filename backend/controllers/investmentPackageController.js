const InvestmentPackage = require('../models/InvestmentPackage');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.createPackage = async (req, res) => {
  try {
    console.log('🔄 Bắt đầu tạo gói đầu tư...');
    console.log('📋 Data:', req.body);
    
    if (req.body._id) delete req.body._id;
    
    // Kiểm tra tên gói đã tồn tại chưa
    const existingPackage = await InvestmentPackage.findOne({ name: req.body.name });
    if (existingPackage) {
      console.log('❌ Tên gói đã tồn tại:', req.body.name);
      return res.status(400).json({ message: 'Tên gói đầu tư đã tồn tại' });
    }
    
    let imageUrl = req.body.image;
    if (req.file) {
      console.log('📸 Đang upload ảnh...');
      const upload = await cloudinary.uploader.upload(req.file.path, { folder: 'zuna-invest/packages' });
      imageUrl = upload.secure_url;
      fs.unlinkSync(req.file.path);
      console.log('✅ Upload ảnh thành công');
    }
    
    // Validate dữ liệu
    const interestRate = Number(req.body.interestRate);
    const duration = Number(req.body.duration);
    const minAmount = Number(req.body.minAmount);
    const maxAmount = Number(req.body.maxAmount);
    
    if (isNaN(interestRate) || interestRate <= 0) {
      return res.status(400).json({ message: 'Lãi suất phải là số dương' });
    }
    if (isNaN(duration) || duration <= 0) {
      return res.status(400).json({ message: 'Thời hạn phải là số dương' });
    }
    if (isNaN(minAmount) || minAmount <= 0) {
      return res.status(400).json({ message: 'Số tiền tối thiểu phải là số dương' });
    }
    if (isNaN(maxAmount) || maxAmount <= 0) {
      return res.status(400).json({ message: 'Số tiền tối đa phải là số dương' });
    }
    if (minAmount >= maxAmount) {
      return res.status(400).json({ message: 'Số tiền tối đa phải lớn hơn số tiền tối thiểu' });
    }
    
    const pkg = new InvestmentPackage({
      ...req.body,
      interestRate,
      duration,
      minAmount,
      maxAmount,
      image: imageUrl
    });
    
    console.log('💾 Đang lưu gói đầu tư...');
    await pkg.save();
    console.log('✅ Tạo gói đầu tư thành công:', pkg._id);
    
    res.status(201).json(pkg);
  } catch (err) {
    console.error('❌ Lỗi khi tạo gói đầu tư:', err);
    
    // Xử lý lỗi duplicate key
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Tên gói đầu tư đã tồn tại' });
    }
    
    res.status(400).json({ message: 'Tạo gói thất bại', error: err.message });
  }
};

exports.getAllPackages = async (req, res) => {
  try {
    console.log('🔄 Lấy danh sách gói đầu tư...');
    const pkgs = await InvestmentPackage.find();
    console.log('✅ Tìm thấy', pkgs.length, 'gói đầu tư');
    res.json(pkgs);
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách gói:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getPackageById = async (req, res) => {
  try {
    console.log('🔄 Lấy thông tin gói đầu tư...');
    console.log('📋 ID:', req.params.id);
    
    const pkg = await InvestmentPackage.findById(req.params.id);
    if (!pkg) {
      console.log('❌ Không tìm thấy gói:', req.params.id);
      return res.status(404).json({ message: 'Không tìm thấy gói' });
    }
    
    console.log('✅ Tìm thấy gói:', pkg.name);
    res.json(pkg);
  } catch (err) {
    console.error('❌ Lỗi khi lấy thông tin gói:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    console.log('🔄 Bắt đầu cập nhật gói đầu tư...');
    console.log('📋 ID:', req.params.id);
    console.log('📋 Data:', req.body);
    
    // Kiểm tra gói có tồn tại không
    const existingPackage = await InvestmentPackage.findById(req.params.id);
    if (!existingPackage) {
      console.log('❌ Không tìm thấy gói:', req.params.id);
      return res.status(404).json({ message: 'Không tìm thấy gói' });
    }
    
    // Kiểm tra tên gói đã tồn tại chưa (trừ gói hiện tại)
    if (req.body.name && req.body.name !== existingPackage.name) {
      const duplicatePackage = await InvestmentPackage.findOne({ 
        name: req.body.name,
        _id: { $ne: req.params.id }
      });
      if (duplicatePackage) {
        console.log('❌ Tên gói đã tồn tại:', req.body.name);
        return res.status(400).json({ message: 'Tên gói đầu tư đã tồn tại' });
      }
    }
    
    let imageUrl = req.body.image;
    if (req.file) {
      console.log('📸 Đang upload ảnh...');
      const upload = await cloudinary.uploader.upload(req.file.path, { folder: 'zuna-invest/packages' });
      imageUrl = upload.secure_url;
      fs.unlinkSync(req.file.path);
      console.log('✅ Upload ảnh thành công');
    }
    
    // Validate dữ liệu
    const interestRate = Number(req.body.interestRate);
    const duration = Number(req.body.duration);
    const minAmount = Number(req.body.minAmount);
    const maxAmount = Number(req.body.maxAmount);
    
    if (isNaN(interestRate) || interestRate <= 0) {
      return res.status(400).json({ message: 'Lãi suất phải là số dương' });
    }
    if (isNaN(duration) || duration <= 0) {
      return res.status(400).json({ message: 'Thời hạn phải là số dương' });
    }
    if (isNaN(minAmount) || minAmount <= 0) {
      return res.status(400).json({ message: 'Số tiền tối thiểu phải là số dương' });
    }
    if (isNaN(maxAmount) || maxAmount <= 0) {
      return res.status(400).json({ message: 'Số tiền tối đa phải là số dương' });
    }
    if (minAmount >= maxAmount) {
      return res.status(400).json({ message: 'Số tiền tối đa phải lớn hơn số tiền tối thiểu' });
    }
    
    console.log('💾 Đang cập nhật gói đầu tư...');
    const pkg = await InvestmentPackage.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        interestRate,
        duration,
        minAmount,
        maxAmount,
        image: imageUrl
      },
      { new: true }
    );
    
    console.log('✅ Cập nhật gói đầu tư thành công');
    res.json(pkg);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật gói đầu tư:', err);
    
    // Xử lý lỗi duplicate key
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Tên gói đầu tư đã tồn tại' });
    }
    
    res.status(400).json({ message: 'Cập nhật thất bại', error: err.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    console.log('🔄 Bắt đầu xóa gói đầu tư...');
    console.log('📋 ID:', req.params.id);
    
    // Kiểm tra gói có tồn tại không
    const pkg = await InvestmentPackage.findById(req.params.id);
    if (!pkg) {
      console.log('❌ Không tìm thấy gói:', req.params.id);
      return res.status(404).json({ message: 'Không tìm thấy gói' });
    }
    
    // Kiểm tra xem gói có đang được sử dụng trong transactions không
    const Transaction = require('../models/Transaction');
    const transactionsUsingPackage = await Transaction.countDocuments({ 
      package: req.params.id,
      type: 'investment'
    });
    
    if (transactionsUsingPackage > 0) {
      console.log('❌ Gói đang được sử dụng bởi', transactionsUsingPackage, 'giao dịch');
      return res.status(400).json({ 
        message: `Không thể xóa gói vì đang có ${transactionsUsingPackage} giao dịch đầu tư đang sử dụng gói này` 
      });
    }
    
    console.log('🗑️  Đang xóa gói đầu tư...');
    await InvestmentPackage.findByIdAndDelete(req.params.id);
    console.log('✅ Xóa gói đầu tư thành công');
    
    res.json({ message: 'Đã xóa gói' });
  } catch (err) {
    console.error('❌ Lỗi khi xóa gói đầu tư:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 