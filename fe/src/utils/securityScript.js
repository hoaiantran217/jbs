// Security Script - Chạy ngay khi trang load
(function() {
  'use strict';

  // Vô hiệu hóa console ngay lập tức
  const disableConsole = () => {
    const noop = () => {};
    const methods = ['log', 'warn', 'error', 'info', 'debug', 'clear', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];
    
    methods.forEach(method => {
      console[method] = noop;
    });

    // Override console object
    Object.defineProperty(window, 'console', {
      get: () => ({
        log: noop,
        warn: noop,
        error: noop,
        info: noop,
        debug: noop,
        clear: noop,
        dir: noop,
        dirxml: noop,
        group: noop,
        groupEnd: noop,
        time: noop,
        timeEnd: noop,
        count: noop,
        trace: noop,
        profile: noop,
        profileEnd: noop,
      }),
      set: () => {},
      configurable: false,
    });
  };

  // Vô hiệu hóa debugger
  const disableDebugger = () => {
    setInterval(() => {
      try {
        debugger;
      } catch (e) {}
    }, 50);
  };

  // Chặn phím tắt
  const disableShortcuts = () => {
    const blockedKeys = ['F12', 'F11', 'F5'];
    const blockedCombos = [
      { ctrl: true, shift: true, key: 'I' },
      { ctrl: true, key: 'U' },
      { ctrl: true, key: 'S' },
      { ctrl: true, shift: true, key: 'C' },
      { ctrl: true, shift: true, key: 'J' },
    ];

    document.addEventListener('keydown', (e) => {
      // Chặn phím đơn
      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
        return false;
      }

      // Chặn tổ hợp phím
      for (const combo of blockedCombos) {
        if (
          (combo.ctrl === undefined || combo.ctrl === e.ctrlKey) &&
          (combo.shift === undefined || combo.shift === e.shiftKey) &&
          (combo.alt === undefined || combo.alt === e.altKey) &&
          combo.key.toLowerCase() === e.key.toLowerCase()
        ) {
          e.preventDefault();
          return false;
        }
      }
    }, true);
  };

  // Chặn chuột phải
  const disableRightClick = () => {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    }, true);
  };

  // Chặn copy và select
  const disableCopySelect = () => {
    document.addEventListener('copy', (e) => {
      e.preventDefault();
      return false;
    }, true);

    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    }, true);

    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    }, true);
  };

  // Phát hiện DevTools
  const detectDevTools = () => {
    let devtools = { open: false, orientation: null };
    const threshold = 160;

    const emitEvent = (isOpen, orientation) => {
      window.dispatchEvent(new CustomEvent('devtoolschange', {
        detail: { isOpen, orientation }
      }));
    };

    const main = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      const orientation = widthThreshold ? 'vertical' : 'horizontal';

      if (
        !(heightThreshold && widthThreshold) &&
        ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || (widthThreshold || heightThreshold))
      ) {
        if ((!devtools.open || devtools.orientation !== orientation)) {
          emitEvent(true, orientation);
          // Ngắt website ngay lập tức
          blockWebsite();
        }
        devtools.open = true;
        devtools.orientation = orientation;
      } else {
        if (devtools.open) {
          emitEvent(false, orientation);
        }
        devtools.open = false;
        devtools.orientation = null;
      }
    };

    // Kiểm tra định kỳ
    setInterval(main, 500);
    window.addEventListener('resize', main);
    window.addEventListener('focus', main);
  };

  // Ngắt hoàn toàn website
  const blockWebsite = () => {
    // Xóa toàn bộ nội dung
    document.documentElement.innerHTML = '';
    document.body.innerHTML = '';
    
    // Tạo trang khóa
    const lockPage = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Access Denied</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #000;
            color: #fff;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
          }
          .container {
            max-width: 500px;
            padding: 20px;
          }
          .icon { font-size: 48px; margin-bottom: 20px; }
          .title { font-size: 24px; margin-bottom: 20px; color: #ef4444; }
          .message { font-size: 16px; margin-bottom: 15px; line-height: 1.5; }
          .details { font-size: 12px; color: #6b7280; line-height: 1.4; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">🚫</div>
          <h1 class="title">TRUY CẬP BỊ TỪ CHỐI</h1>
          <p class="message">
            Phát hiện DevTools đang mở! Website đã bị khóa để bảo vệ bảo mật.
          </p>
          <div class="details">
            <p>• Vui lòng đóng DevTools và tải lại trang</p>
            <p>• Không sử dụng F12, Ctrl+Shift+I hoặc các phím tắt khác</p>
            <p>• Website sẽ tự động khóa khi phát hiện truy cập không hợp lệ</p>
          </div>
        </div>
      </body>
      </html>
    `;

    document.documentElement.innerHTML = lockPage;

    // Vô hiệu hóa tất cả tương tác
    const disableAll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    ['click', 'keydown', 'keyup', 'mousedown', 'mouseup', 'contextmenu', 'selectstart', 'dragstart'].forEach(event => {
      document.addEventListener(event, disableAll, true);
    });

    // Vô hiệu hóa console
    Object.defineProperty(window, 'console', {
      get: () => ({}),
      set: () => {},
      configurable: false,
    });

    // Debugger loop
    setInterval(() => {
      try { debugger; } catch (e) {}
    }, 100);
  };

  // Chạy tất cả biện pháp bảo vệ
  const initSecurity = () => {
    // Chỉ chạy trong production hoặc khi có flag
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Security script disabled in development mode');
      return;
    }
    
    disableConsole();
    disableDebugger();
    disableShortcuts();
    disableRightClick();
    disableCopySelect();
    detectDevTools();
  };

  // Chạy sau khi trang load hoàn toàn
  window.addEventListener('load', () => {
    // Delay một chút để React app load xong
    setTimeout(initSecurity, 1000);
  });
})(); 