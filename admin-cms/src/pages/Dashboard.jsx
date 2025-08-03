import { useState, useEffect } from 'react';
import axios from 'axios';
import QuickNotifications from '../components/QuickNotifications';
import {
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [depositCount, setDepositCount] = useState(0);
  const [withdrawCount, setWithdrawCount] = useState(0);
  const BASE_URL = 'https://jbs-invest.onrender.com';
  useEffect(() => {
    fetchDashboardStats();
    fetchPendingCounts();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepositCount(response.data.filter(tx => tx.type === "deposit" && tx.status === "pending").length);
      setWithdrawCount(response.data.filter(tx => tx.type === "withdraw" && tx.status === "pending").length);
    } catch (err) {
      console.error('Error fetching pending counts:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };



  if (loading) {
    return (
      <div className="p-4 w-full bg-white rounded-lg shadow-md min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 w-full bg-white rounded-lg shadow-md min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchDashboardStats}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          {/* <p className="text-gray-600">Tổng quan hệ thống Zuna Invest</p> */}
        </div>

        {/* Quick Notifications */}
        <QuickNotifications depositCount={depositCount} withdrawCount={withdrawCount} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng thành viên</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats?.users?.total || 0)}</p>
                <p className="text-sm text-green-600 mt-1">
                  +{formatNumber(stats?.users?.newThisWeek || 0)} tuần này
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Thành viên hoạt động</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats?.users?.active || 0)}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {stats?.users?.total > 0 ? Math.round((stats.users.active / stats.users.total) * 100) : 0}% tổng số
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng giao dịch</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats?.transactions?.total || 0)}</p>
                <p className="text-sm text-purple-600 mt-1">
                  +{formatNumber(stats?.recent?.transactions || 0)} 7 ngày qua
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DocumentTextIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total Investments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đầu tư</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.amounts?.totalInvestments || 0)}</p>
                <p className="text-sm text-orange-600 mt-1">
                  {formatNumber(stats?.transactions?.byType?.investment || 0)} giao dịch
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <ChartBarIcon className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Financial Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan tài chính</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <ArrowUpIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Tổng nạp tiền</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(stats?.amounts?.totalDeposits || 0)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <ArrowDownIcon className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Tổng rút tiền</span>
                </div>
                <span className="text-lg font-bold text-red-600">
                  {formatCurrency(stats?.amounts?.totalWithdrawals || 0)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Tổng lãi</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(stats?.amounts?.totalInterest || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái giao dịch</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Chờ duyệt</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">
                  {formatNumber(stats?.transactions?.pending || 0)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Đã duyệt</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {formatNumber(stats?.transactions?.approved || 0)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Từ chối</span>
                </div>
                <span className="text-lg font-bold text-red-600">
                  {formatNumber(stats?.transactions?.rejected || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân loại giao dịch</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {formatNumber(stats?.transactions?.byType?.deposit || 0)}
              </div>
              <div className="text-sm text-gray-600">Nạp tiền</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {formatNumber(stats?.transactions?.byType?.withdraw || 0)}
              </div>
              <div className="text-sm text-gray-600">Rút tiền</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {formatNumber(stats?.transactions?.byType?.investment || 0)}
              </div>
              <div className="text-sm text-gray-600">Đầu tư</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {formatNumber(stats?.transactions?.byType?.interest || 0)}
              </div>
              <div className="text-sm text-gray-600">Lãi</div>
            </div>
          </div>
        </div>

        {/* Packages Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gói đầu tư</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {formatNumber(stats?.packages?.total || 0)}
              </div>
              <div className="text-sm text-gray-600">Tổng số gói</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {formatNumber(stats?.packages?.active || 0)}
              </div>
              <div className="text-sm text-gray-600">Gói đang hoạt động</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 