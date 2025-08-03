import React from 'react';
import { XMarkIcon, CheckCircleIcon, ClockIcon, BanknotesIcon, UserIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const TransactionNotificationModal = ({ isOpen, onClose, notification }) => {
  if (!isOpen || !notification) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <BanknotesIcon className="w-6 h-6" />;
      case 'withdraw':
        return <BanknotesIcon className="w-6 h-6" />;
      case 'identity_verification':
        return <IdentificationIcon className="w-6 h-6" />;
      default:
        return <BanknotesIcon className="w-6 h-6" />;
    }
  };

  const getHeaderColor = (type, status) => {
    // Nếu có status pending, hiện màu vàng
    if (status === 'pending') {
      return 'from-yellow-500 to-yellow-600';
    }
    
    switch (type) {
      case 'deposit':
        return 'from-green-500 to-green-600';
      case 'withdraw':
        return 'from-blue-500 to-blue-600';
      case 'identity_verification':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getProcessingTime = (type) => {
    switch (type) {
      case 'deposit':
        return 'Từ 10 đến 120 phút';
      case 'withdraw':
        return 'Từ 10 đến 120 phút';
      case 'identity_verification':
        return 'Từ 30 đến 120 phút';
      default:
        return 'Từ 10 đến 120 phút';
    }
  };

  const renderBankInfo = () => {
    if (notification.type === 'withdraw' && notification.bankInfo) {
      return (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <UserIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 font-medium">Tài khoản nhận:</span>
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            <div><span className="font-medium">Ngân hàng:</span> {notification.bankInfo?.bankName}</div>
            <div><span className="font-medium">Số tài khoản:</span> {notification.bankInfo?.accountNumber}</div>
            <div><span className="font-medium">Người thụ hưởng:</span> {notification.bankInfo?.accountName}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderIdentityInfo = () => {
    if (notification.type === 'identity_verification' && notification.identityInfo) {
      return (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <IdentificationIcon className="w-4 h-4 text-purple-500" />
            <span className="text-purple-800 font-medium">Thông tin xác minh:</span>
          </div>
          <div className="text-sm text-purple-700 space-y-1">
            <div><span className="font-medium">Loại giấy tờ:</span> {notification.identityInfo?.documentType}</div>
            <div><span className="font-medium">Họ tên:</span> {notification.identityInfo?.fullName}</div>
            <div><span className="font-medium">Số giấy tờ:</span> {notification.identityInfo?.documentNumber}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl overflow-y-auto mb-4 shadow-2xl w-full max-w-md mx-auto max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getHeaderColor(notification.type, notification.status)} p-6 text-white relative flex-shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-xl font-bold">{notification.title}</h2>
              <p className="text-white text-sm mt-1">Cảm ơn bạn đã sử dụng dịch vụ của JBS</p>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm leading-relaxed">
              {notification.status === 'pending' ? notification.content : 
               notification.type === 'deposit' ? 'Yêu cầu nạp tiền của bạn đã được ghi nhận và đang trong quá trình xét duyệt.' :
               notification.type === 'withdraw' ? 'Yêu cầu rút tiền của bạn đã được ghi nhận và đang trong quá trình xét duyệt.' :
               notification.type === 'identity_verification' ? 'Thông tin xác minh của bạn đã được ghi nhận và đang trong quá trình xét duyệt.' :
               'Giao dịch của bạn đã được ghi nhận và đang trong quá trình xét duyệt.'}
            </p>
          </div>

          {/* Processing Time */}
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <ClockIcon className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">Thời gian xử lý dự kiến</p>
              <p className="text-sm text-yellow-700">{getProcessingTime(notification.type)}</p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Mã giao dịch:</span>
              <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                {notification.transactionCode}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Thời gian yêu cầu:</span>
              <span className="text-sm text-gray-700">
                {new Date(notification.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>

            {notification.type !== 'identity_verification' && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">
                  {notification.type === 'deposit' ? 'Số tiền nạp:' : 'Số tiền rút:'}
                </span>
                <span className="font-bold text-green-600">
                  {notification.amount?.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            )}

            {/* Bank Info for Withdraw */}
            {renderBankInfo()}

            {/* Identity Info for Verification */}
            {renderIdentityInfo()}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4">
            <div className="text-center text-gray-400 text-xs py-2">⸻</div>
          </div>

          {/* Notes */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-800 mb-2">Lưu ý:</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Trong thời gian xét duyệt, bạn không thể chỉnh sửa hoặc hủy yêu cầu.</li>
              <li>• Bạn sẽ nhận được thông báo ngay khi lệnh được xử lý thành công.</li>
              <li>• Nếu phát sinh sự cố, đội ngũ JBS sẽ liên hệ trực tiếp qua email hoặc số điện thoại đã đăng ký.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <CheckCircleIcon className="w-5 h-5" />
            <span>Đã hiểu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionNotificationModal; 