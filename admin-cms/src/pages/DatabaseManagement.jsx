import { useState, useEffect } from "react";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";

export default function DatabaseManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearData, setClearData] = useState({
    confirmation: "",
    password: ""
  });
  const [consoleStatus, setConsoleStatus] = useState(null);

  const BASE_URL = 'https://jbs-invest.onrender.com';

  // Lấy trạng thái console
  const getConsoleStatus = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/dashboard/console-control`,
        { action: 'getStatus' },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      setConsoleStatus(response.data.status);
    } catch (err) {
      console.error('Error getting console status:', err);
    }
  };

  // Điều khiển console
  const controlConsole = async (action, levels = null) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/dashboard/console-control`,
        { action, levels },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      setSuccess(response.data.message);
      getConsoleStatus(); // Cập nhật trạng thái
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi khi điều khiển console");
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllData = async () => {
    if (clearData.confirmation !== 'DELETE_ALL_DATA_CONFIRM') {
      setError('Xác nhận không đúng. Vui lòng nhập: DELETE_ALL_DATA_CONFIRM');
      return;
    }

    if (!clearData.password) {
      setError('Vui lòng nhập mật khẩu admin');
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/dashboard/clear-all-data`,
        {
          confirmation: clearData.confirmation,
          password: clearData.password
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      setSuccess(`✅ ${response.data.message}\n📊 Đã xóa ${response.data.deletedCount} documents\n👤 Admin mặc định: ${response.data.defaultAdmin.email} / ${response.data.defaultAdmin.password}`);
      setShowClearModal(false);
      setClearData({ confirmation: "", password: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi khi xóa dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Load console status khi component mount
  useEffect(() => {
    getConsoleStatus();
  }, []);

  return (
    <div className="p-4 w-full bg-white rounded-lg shadow-md min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Database</h1>
          <p className="text-gray-600">Quản lý và bảo trì cơ sở dữ liệu MongoDB</p>
        </div>

        {/* Warning Section */}
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">⚠️ CẢNH BÁO NGUY HIỂM</h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="mb-2">
                  <strong>Hành động này sẽ xóa TOÀN BỘ dữ liệu trong database:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>• Tất cả users, transactions, investments</li>
                  <li>• Tất cả posts, notifications, reviews</li>
                  <li>• Tất cả bank info, team members</li>
                  <li>• Tất cả referral transactions</li>
                  <li>• Và tất cả dữ liệu khác</li>
                </ul>
                <p className="mt-3 font-semibold">
                  ⚠️ Hành động này KHÔNG THỂ HOÀN TÁC!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Database Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Clear All Data */}
          <div className="bg-white border border-red-300 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-800">🗑️ Xóa toàn bộ dữ liệu</h3>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">NGUY HIỂM</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Xóa toàn bộ dữ liệu trong database và tạo admin mặc định mới.
            </p>

            <button
              onClick={() => setShowClearModal(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              🗑️ Xóa toàn bộ dữ liệu
            </button>
          </div>

          {/* Database Info */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Thông tin Database</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Database:</span>
                <span className="font-medium">MongoDB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Host:</span>
                <span className="font-medium">jbs-invest.onrender.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Collections:</span>
                <span className="font-medium">16 collections</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                💡 <strong>Lưu ý:</strong> Sau khi xóa dữ liệu, hệ thống sẽ tạo admin mặc định:<br/>
                Email: admin@jbs.com<br/>
                Password: admin123
              </p>
            </div>
          </div>
        </div>

        {/* Console Control Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔧 Điều khiển Console Output</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Console Status */}
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Trạng thái Console</h3>
              
              {consoleStatus ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`font-medium ${consoleStatus.isDisabled ? 'text-red-600' : 'text-green-600'}`}>
                      {consoleStatus.isDisabled ? '🔇 Đã chặn' : '🔊 Hoạt động'}
                    </span>
                  </div>
                  {consoleStatus.disabledLevels.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Levels bị chặn:</span>
                      <span className="font-medium text-red-600">
                        {consoleStatus.disabledLevels.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Đang tải trạng thái...</p>
              )}
              
              <button
                onClick={getConsoleStatus}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                🔄 Cập nhật trạng thái
              </button>
            </div>

            {/* Console Actions */}
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Hành động</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => controlConsole('disableAll')}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  🔇 Chặn tất cả console
                </button>
                
                <button
                  onClick={() => controlConsole('disableLevels', ['info', 'warn'])}
                  disabled={loading}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  ⚠️ Chặn info & warn
                </button>
                
                <button
                  onClick={() => controlConsole('restoreAll')}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  🔊 Khôi phục tất cả
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800 whitespace-pre-line">{success}</span>
            </div>
          </div>
        )}
      </div>

      {/* Clear Data Modal */}
      <ConfirmModal
        open={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearAllData}
        title="🗑️ Xóa toàn bộ dữ liệu"
        message={
          <div className="space-y-4">
            <div className="text-red-600 font-semibold">
              ⚠️ Bạn có chắc chắn muốn xóa TOÀN BỘ dữ liệu?
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận (nhập: DELETE_ALL_DATA_CONFIRM)
                </label>
                <input
                  type="text"
                  value={clearData.confirmation}
                  onChange={(e) => setClearData({...clearData, confirmation: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="DELETE_ALL_DATA_CONFIRM"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu admin
                </label>
                <input
                  type="password"
                  value={clearData.password}
                  onChange={(e) => setClearData({...clearData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu admin"
                />
              </div>
            </div>
            
            <div className="text-sm text-red-600">
              ⚠️ Hành động này KHÔNG THỂ HOÀN TÁC!
            </div>
          </div>
        }
        confirmText="🗑️ Xóa toàn bộ dữ liệu"
        confirmColor="red"
        loading={loading}
      />
    </div>
  );
} 