// Console Manager - Quản lý console output
class ConsoleManager {
  constructor() {
    this.originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };
    
    this.isDisabled = false;
    this.disabledLevels = new Set();
  }

  // Chặn tất cả console output
  disableAll() {
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.debug = () => {};
    this.isDisabled = true;
    console.log('🔇 Console output disabled');
  }

  // Chặn theo level cụ thể
  disableLevel(level) {
    if (this.originalConsole[level]) {
      console[level] = () => {};
      this.disabledLevels.add(level);
    }
  }

  // Chặn nhiều level
  disableLevels(levels) {
    levels.forEach(level => this.disableLevel(level));
  }

  // Khôi phục tất cả console
  restoreAll() {
    console.log = this.originalConsole.log;
    console.info = this.originalConsole.info;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
    console.debug = this.originalConsole.debug;
    this.isDisabled = false;
    this.disabledLevels.clear();
    console.log('🔊 Console output restored');
  }

  // Khôi phục level cụ thể
  restoreLevel(level) {
    if (this.originalConsole[level]) {
      console[level] = this.originalConsole[level];
      this.disabledLevels.delete(level);
    }
  }

  // Chặn chỉ info và warn
  disableInfoAndWarn() {
    this.disableLevels(['info', 'warn']);
  }

  // Chặn chỉ error
  disableErrors() {
    this.disableLevel('error');
  }

  // Chặn tất cả trừ error
  disableAllExceptError() {
    this.disableLevels(['log', 'info', 'warn', 'debug']);
  }

  // Chặn tất cả trừ log
  disableAllExceptLog() {
    this.disableLevels(['info', 'warn', 'error', 'debug']);
  }

  // Kiểm tra trạng thái
  getStatus() {
    return {
      isDisabled: this.isDisabled,
      disabledLevels: Array.from(this.disabledLevels)
    };
  }
}

// Tạo instance mặc định
const consoleManager = new ConsoleManager();

module.exports = consoleManager; 