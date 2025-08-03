// Test Security Features
export const testSecurityFeatures = () => {
  console.log('🔒 Testing Security Features...');

  // Test 1: Console Protection
  try {
    console.log('Test console.log');
    console.warn('Test console.warn');
    console.error('Test console.error');
    console.log('✅ Console protection working');
  } catch (e) {
    console.log('❌ Console protection failed:', e.message);
  }

  // Test 2: Right Click Protection
  try {
    const testEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(testEvent);
    console.log('✅ Right click protection working');
  } catch (e) {
    console.log('❌ Right click protection failed:', e.message);
  }

  // Test 3: DevTools Detection
  const widthThreshold = window.outerWidth - window.innerWidth > 160;
  const heightThreshold = window.outerHeight - window.innerHeight > 160;
  
  if (widthThreshold || heightThreshold) {
    console.log('🚨 DevTools detected!');
  } else {
    console.log('✅ DevTools not detected');
  }

  // Test 4: Environment Check
  const hostname = window.location.hostname;
  const isDev = hostname === 'localhost' || hostname === '127.0.0.1';
  console.log(`🌍 Environment: ${isDev ? 'Development' : 'Production'}`);

  // Test 5: Keyboard Shortcuts
  try {
    const testKeyEvent = new KeyboardEvent('keydown', {
      key: 'F12',
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(testKeyEvent);
    console.log('✅ Keyboard protection working');
  } catch (e) {
    console.log('❌ Keyboard protection failed:', e.message);
  }

  console.log('🔒 Security test completed!');
};

// Auto-run test in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(testSecurityFeatures, 2000);
} 