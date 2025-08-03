import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ClipboardDocumentIcon,
  ShareIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function ReferralInfo() {
  const { user } = useUser();
  const [referralInfo, setReferralInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralInfo();
  }, []);
  const BASE_URL = 'https://jbs-invest.onrender.com'
  const fetchReferralInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập để xem thông tin giới thiệu");
        setLoading(false);
        return;
      }

      console.log('Fetching referral info...');
      const response = await axios.get(`${BASE_URL}/api/user/referral-info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Referral info received:', response.data);
      setReferralInfo(response.data);
    } catch (err) {
      console.error('Error fetching referral info:', err);
      
      let errorMessage = "Không thể tải thông tin giới thiệu";
      
      if (err.response) {
        // Server trả về lỗi
        if (err.response.status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
        } else if (err.response.status === 404) {
          errorMessage = "Không tìm thấy thông tin người dùng";
        } else if (err.response.status === 500) {
          errorMessage = "Lỗi server, vui lòng thử lại sau";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // Không có response từ server
        errorMessage = "Không thể kết nối đến server, vui lòng kiểm tra kết nối mạng";
      } else {
        // Lỗi khác
        errorMessage = err.message || "Có lỗi xảy ra";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = async () => {
    if (!referralInfo.referralCode) return;
    
    try {
      await navigator.clipboard.writeText(referralInfo.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareReferralLink = () => {
    if (!referralInfo.referralCode) return;
    
    const referralLink = `${window.location.origin}/register?ref=${referralInfo.referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Tham gia JBS Invest',
        text: `Đăng ký tài khoản JBS Invest với mã giới thiệu của tôi: ${referralInfo.referralCode}`,
        url: referralLink
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hệ thống giới thiệu</h1>
          <p className="text-gray-600">Chia sẻ và nhận thưởng từ hệ thống giới thiệu</p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Referral Code */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <UserGroupIcon className="h-6 w-6 mr-2 text-blue-500" />
              Mã giới thiệu của bạn
            </h2>
            
            {referralInfo.referralCode ? (
              <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm mb-1">Mã giới thiệu</p>
                    <p className="text-white text-lg font-bold break-all">{referralInfo.referralCode}</p>
                  </div>
                  <button
                    onClick={copyReferralCode}
                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                  >
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">Tài khoản cũ</p>
                  <p className="text-gray-500 text-sm">Tài khoản này được tạo trước khi có hệ thống giới thiệu</p>
                </div>
              </div>
            )}

            {copied && (
              <div className="flex items-center p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 mb-4">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                <span className="text-sm">Đã sao chép mã giới thiệu!</span>
              </div>
            )}

            {referralInfo.referralCode && (
              <button
                onClick={shareReferralLink}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <ShareIcon className="h-5 w-5 mr-2" />
                Chia sẻ mã giới thiệu
              </button>
            )}

            {/* Referral Policy */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Chính sách thưởng</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 5% thưởng cho lần nạp đầu tiên</li>
                <li>• 1-2% lợi nhuận hàng tháng từ người được giới thiệu</li>
                <li>• Thu nhập thụ động, ổn định</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Statistics */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CurrencyDollarIcon className="h-6 w-6 mr-2 text-green-500" />
              Thống kê giới thiệu
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{referralInfo.referralCount}</p>
                <p className="text-sm text-gray-600">Người đã giới thiệu</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {referralInfo.referralEarnings?.toLocaleString() || 0} VNĐ
                </p>
                <p className="text-sm text-gray-600">Tổng thu nhập</p>
              </div>
            </div>

            {/* Referred Users List */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Danh sách người được giới thiệu</h3>
              {referralInfo.referredUsers && referralInfo.referredUsers.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {referralInfo.referredUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Chưa có người nào được giới thiệu</p>
              )}
            </div>
          </div>
        </div>

        {/* Ai giới thiệu - New Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <UserGroupIcon className="h-6 w-6 mr-2 text-purple-500" />
            Ai giới thiệu bạn?
          </h2>
          
          {referralInfo.referrer ? (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {referralInfo.referrer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{referralInfo.referrer.name}</h3>
                      <p className="text-sm text-gray-600">{referralInfo.referrer.email}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Ngày đăng ký:</span> {new Date(referralInfo.referrer.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Mã giới thiệu:</span> {referralInfo.referrer.referralCode || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500 mr-2" />
                  <span className="text-sm text-green-600 font-medium">Đã xác nhận</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Không có người giới thiệu</h3>
              <p className="text-gray-600 mb-4">
                Tài khoản này được tạo trực tiếp mà không thông qua mã giới thiệu của ai cả.
              </p>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 <strong>Mẹo:</strong> Bạn có thể chia sẻ mã giới thiệu của mình để nhận thưởng từ những người đăng ký sau này!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Referral History */}
        {referralInfo.referralHistory && referralInfo.referralHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lịch sử thưởng giới thiệu</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Ngày</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Loại</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {referralInfo.referralHistory.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(item.date).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.type === 'first_deposit' 
                            ? 'bg-blue-100 text-blue-800' 
                            : item.type === 'monthly_profit'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.type === 'first_deposit' ? 'Nạp lần đầu' : 
                           item.type === 'monthly_profit' ? 'Lợi nhuận tháng' : 
                           'Đăng ký mới'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {item.amount > 0 ? `${item.amount?.toLocaleString()} VNĐ` : 'Chưa có thưởng'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 