import { useState, useEffect } from 'react';
import axios from 'axios';
// import { Switch } from '@heroicons/react/24/outline';
import { 
  GiftIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Promotions() {
  const [config, setConfig] = useState({
    isEnabled: false,
    amount: 0,
    description: 'Khuyến mãi cho thành viên mới'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  const BASE_URL = 'https://jbs-invest.onrender.com';

  useEffect(() => {
    fetchConfig();
    fetchHistory();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/promotion/config`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfig(response.data);
    } catch (err) {
      console.error('Error fetching promotion config:', err);
      toast.error('Không thể tải cấu hình khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (page = 1) => {
    try {
      setHistoryLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/promotion/history?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data.transactions);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setTotalAmount(response.data.totalAmount);
    } catch (err) {
      console.error('Error fetching promotion history:', err);
      toast.error('Không thể tải lịch sử khuyến mãi');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleTogglePromotion = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const newConfig = {
        ...config,
        isEnabled: !config.isEnabled
      };
      
      const response = await axios.put(`${BASE_URL}/api/promotion/config`, newConfig, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setConfig(response.data.config);
      toast.success(response.data.message);
    } catch (err) {
      console.error('Error updating promotion config:', err);
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleAmountChange = async (amount) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const newConfig = {
        ...config,
        amount: amount
      };
      
      const response = await axios.put(`${BASE_URL}/api/promotion/config`, newConfig, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setConfig(response.data.config);
      toast.success(response.data.message);
    } catch (err) {
      console.error('Error updating promotion amount:', err);
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý khuyến mãi</h1>
        <p className="text-gray-600">Cấu hình khuyến mãi cho thành viên mới</p>
      </div>

      {/* Cấu hình khuyến mãi */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <GiftIcon className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Cấu hình khuyến mãi</h2>
              <p className="text-gray-600">Bật/tắt và chọn số tiền khuyến mãi</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-3 text-sm font-medium text-gray-700">
              {config.isEnabled ? 'Đang bật' : 'Đang tắt'}
            </span>
            <button
              onClick={handleTogglePromotion}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                config.isEnabled ? 'bg-green-600' : 'bg-gray-200'
              } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {config.isEnabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn số tiền khuyến mãi
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[200000, 500000, 800000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountChange(amount)}
                    disabled={saving}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      config.amount === amount
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">{formatCurrency(amount)}</div>
                      <div className="text-sm text-gray-500">
                        {amount === 200000 ? '200k' : amount === 500000 ? '500k' : '800k'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  Khuyến mãi sẽ tự động được áp dụng cho tất cả thành viên mới đăng ký
                </span>
              </div>
            </div>
          </div>
        )}

        {!config.isEnabled && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircleIcon className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-600">
                Khuyến mãi đang tắt. Thành viên mới sẽ không nhận được khuyến mãi.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng khuyến mãi đã phát</p>
              <p className="text-2xl font-bold text-gray-800">{history.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng tiền đã phát</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <GiftIcon className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Trạng thái hiện tại</p>
              <p className={`text-2xl font-bold ${config.isEnabled ? 'text-green-600' : 'text-red-600'}`}>
                {config.isEnabled ? 'Đang bật' : 'Đang tắt'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lịch sử khuyến mãi */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ClockIcon className="w-6 h-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Lịch sử khuyến mãi</h2>
          </div>
          <button
            onClick={() => fetchHistory(1)}
            disabled={historyLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {historyLoading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8">
            <GiftIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có lịch sử khuyến mãi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thành viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày nhận
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.user?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.user?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">
                        {formatCurrency(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Trang {currentPage} của {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => fetchHistory(currentPage - 1)}
                disabled={currentPage === 1 || historyLoading}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => fetchHistory(currentPage + 1)}
                disabled={currentPage === totalPages || historyLoading}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 