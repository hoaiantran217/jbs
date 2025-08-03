import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { BellIcon, CheckCircleIcon, ClockIcon, XMarkIcon, IdentificationIcon } from "@heroicons/react/24/outline";

export default function TransactionNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeType, setActiveType] = useState("all");
  const { user } = useUser();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/transaction-notifications/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setNotifications(response.data);
    } catch (err) {
      setError("Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`${BASE_URL}/api/transaction-notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      // Cập nhật local state
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Lỗi đánh dấu đã đọc:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${BASE_URL}/api/transaction-notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      // Xóa khỏi local state
      setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
    } catch (err) {
      console.error('Lỗi xóa thông báo:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusColor = (isRead) => {
    return isRead ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusLabel = (isRead) => {
    return isRead ? 'Đã đọc' : 'Chưa đọc';
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'deposit':
        return 'Nạp tiền';
      case 'withdraw':
        return 'Rút tiền';
      case 'identity_verification':
        return 'Xác minh danh tính';
      default:
        return 'Khác';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-800';
      case 'withdraw':
        return 'bg-blue-100 text-blue-800';
      case 'identity_verification':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return '💵';
      case 'withdraw':
        return '💸';
      case 'identity_verification':
        return '🆔';
      default:
        return '📢';
    }
  };

  // Lọc notifications theo loại
  const filteredNotifications = notifications.filter(notification => {
    if (activeType === "all") return true;
    return notification.type === activeType;
  });

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    read: notifications.filter(n => n.isRead).length,
    deposit: notifications.filter(n => n.type === 'deposit').length,
    withdraw: notifications.filter(n => n.type === 'withdraw').length,
    identity: notifications.filter(n => n.type === 'identity_verification').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BellIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thông báo giao dịch</h1>
              <p className="text-gray-600">Xem lại tất cả thông báo giao dịch của bạn</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BellIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng cộng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chưa đọc</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã đọc</p>
                <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💵</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nạp tiền</p>
                <p className="text-2xl font-bold text-gray-900">{stats.deposit}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">💸</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rút tiền</p>
                <p className="text-2xl font-bold text-gray-900">{stats.withdraw}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <IdentificationIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Xác minh</p>
                <p className="text-2xl font-bold text-gray-900">{stats.identity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'Tất cả loại', icon: '📊' },
            { key: 'deposit', label: 'Nạp tiền', icon: '💵' },
            { key: 'withdraw', label: 'Rút tiền', icon: '💸' },
            { key: 'identity_verification', label: 'Xác minh', icon: '🆔' }
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setActiveType(type.key)}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                activeType === type.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <span className="text-4xl mb-4 block">📭</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
              <p className="text-gray-500">
                {activeType === 'all' ? 'Bạn chưa có thông báo giao dịch nào.' : 
                 `Bạn chưa có thông báo ${getTypeLabel(activeType).toLowerCase()} nào.`}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                  notification.isRead ? 'border-green-500' : 'border-yellow-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notification.isRead ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <span className="text-lg">{getTypeIcon(notification.type)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                          {getTypeLabel(notification.type)}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.isRead)}`}>
                          {getStatusLabel(notification.isRead)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-600 mb-1">Mã giao dịch</p>
                          <p className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                            {notification.transactionCode}
                          </p>
                        </div>
                        {notification.type !== 'identity_verification' && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                              {notification.type === 'deposit' ? 'Số tiền nạp' : 'Số tiền rút'}
                            </p>
                            <p className="font-bold text-green-600">
                              {notification.amount?.toLocaleString('vi-VN')} VNĐ
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bank Info for Withdraw */}
                      {notification.type === 'withdraw' && notification.bankInfo && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-blue-800 mb-2">Tài khoản nhận</p>
                          <div className="text-sm text-blue-700 space-y-1">
                            <div><span className="font-medium">Ngân hàng:</span> {notification.bankInfo?.bankName}</div>
                            <div><span className="font-medium">Số tài khoản:</span> {notification.bankInfo?.accountNumber}</div>
                            <div><span className="font-medium">Người thụ hưởng:</span> {notification.bankInfo?.accountName}</div>
                          </div>
                        </div>
                      )}

                      {/* Identity Info for Verification */}
                      {notification.type === 'identity_verification' && notification.identityInfo && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-purple-800 mb-2">Thông tin xác minh</p>
                          <div className="text-sm text-purple-700 space-y-1">
                            <div><span className="font-medium">Loại giấy tờ:</span> {notification.identityInfo?.documentType}</div>
                            <div><span className="font-medium">Họ tên:</span> {notification.identityInfo?.fullName}</div>
                            <div><span className="font-medium">Số giấy tờ:</span> {notification.identityInfo?.documentNumber}</div>
                          </div>
                        </div>
                      )}

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-yellow-800 mb-2">Thời gian xử lý dự kiến</p>
                        <p className="text-sm text-yellow-700">
                          {notification.type === 'identity_verification' ? 'Từ 30 đến 120 phút' : 'Từ 10 đến 120 phút'}
                        </p>
                      </div>

                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-orange-800 mb-2">Lưu ý:</h4>
                        <ul className="text-sm text-orange-700 space-y-1">
                          <li>• Trong thời gian xét duyệt, bạn không thể chỉnh sửa hoặc hủy yêu cầu.</li>
                          <li>• Bạn sẽ nhận được thông báo ngay khi lệnh được xử lý thành công.</li>
                          <li>• Nếu phát sinh sự cố, đội ngũ JBS sẽ liên hệ trực tiếp qua email hoặc số điện thoại đã đăng ký.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Đánh dấu đã đọc"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Xóa thông báo"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 