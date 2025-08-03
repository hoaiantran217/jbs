import React, { useState, useEffect } from 'react';
import { CalendarDaysIcon, ClockIcon, CurrencyDollarIcon, CheckCircleIcon, XCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CalendarDaysIcon as CalendarDaysSolid, ClockIcon as ClockSolid, CurrencyDollarIcon as CurrencyDollarSolid } from '@heroicons/react/24/solid';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const Attendance = () => {
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceDates, setAttendanceDates] = useState(new Set());
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchTodayStatus();
    fetchStats();
    fetchAttendanceDates();
    fetchUserInfo();
  }, [currentDate]);

  const fetchTodayStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/attendance/today-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodayStatus(response.data.data);
    } catch (error) {
      console.error('Lỗi lấy trạng thái điểm danh:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/attendance/stats?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Lỗi lấy thống kê:', error);
    }
  };

  const fetchAttendanceDates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/attendance/history?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Tạo Set các ngày đã điểm danh
      const dates = new Set();
      response.data.data.attendances.forEach(att => {
        const date = new Date(att.date);
        dates.add(date.toDateString());
      });
      
      setAttendanceDates(dates);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu điểm danh:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/attendance/history?limit=20`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data.data.attendances);
    } catch (error) {
      console.error('Lỗi lấy lịch sử:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserInfo(response.data.data);
    } catch (error) {
      console.error('Lỗi lấy thông tin user:', error);
    }
  };

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/attendance/checkin`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Cập nhật trạng thái và thống kê
      await fetchTodayStatus();
      await fetchStats();
      await fetchAttendanceDates();
      await fetchUserInfo();
      
      // Hiển thị thông báo thành công với thông tin chi tiết
      const { data } = response.data;
      const message = `🎉 Điểm danh thành công!\n\n💰 Số tiền nhận được: ${formatAmount(data.amount)} VNĐ\n💳 Số dư mới: ${formatAmount(data.newBalance)} VNĐ\n\n${data.isWeekend ? '🎊 Cuối tuần - Thưởng gấp đôi!' : '📅 Ngày thường'}`;
      alert(message);
    } catch (error) {
      console.error('Lỗi điểm danh:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi điểm danh');
    } finally {
      setCheckingIn(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Custom tile className cho calendar
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    
    const dateString = date.toDateString();
    const isToday = dateString === new Date().toDateString();
    const hasCheckedIn = attendanceDates.has(dateString);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isPast = date < new Date();
    
    let className = 'custom-tile';
    
    if (isToday) {
      className += ' today';
    } else if (hasCheckedIn) {
      className += ' checked-in';
    } else if (isPast) {
      className += ' past';
    } else {
      className += ' future';
    }
    
    if (isWeekend) {
      className += ' weekend';
    }
    
    return className;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center my-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Điểm Danh Hàng Ngày</h1>
          {userInfo && (
            <div className="bg-white rounded-lg p-3 shadow-md mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Số dư hiện tại:</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {formatAmount(userInfo.balance || 0)} VNĐ
                  </div>
                  <div className="text-xs text-gray-500">
                    Có thể rút: {formatAmount(userInfo.withdrawable || 0)} VNĐ
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 rounded-md transition-all text-sm ${
                activeTab === 'calendar'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              Lịch
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                fetchHistory();
              }}
              className={`px-4 py-2 rounded-md transition-all text-sm ${
                activeTab === 'history'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              Lịch Sử
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-md transition-all text-sm ${
                activeTab === 'stats'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              Thống Kê
            </button>
          </div>
        </div>

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            {/* Today Status Card */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <CalendarDaysIcon className="w-6 h-6 text-blue-500" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                       {new Date().toLocaleDateString('vi-VN')}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {todayStatus?.isWeekend ? 'Cuối tuần - Thưởng gấp đôi!' : 'Ngày thường'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    {formatAmount(todayStatus?.todayAmount || 0)} VNĐ
                  </div>
                </div>
              </div>

              {/* Check-in Button */}
              <div className="text-center">
                {todayStatus?.hasCheckedIn ? (
                  <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="font-semibold text-sm">Đã điểm danh hôm nay!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckIn}
                    disabled={checkingIn}
                    className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                      checkingIn
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105'
                    }`}
                  >
                    {checkingIn ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="text-sm">Đang điểm danh...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        <span className="text-sm">Điểm Danh Ngay</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <Calendar
                onChange={setCurrentDate}
                value={currentDate}
                tileClassName={tileClassName}
                locale="vi-VN"
                formatShortWeekday={(locale, date) => {
                  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                  return days[date.getDay()];
                }}
                className="custom-calendar"
              />

              {/* Calendar Legend */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-blue-500 bg-blue-50 rounded"></div>
                    <span>Hôm nay</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-green-500 bg-green-50 rounded"></div>
                    <span>Đã điểm danh</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-gray-200 bg-gray-50 rounded"></div>
                    <span>Đã qua</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Lịch Sử Điểm Danh</h2>
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarDaysIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Chưa có lịch sử điểm danh</p>
                </div>
              ) : (
                history.map((attendance, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        attendance.isWeekend ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <CalendarDaysIcon className={`w-4 h-4 ${
                          attendance.isWeekend ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {formatDate(attendance.date)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {attendance.isWeekend ? 'Cuối tuần' : 'Ngày thường'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">
                        +{formatAmount(attendance.amount)} VNĐ
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Thống Kê Tháng Này</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats?.totalDays || 0}</div>
                  <div className="text-xs text-gray-600">Ngày điểm danh</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats?.weekendCount || 0}</div>
                  <div className="text-xs text-gray-600">Ngày cuối tuần</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats?.weekdayCount || 0}</div>
                  <div className="text-xs text-gray-600">Ngày thường</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatAmount(stats?.totalAmount || 0)}
                  </div>
                  <div className="text-xs text-gray-600">Tổng thưởng</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Thông Tin Bổ Sung</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">Trung bình mỗi ngày:</span>
                  <span className="font-semibold text-blue-600 text-sm">
                    {formatAmount(stats?.averagePerDay || 0)} VNĐ
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Tỷ lệ điểm danh:</span>
                  <span className="font-semibold text-green-600 text-sm">
                    {stats?.totalDays ? Math.round((stats.totalDays / new Date().getDate()) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for Calendar */}
      <style jsx>{`
        .custom-calendar {
          width: 100% !important;
          border: none !important;
          font-family: inherit !important;
        }
        
        .custom-calendar .react-calendar__navigation {
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 8px;
        }
        
        .custom-calendar .react-calendar__navigation button {
          background: none;
          border: none;
          padding: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
        }
        
        .custom-calendar .react-calendar__navigation button:hover {
          background: #e5e7eb;
          border-radius: 4px;
        }
        
        .custom-calendar .react-calendar__month-view__weekdays {
          background: #f9fafb;
          border-radius: 4px;
          margin-bottom: 4px;
        }
        
        .custom-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 2px 0px;
          font-size: 11px;
          font-weight: 600;
          
        }
        
        .custom-calendar .react-calendar__month-view__days {
          gap: 1px;
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
        }
        
        .custom-calendar .react-calendar__tile {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 2px 0px;
          font-size: 11px;
          font-weight: 500;
          color: #374151;
          transition: all 0.2s;
          position: relative;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .custom-calendar .react-calendar__tile:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        
        .custom-calendar .react-calendar__tile.today {
          border-color: #3b82f6;
          background: #dbeafe;
          color: #1e40af;
          font-weight: 600;
        }
        
        .custom-calendar .react-calendar__tile.checked-in {
          border-color: #10b981;
          background: #d1fae5;
          color: #065f46;
          font-weight: 600;
        }
        
        .custom-calendar .react-calendar__tile.checked-in::after {
          content: "✓";
          position: absolute;
          top: 2px;
          right: 4px;
          font-size: 10px;
          color: #10b981;
          font-weight: bold;
        }
        
        .custom-calendar .react-calendar__tile.past {
          border-color: #d1d5db;
          background: #f9fafb;
          color: #9ca3af;
        }
        
        .custom-calendar .react-calendar__tile.future {
          border-color: #e5e7eb;
          background: white;
          color: #374151;
        }
        
        .custom-calendar .react-calendar__tile.weekend {
          color: #dc2626;
        }
        
        .custom-calendar .react-calendar__tile.weekend.checked-in {
          color: #065f46;
        }
        
        .custom-calendar .react-calendar__tile.weekend.today {
          color: #1e40af;
        }
        
        .custom-calendar .react-calendar__tile.today::after {
          content: "•";
          position: absolute;
          bottom: 2px;
          right: 4px;
          font-size: 12px;
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default Attendance;