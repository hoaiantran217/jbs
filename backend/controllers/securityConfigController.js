const SecurityConfig = require('../models/SecurityConfig');

// Lấy cấu hình security hiện tại
exports.getSecurityConfig = async (req, res) => {
  try {
    let config = await SecurityConfig.findOne().sort({ createdAt: -1 });
    
    // Nếu chưa có config, tạo config mặc định
    if (!config) {
      config = await SecurityConfig.create({
        devToolsProtection: true,
        consoleProtection: true,
        rightClickProtection: true,
        keyboardProtection: true,
        sourceCodeProtection: true,
        debuggerProtection: true,
        updatedBy: req.user.id
      });
    }
    
    res.json(config);
  } catch (err) {
    console.error('Error getting security config:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật cấu hình security
exports.updateSecurityConfig = async (req, res) => {
  try {
    const {
      devToolsProtection,
      consoleProtection,
      rightClickProtection,
      keyboardProtection,
      sourceCodeProtection,
      debuggerProtection
    } = req.body;

    // Tìm config hiện tại hoặc tạo mới
    let config = await SecurityConfig.findOne().sort({ createdAt: -1 });
    
    if (!config) {
      config = new SecurityConfig({
        devToolsProtection: true,
        consoleProtection: true,
        rightClickProtection: true,
        keyboardProtection: true,
        sourceCodeProtection: true,
        debuggerProtection: true
      });
    }

    // Cập nhật các giá trị
    config.devToolsProtection = devToolsProtection;
    config.consoleProtection = consoleProtection;
    config.rightClickProtection = rightClickProtection;
    config.keyboardProtection = keyboardProtection;
    config.sourceCodeProtection = sourceCodeProtection;
    config.debuggerProtection = debuggerProtection;
    config.updatedBy = req.user.id;
    config.updatedAt = new Date();

    await config.save();

    res.json({
      message: 'Cập nhật cấu hình security thành công',
      config
    });
  } catch (err) {
    console.error('Error updating security config:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Reset về cấu hình mặc định
exports.resetSecurityConfig = async (req, res) => {
  try {
    const config = await SecurityConfig.create({
      devToolsProtection: true,
      consoleProtection: true,
      rightClickProtection: true,
      keyboardProtection: true,
      sourceCodeProtection: true,
      debuggerProtection: true,
      updatedBy: req.user.id
    });

    res.json({
      message: 'Đã reset về cấu hình mặc định',
      config
    });
  } catch (err) {
    console.error('Error resetting security config:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 