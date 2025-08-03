// Utility function để tạo mã giới thiệu
const generateReferralCode = (name) => {
  // Lấy 3 ký tự đầu của tên (viết hoa)
  const namePart = name.substring(0, 3).toUpperCase();
  
  // Tạo số ngẫu nhiên 4 chữ số
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  
  // Kết hợp thành mã giới thiệu
  return `${namePart}${randomPart}`;
};

// Kiểm tra mã giới thiệu có hợp lệ không
const isValidReferralCode = (code) => {
  // Mã phải có ít nhất 6 ký tự và chỉ chứa chữ cái và số
  return code && code.length >= 6 && /^[A-Z0-9]+$/.test(code);
};

// Tạo mã giới thiệu duy nhất
const createUniqueReferralCode = async (User, name) => {
  let code;
  let attempts = 0;
  const maxAttempts = 10;
  
  do {
    code = generateReferralCode(name);
    attempts++;
    
    // Kiểm tra xem mã đã tồn tại chưa
    const existingUser = await User.findOne({ referralCode: code });
    if (!existingUser) {
      return code;
    }
  } while (attempts < maxAttempts);
  
  // Nếu vẫn trùng, thêm timestamp
  return `${generateReferralCode(name)}${Date.now().toString().slice(-4)}`;
};

module.exports = {
  generateReferralCode,
  isValidReferralCode,
  createUniqueReferralCode
}; 