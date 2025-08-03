import React from 'react';
import { XMarkIcon, CheckCircleIcon, ClockIcon, BanknotesIcon, UserIcon } from '@heroicons/react/24/outline';

const WithdrawalNotificationModal = ({ isOpen, onClose, notification }) => {
  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <BanknotesIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">💸 Yêu cầu rút tiền đã được tiếp nhận</h2>
              <p className="text-green-100 text-sm mt-1">Cảm ơn bạn đã sử dụng dịch vụ của JBS</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm leading-relaxed">
              Yêu cầu rút tiền của bạn đã được ghi nhận và đang trong quá trình xét duyệt.
            </p>
          </div>

          {/* Processing Time */}
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <ClockIcon className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">Thời gian xử lý dự kiến</p>
              <p className="text-sm text-yellow-700">Từ 10 đến 120 phút</p>
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

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Số tiền rút:</span>
              <span className="font-bold text-green-600">
                {notification.amount?.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>

            {/* Bank Info */}
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
              <li>• Bạn sẽ nhận được thông báo ngay khi lệnh rút được xử lý thành công.</li>
              <li>• Nếu phát sinh sự cố, đội ngũ JBS sẽ liên hệ trực tiếp qua email hoặc số điện thoại đã đăng ký.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4">
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

export default WithdrawalNotificationModal; 