// Cấu hình security
const SECURITY_CONFIG = {
  // Mặc định - sẽ được override bởi API
  devToolsProtection: true,
  consoleProtection: true,
  rightClickProtection: true,
  keyboardProtection: true,
  sourceCodeProtection: true,
  debuggerProtection: true
};

// Helper function để kiểm tra có nên enable security không
export const shouldEnableSecurity = () => {
  // Chỉ enable trong production
  return process.env.NODE_ENV === 'production';
};

// Function để load cấu hình từ API
export const loadSecurityConfig = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/security-config/public`);
    if (response.ok) {
      const config = await response.json();
      Object.assign(SECURITY_CONFIG, config);
    }
  } catch (error) {
    console.warn('Không thể load security config từ API:', error);
  }
};

// Export config để sử dụng
export const getSecurityConfig = () => SECURITY_CONFIG;

// Helper functions cho từng loại protection
export const shouldEnableDevToolsProtection = () => {
  return shouldEnableSecurity() && SECURITY_CONFIG.devToolsProtection;
};

export const shouldEnableConsoleProtection = () => {
  return shouldEnableSecurity() && SECURITY_CONFIG.consoleProtection;
};

export const shouldEnableRightClickProtection = () => {
  return shouldEnableSecurity() && SECURITY_CONFIG.rightClickProtection;
};

export const shouldEnableKeyboardProtection = () => {
  return shouldEnableSecurity() && SECURITY_CONFIG.keyboardProtection;
};

export const shouldEnableSourceCodeProtection = () => {
  return shouldEnableSecurity() && SECURITY_CONFIG.sourceCodeProtection;
};

export const shouldEnableDebuggerProtection = () => {
  return shouldEnableSecurity() && SECURITY_CONFIG.debuggerProtection;
}; 