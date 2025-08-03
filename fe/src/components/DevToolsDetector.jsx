import { useEffect } from 'react';
import { 
  shouldEnableDevToolsProtection,
  shouldEnableConsoleProtection,
  shouldEnableRightClickProtection,
  shouldEnableKeyboardProtection,
  shouldEnableSourceCodeProtection,
  shouldEnableDebuggerProtection,
  loadSecurityConfig
} from '../config/security';

const DevToolsDetector = () => {
  useEffect(() => {
    // Load cấu hình từ API
    loadSecurityConfig().then(() => {
      // Chỉ chạy security nếu được enable
      if (!shouldEnableDevToolsProtection()) {
        return;
      }

      // DevTools Detection
      const detectDevTools = () => {
        // Kiểm tra nếu là mobile thì bỏ qua
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          return false; // Không check DevTools trên mobile
        }
        
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold || window.Firebug?.chrome?.isInitialized) {
          // Chặn hoàn toàn website
          document.body.innerHTML = `
            <div style="
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              background: #000;
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: Arial, sans-serif;
              z-index: 999999;
            ">
              <div style="text-align: center; padding: 20px;">
                <h1 style="color: #ff4444; margin-bottom: 20px;">⚠️ CẢNH BÁO BẢO MẬT</h1>
                <p style="font-size: 18px; margin-bottom: 15px;">
                  Phát hiện Developer Tools đang mở!
                </p>
                <p style="font-size: 14px; color: #ccc;">
                  Vui lòng đóng Developer Tools để tiếp tục sử dụng website.
                </p>
                <p style="font-size: 12px; color: #888; margin-top: 30px;">
                  Website này được bảo vệ bởi hệ thống chống truy cập trái phép.
                </p>
              </div>
            </div>
          `;
          return true;
        }
        return false;
      };

      // Console Protection
      if (shouldEnableConsoleProtection()) {
        // Override console methods
        const noop = () => {};
        console.log = noop;
        console.info = noop;
        console.warn = noop;
        console.error = noop;
        console.debug = noop;
        
        // Make console non-configurable
        Object.defineProperty(window, 'console', {
          value: console,
          writable: false,
          configurable: false
        });
      }

      // Right Click Protection
      if (shouldEnableRightClickProtection()) {
        document.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          return false;
        });
      }

      // Keyboard Protection
      if (shouldEnableKeyboardProtection()) {
        document.addEventListener('keydown', (e) => {
          // F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, F11, F5
          if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'U') ||
            (e.ctrlKey && e.key === 'S') ||
            e.key === 'F11' ||
            e.key === 'F5'
          ) {
            e.preventDefault();
            return false;
          }
        });
      }

      // Source Code Protection
      if (shouldEnableSourceCodeProtection()) {
        document.addEventListener('copy', (e) => e.preventDefault());
        document.addEventListener('selectstart', (e) => e.preventDefault());
        document.addEventListener('dragstart', (e) => e.preventDefault());
        
        // Interfere with inspect element
        document.addEventListener('mouseover', (e) => {
          e.stopPropagation();
        });
      }

      // Debugger Protection - disabled to prevent performance issues
      // if (shouldEnableDebuggerProtection()) {
      //   setInterval(() => {
      //     debugger;
      //   }, 100);
      // }

      // Check DevTools periodically - increased interval to reduce performance impact
      setInterval(detectDevTools, 5000); // Changed from 500ms to 5000ms

      // Initial check
      detectDevTools();
    });
  }, []);

  return null;
};

export default DevToolsDetector; 