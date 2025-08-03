import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickNotifications({ depositCount = 0, withdrawCount = 0 }) {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: 'Yêu cầu nạp tiền',
      count: depositCount,
      color: 'blue',
      path: '/deposits',
      icon: '💵'
    },
    {
      id: 2,
      title: 'Yêu cầu rút tiền',
      count: withdrawCount,
      color: 'green',
      path: '/withdrawals',
      icon: '🏦'
    },
    {
      id: 3,
      title: 'Xác minh danh tính',
      count: 0,
      color: 'purple',
      path: '/identity-verifications',
      icon: '🆔'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      red: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông báo nhanh</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notifications.map((notification) => (
          <button
            key={notification.id}
            onClick={() => navigate(notification.path)}
            className={`p-4 rounded-lg border transition-all duration-200 ${getColorClasses(notification.color)} ${
              notification.count > 0 ? 'ring-2 ring-offset-2 ring-red-200' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{notification.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm opacity-75">
                    {notification.count > 0 ? `${notification.count} yêu cầu chờ` : 'Không có yêu cầu'}
                  </div>
                </div>
              </div>
              {notification.count > 0 && (
                <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {notification.count}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 