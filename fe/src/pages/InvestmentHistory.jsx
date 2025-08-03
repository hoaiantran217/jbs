import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ClockIcon, 
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

export default function InvestmentHistory() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvestmentHistory();
  }, []);

  // Timer để cập nhật thời gian còn lại mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining = {};
      investments.forEach(investment => {
        if (investment.status === 'approved' && investment.maturityStatus === 'pending') {
          const remaining = calculateTimeRemaining(investment.createdAt, investment.package?.duration);
          newTimeRemaining[investment._id] = remaining;
          
          // Tự động cộng lãi khi hết thời gian
          if (remaining.total <= 0) {
            handleAutoMaturity(investment);
          }
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [investments]);

  const fetchInvestmentHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/investments/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setInvestments(response.data);
    } catch (err) {
      console.error('Error fetching investment history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tính thời gian còn lại theo ngày giờ phút giây
  const calculateTimeRemaining = (startDate, duration) => {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + (duration * 24 * 60 * 60 * 1000));
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { total: diff, days, hours, minutes, seconds };
  };

  // Tự động cộng lãi khi hết thời gian
  const handleAutoMaturity = async (investment) => {
    try {
      console.log('🔄 Bắt đầu auto maturity cho khoản đầu tư:', investment._id);
      
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/investments/${investment._id}/auto-maturity`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Refresh danh sách sau khi cộng lãi
      await fetchInvestmentHistory();
      
      // Hiển thị thông báo thành công
      alert(`🎉 Khoản đầu tư "${investment.package?.name}" đã được đáo hạn tự động!\n\n💰 Tiền gốc: ${investment.amount?.toLocaleString()} đ\n💵 Tiền lãi: ${Math.round((investment.amount * investment.package?.interestRate) / 100).toLocaleString()} đ\n\nTổng cộng: ${Math.round(investment.amount + (investment.amount * investment.package?.interestRate) / 100).toLocaleString()} đ đã được cộng vào tài khoản của bạn!`);
      
      console.log('✅ Auto maturity completed for investment:', investment._id);
    } catch (error) {
      console.error('❌ Error in auto maturity:', error);
      
      // Nếu lỗi là do chưa đến thời gian đáo hạn, không hiển thị lỗi
      if (error.response?.data?.message?.includes('Chưa đến thời gian đáo hạn')) {
        return;
      }
      
      alert('❌ Có lỗi xảy ra khi xử lý đáo hạn tự động. Vui lòng thử lại sau.');
    }
  };

  const getStatusBadge = (status, maturityStatus) => {
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <ClockIcon className="w-3 h-3 mr-1" />
          Chờ duyệt
        </span>
      );
    } else if (status === 'rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircleIcon className="w-3 h-3 mr-1" />
          Từ chối
        </span>
      );
    } else if (status === 'approved' && maturityStatus === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Đang đầu tư
        </span>
      );
    } else if (status === 'approved' && maturityStatus === 'approved') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Hoàn thành
        </span>
      );
    } else if (status === 'approved' && maturityStatus === 'rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircleIcon className="w-3 h-3 mr-1" />
          Từ chối đáo hạn
        </span>
      );
    }
    return null;
  };

  const getMaturityStatusBadge = (maturityStatus) => {
    if (maturityStatus === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Chờ đáo hạn
        </span>
      );
    } else if (maturityStatus === 'approved') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Đã đáo hạn
        </span>
      );
    } else if (maturityStatus === 'rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Từ chối đáo hạn
        </span>
      );
    }
    return null;
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

  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateProgress = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    const totalDuration = end - start;
    const elapsed = now - start;
    
    if (elapsed <= 0) return 0;
    if (elapsed >= totalDuration) return 100;
    
    return Math.round((elapsed / totalDuration) * 100);
  };

  // Format thời gian còn lại
  const formatTimeRemaining = (remaining) => {
    if (remaining.total <= 0) {
      return (
        <div className="flex items-center space-x-1">
          <ClockIcon className="w-4 h-4 text-red-600" />
          <span className="text-red-600 font-semibold">Đã hết hạn</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-1">
        <ClockIcon className="w-4 h-4 text-orange-600" />
        <div className="flex items-center space-x-1">
          {remaining.days > 0 && (
            <span className="text-orange-600 font-semibold">
              {remaining.days} ngày{' '}
            </span>
          )}
          <span className="text-orange-600 font-semibold font-mono">
            {remaining.hours.toString().padStart(2, '0')}:
            {remaining.minutes.toString().padStart(2, '0')}:
            {remaining.seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    );
  };

  const openInvestmentDetail = (investment) => {
    setSelectedInvestment(investment);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch sử đầu tư...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 md:p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng đầu tư</p>
                <p className="text-2xl font-bold text-gray-900">
                  {investments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-2 md:p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang đầu tư</p>
                <p className="text-2xl font-bold text-gray-900">
                  {investments.filter(inv => inv.status === 'approved' && inv.maturityStatus === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-2 md:p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">
                  {investments.filter(inv => inv.status === 'approved' && inv.maturityStatus === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-2 md:p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {investments.filter(inv => inv.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách đầu tư */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Danh sách đầu tư</h2>
          </div>

          {investments.length === 0 ? (
            <div className="text-center py-12">
              <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khoản đầu tư nào</h3>
              <p className="text-gray-500 mb-6">Bắt đầu đầu tư để xem lịch sử tại đây</p>
              <button
                onClick={() => navigate('/packages')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xem gói đầu tư
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {investments.map((investment) => (
                <div key={investment._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start md:items-center justify-start flex-col md:flex-row md:justify-between w-full">
                    <div className="flex-1 w-full">
                      <div className="flex flex-col md:flex-row justify-start items-start md:items-center md:justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {investment.package?.name || 'Gói đầu tư'}
                        </h3>
                        <div className="flex items-center space-x-2 mt-2 md:mt-0">
                          {getStatusBadge(investment.status, investment.maturityStatus)}
                          {investment.status === 'approved' && getMaturityStatusBadge(investment.maturityStatus)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Số tiền đầu tư</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {investment.amount?.toLocaleString()} đ
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Lãi suất</p>
                          <p className="text-lg font-semibold text-green-600">
                            {investment.package?.interestRate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Kỳ hạn</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {investment.package?.duration} ngày
                          </p>
                        </div>
                      </div>

                      {investment.status === 'approved' && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Tiến độ đầu tư</span>
                            <span>{calculateProgress(investment.createdAt, investment.package?.duration)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${calculateProgress(investment.createdAt, investment.package?.duration)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          <span>Ngày đầu tư: {formatDate(investment.createdAt)}</span>
                        </div>
                        {investment.status === 'approved' && investment.maturityStatus === 'pending' && (
                          <div className="flex items-center">
                            {formatTimeRemaining(timeRemaining[investment._id] || calculateTimeRemaining(investment.createdAt, investment.package?.duration))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full bg-blue-100 rounded-lg p-2 mt-2 flex justify-center">
                      <button
                        onClick={() => openInvestmentDetail(investment)}
                        className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal chi tiết đầu tư */}
      {showModal && selectedInvestment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Chi tiết đầu tư</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Thông tin gói */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin gói đầu tư</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Tên gói</p>
                        <p className="font-semibold">{selectedInvestment.package?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Lãi suất</p>
                        <p className="font-semibold text-green-600">{selectedInvestment.package?.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Kỳ hạn</p>
                        <p className="font-semibold">{selectedInvestment.package?.duration} ngày</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Số tiền đầu tư</p>
                        <p className="font-semibold">{selectedInvestment.amount?.toLocaleString()} đ</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trạng thái */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Trạng thái</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Trạng thái đầu tư:</span>
                      {getStatusBadge(selectedInvestment.status, selectedInvestment.maturityStatus)}
                    </div>
                    {selectedInvestment.status === 'approved' && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Trạng thái đáo hạn:</span>
                        {getMaturityStatusBadge(selectedInvestment.maturityStatus)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Thời gian */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin thời gian</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đầu tư:</span>
                      <span>{formatDate(selectedInvestment.createdAt)}</span>
                    </div>
                    {selectedInvestment.status === 'approved' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày duyệt:</span>
                          <span>{formatDate(selectedInvestment.updatedAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày đáo hạn dự kiến:</span>
                          <span>
                            {new Date(new Date(selectedInvestment.createdAt).getTime() + (selectedInvestment.package?.duration * 24 * 60 * 60 * 1000)).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        {selectedInvestment.maturityStatus === 'pending' && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Thời gian còn lại:</span>
                            <span className="text-orange-600 font-semibold">
                              {formatTimeRemaining(timeRemaining[selectedInvestment._id] || calculateTimeRemaining(selectedInvestment.createdAt, selectedInvestment.package?.duration))}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Lãi dự kiến */}
                {selectedInvestment.status === 'approved' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Lãi dự kiến</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Tiền lãi dự kiến</p>
                          <p className="text-xl font-bold text-green-600">
                            {Math.round((selectedInvestment.amount * selectedInvestment.package?.interestRate) / 100).toLocaleString()} đ
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tổng nhận về</p>
                          <p className="text-xl font-bold text-green-600">
                            {Math.round(selectedInvestment.amount + (selectedInvestment.amount * selectedInvestment.package?.interestRate) / 100).toLocaleString()} đ
                          </p>
                        </div>
                      </div>
                      
                      {selectedInvestment.maturityStatus === 'pending' && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-start">
                            <ClockIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                            <div className="text-sm text-blue-800">
                              <p className="font-semibold">💡 Tính năng đáo hạn tự động</p>
                              <p>Khi hết thời gian đầu tư, hệ thống sẽ tự động cộng tiền gốc và lãi vào tài khoản của bạn. Admin vẫn có thể duyệt đáo hạn sớm nếu cần.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Ghi chú */}
                {selectedInvestment.note && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Ghi chú</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-gray-700">{selectedInvestment.note}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 