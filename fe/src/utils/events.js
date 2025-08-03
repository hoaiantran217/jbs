// Utility functions để dispatch events cập nhật balance

/**
 * Dispatch event khi admin approve giao dịch nạp tiền
 * @param {string} userId - ID của user
 * @param {number} newBalance - Số dư mới
 */
export const dispatchBalanceUpdated = (userId, newBalance) => {
  window.dispatchEvent(new CustomEvent('balanceUpdated', {
    detail: { userId, newBalance }
  }));
};

/**
 * Dispatch event khi user thực hiện các action khác (đầu tư, rút tiền, etc.)
 * @param {string} userId - ID của user
 * @param {number} newBalance - Số dư mới
 */
export const dispatchUserBalanceChanged = (userId, newBalance) => {
  window.dispatchEvent(new CustomEvent('userBalanceChanged', {
    detail: { userId, newBalance }
  }));
};

/**
 * Dispatch event khi có thay đổi về user data
 * @param {object} userData - Dữ liệu user mới
 */
export const dispatchUserDataChanged = (userData) => {
  window.dispatchEvent(new CustomEvent('userDataChanged', {
    detail: { userData }
  }));
};

/**
 * Optimistic update - cập nhật balance ngay lập tức trước khi gọi API
 * @param {string} userId - ID của user
 * @param {number} currentBalance - Số dư hiện tại
 * @param {number} amount - Số tiền thay đổi
 * @param {string} type - Loại giao dịch ('add' hoặc 'subtract')
 */
export const optimisticBalanceUpdate = (userId, currentBalance, amount, type) => {
  const newBalance = type === 'add' 
    ? currentBalance + amount 
    : Math.max(0, currentBalance - amount);
  
  dispatchUserBalanceChanged(userId, newBalance);
  return newBalance;
};

/**
 * Rollback optimistic update nếu API call thất bại
 * @param {string} userId - ID của user
 * @param {number} originalBalance - Số dư ban đầu
 */
export const rollbackBalanceUpdate = (userId, originalBalance) => {
  dispatchUserBalanceChanged(userId, originalBalance);
};

/**
 * Dispatch event khi user đăng nhập thành công
 * @param {object} userData - Dữ liệu user
 */
export const dispatchUserLoggedIn = (userData) => {
  window.dispatchEvent(new CustomEvent('userLoggedIn', {
    detail: { userData }
  }));
}; 