import React, { useState } from 'react';

const SecurityTest = () => {
  const [testResult, setTestResult] = useState('');

  const testSecurity = () => {
    const tests = [
      {
        name: 'Console Test',
        test: () => {
          try {
            console.log('Test log');
            return 'Console working';
          } catch (e) {
            return 'Console blocked';
          }
        }
      },
      {
        name: 'Right Click Test',
        test: () => {
          try {
            document.addEventListener('contextmenu', (e) => {
              e.preventDefault();
            });
            return 'Right click working';
          } catch (e) {
            return 'Right click blocked';
          }
        }
      },
      {
        name: 'DevTools Detection',
        test: () => {
          const widthThreshold = window.outerWidth - window.innerWidth > 160;
          const heightThreshold = window.outerHeight - window.innerHeight > 160;
          if (widthThreshold || heightThreshold) {
            return 'DevTools detected';
          }
          return 'DevTools not detected';
        }
      },
      {
        name: 'Environment Check',
        test: () => {
          const hostname = window.location.hostname;
          const isDev = hostname === 'localhost' || hostname === '127.0.0.1';
          return isDev ? 'Development mode' : 'Production mode';
        }
      }
    ];

    let results = 'Security Test Results:\n\n';
    tests.forEach(test => {
      try {
        const result = test.test();
        results += `${test.name}: ${result}\n`;
      } catch (e) {
        results += `${test.name}: Error - ${e.message}\n`;
      }
    });

    setTestResult(results);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Security Test</h3>
      <button
        onClick={testSecurity}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Run Security Test
      </button>
      {testResult && (
        <pre className="mt-4 p-4 bg-white rounded border text-sm">
          {testResult}
        </pre>
      )}
    </div>
  );
};

export default SecurityTest; 