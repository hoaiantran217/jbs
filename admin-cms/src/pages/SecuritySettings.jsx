import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldCheckIcon, 
  ShieldExclamationIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  ComputerDesktopIcon,
  CommandLineIcon,
  CursorArrowRaysIcon,
  DocumentTextIcon,
  BugAntIcon
} from '@heroicons/react/24/outline';

export default function SecuritySettings() {
  const [config, setConfig] = useState({
    devToolsProtection: true,
    consoleProtection: true,
    rightClickProtection: true,
    keyboardProtection: true,
    sourceCodeProtection: true,
    debuggerProtection: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSecurityConfig();
  }, []);

  const fetchSecurityConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/security-config`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfig(response.data);
    } catch (err) {
      console.error('Error fetching security config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/security-config`, config, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Cập nhật thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Lỗi khi cập nhật: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Bạn có chắc muốn reset về cấu hình mặc định?')) return;
    
    setSaving(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/security-config/reset`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfig(response.data.config);
      setMessage('Đã reset thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Lỗi khi reset: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const securityFeatures = [
    {
      key: 'devToolsProtection',
      title: 'Bảo vệ DevTools',
      description: 'Chặn việc mở Developer Tools (F12, Ctrl+Shift+I)',
      icon: ComputerDesktopIcon,
      color: 'blue'
    },
    {
      key: 'consoleProtection',
      title: 'Bảo vệ Console',
      description: 'Vô hiệu hóa console.log và các phương thức console',
      icon: CommandLineIcon,
      color: 'green'
    },
    {
      key: 'rightClickProtection',
      title: 'Bảo vệ Chuột phải',
      description: 'Chặn menu chuột phải (Inspect Element)',
      icon: CursorArrowRaysIcon,
      color: 'purple'
    },
    {
      key: 'keyboardProtection',
      title: 'Bảo vệ Bàn phím',
      description: 'Chặn các phím tắt như Ctrl+U, Ctrl+S, F11',
      icon: KeyIcon,
      color: 'orange'
    },
    {
      key: 'sourceCodeProtection',
      title: 'Bảo vệ Mã nguồn',
      description: 'Chặn việc copy, select và drag text',
      icon: DocumentTextIcon,
      color: 'red'
    },
    {
      key: 'debuggerProtection',
      title: 'Bảo vệ Debugger',
      description: 'Chặn debugger statement và breakpoints',
      icon: BugAntIcon,
      color: 'yellow'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cài đặt Bảo mật</h1>
        <p className="text-gray-600">
          Quản lý các tính năng bảo vệ website khỏi việc truy cập trái phép
        </p>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.includes('thành công') || message.includes('Đã reset')
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="grid gap-6">
        {securityFeatures.map((feature) => {
          const Icon = feature.icon;
          const isEnabled = config[feature.key];
          
          return (
            <div key={feature.key} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-${feature.color}-100`}>
                    <Icon className={`h-6 w-6 text-${feature.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${
                    isEnabled ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {isEnabled ? 'Bật' : 'Tắt'}
                  </span>
                  
                  <button
                    onClick={() => handleToggle(feature.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex space-x-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <ShieldCheckIcon className="h-5 w-5" />
              <span>Lưu cài đặt</span>
            </>
          )}
        </button>
        
        <button
          onClick={handleReset}
          disabled={saving}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <ShieldExclamationIcon className="h-5 w-5" />
          <span>Reset mặc định</span>
        </button>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <ShieldExclamationIcon className="h-6 w-6 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Lưu ý quan trọng</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Các tính năng bảo mật này sẽ được áp dụng cho tất cả người dùng. 
              Việc tắt các tính năng này có thể làm giảm tính bảo mật của website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 