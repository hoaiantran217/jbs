import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BuildingLibraryIcon,
  CreditCardIcon,
  UserIcon,
  QrCodeIcon,
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function BankInfo() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    bankAccount: '',
    bankAccountHolder: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        bankName: user.bankName || '',
        bankAccount: user.bankAccount || '',
        bankAccountHolder: user.bankAccountHolder || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Token from localStorage:', token);
      console.log('🔍 Token type:', typeof token);
      console.log('🔍 Token length:', token ? token.length : 0);
      
      if (!token || token === 'null' || token === 'undefined') {
        alert('Token không hợp lệ. Vui lòng đăng nhập lại.');
        return;
      }
      
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/user/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update user context
      window.dispatchEvent(new CustomEvent('userDataChanged', {
        detail: { userData: response.data }
      }));
      
      // Lưu thông tin ngân hàng vào localStorage
      localStorage.setItem('bankAccount', response.data.bankAccount || '');
      localStorage.setItem('bankName', response.data.bankName || '');
      localStorage.setItem('bankAccountHolder', response.data.bankAccountHolder || '');
      
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating bank info:', error);
      
      if (error.response?.status === 403) {
        if (error.response?.data?.message === 'Tài khoản đã bị khóa') {
          alert('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để được hỗ trợ.');
        } else {
          alert('Không có quyền cập nhật thông tin. Vui lòng đăng nhập lại.');
        }
      } else if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        alert('Có lỗi xảy ra khi cập nhật thông tin ngân hàng: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const hasBankInfo = user?.bankName && user?.bankAccount && user?.bankAccountHolder;
  const isAccountActive = user?.isActive !== false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link
              to="/profile"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-1" />
              Quay lại
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Thông tin ngân hàng cá nhân</h1>
              <p className="text-gray-600">Thông tin tài khoản ngân hàng để nhận tiền rút</p>
            </div>
          </div>

          {/* Account Status Warning */}
          {!isAccountActive && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Tài khoản đã bị khóa
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để được hỗ trợ.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!hasBankInfo ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <BuildingLibraryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thông tin ngân hàng</h3>
              <p className="text-gray-500 mb-6">Vui lòng cập nhật thông tin ngân hàng để có thể rút tiền</p>
              <button
                onClick={() => setShowEditForm(true)}
                disabled={!isAccountActive}
                className={`px-6 py-3 rounded-lg transition-colors flex items-center mx-auto ${
                  isAccountActive 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                {isAccountActive ? 'Thêm thông tin ngân hàng' : 'Tài khoản đã bị khóa'}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BuildingLibraryIcon className="w-8 h-8 mr-3" />
                    <div>
                      <h3 className="text-xl font-bold">Thông tin ngân hàng cá nhân</h3>
                      <p className="text-green-100 text-sm">Tài khoản để nhận tiền rút</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEditForm(true)}
                    disabled={!isAccountActive}
                    className={`p-2 rounded-lg transition-colors ${
                      isAccountActive 
                        ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
                        : 'bg-gray-400 bg-opacity-20 cursor-not-allowed'
                    }`}
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <BuildingLibraryIcon className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Tên ngân hàng</div>
                      <div className="font-semibold text-lg text-gray-800">
                        {user.bankName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CreditCardIcon className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Số tài khoản</div>
                      <div className="font-mono font-bold text-lg text-gray-800">
                        {user.bankAccount}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <UserIcon className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Chủ tài khoản</div>
                      <div className="font-semibold text-lg text-gray-800">
                        {user.bankAccountHolder || user.name}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">
                            Lưu ý quan trọng
                          </h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <ul className="list-disc list-inside space-y-1">
                              <li>Thông tin này sẽ được sử dụng để chuyển tiền khi bạn rút</li>
                              <li>Vui lòng kiểm tra kỹ thông tin trước khi cập nhật</li>
                              <li>Admin sẽ chuyển tiền vào tài khoản này khi duyệt yêu cầu rút</li>
                              <li>Liên hệ admin nếu cần hỗ trợ</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Form Modal */}
          {showEditForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {hasBankInfo ? 'Cập nhật thông tin ngân hàng' : 'Thêm thông tin ngân hàng'}
                </h3>
                
                {!isAccountActive && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-red-700">Tài khoản đã bị khóa. Không thể cập nhật thông tin.</span>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên ngân hàng
                    </label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: Vietcombank, BIDV, Agribank..."
                      required
                      disabled={!isAccountActive}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số tài khoản
                    </label>
                    <input
                      type="text"
                      value={formData.bankAccount}
                      onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: 1234567890"
                      required
                      disabled={!isAccountActive}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chủ tài khoản
                    </label>
                    <input
                      type="text"
                      value={formData.bankAccountHolder}
                      onChange={(e) => setFormData({ ...formData, bankAccountHolder: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: NGUYEN VAN A"
                      required
                      disabled={!isAccountActive}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !isAccountActive}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                        isAccountActive
                          ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {loading ? 'Đang xử lý...' : 'Lưu'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Hướng dẫn sử dụng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">Để nạp tiền:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Vào trang Profile → Nạp ngay</li>
                  <li>Chọn tài khoản ngân hàng hệ thống</li>
                  <li>Chuyển khoản với nội dung: Tên + SĐT của bạn</li>
                  <li>Chụp ảnh biên lai và gửi xác nhận</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Để rút tiền:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Cập nhật thông tin ngân hàng cá nhân ở trên</li>
                  <li>Vào trang Profile → Rút ngay</li>
                  <li>Nhập số tiền muốn rút</li>
                  <li>Chờ admin xác nhận và chuyển khoản</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 