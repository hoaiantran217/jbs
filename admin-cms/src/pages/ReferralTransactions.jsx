import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";

function Toast({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`}>
      {message}
      <button onClick={onClose} className="ml-2 font-bold">×</button>
    </div>
  );
}

export default function ReferralTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, id: null, status: null, reason: "" });
  const [actionLoading, setActionLoading] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Stats states
  const [stats, setStats] = useState({
    totalCount: 0,
    totalAmount: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0
  });
  
  const BASE_URL = 'https://jbs-invest.onrender.com';

  const fetchReferralTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString()
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (typeFilter !== 'all') {
        params.append('type', typeFilter);
      }
      
      const res = await axios.get(`${BASE_URL}/api/referral-transactions?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      setTransactions(res.data.transactions || res.data);
      setTotalItems(res.data.total || res.data.length);
      setTotalPages(Math.ceil((res.data.total || res.data.length) / itemsPerPage));
    } catch (err) {
      console.error("Lỗi khi tải danh sách giao dịch giới thiệu:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/referral-transactions/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(res.data.total);
    } catch (err) {
      console.error("Lỗi khi tải thống kê:", err);
    }
  };

  useEffect(() => {
    fetchReferralTransactions(currentPage);
    fetchStats();
  }, [currentPage, statusFilter, typeFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchReferralTransactions(1);
  };

  const handleAction = async () => {
    try {
      setActionLoading(confirm.id);
      const res = await axios.patch(
        `${BASE_URL}/api/referral-transactions/${confirm.id}/approve`,
        { 
          status: confirm.status,
          reason: confirm.reason || undefined
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      await fetchReferralTransactions(currentPage);
      await fetchStats();
      setConfirm({ open: false, id: null, status: null, reason: "" });
      setToast({ show: true, message: res.data.message, type: "success" });
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || "Lỗi khi xử lý giao dịch", type: "error" });
    } finally {
      setActionLoading("");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Chờ duyệt</span>,
      approved: <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Đã duyệt</span>,
      rejected: <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Từ chối</span>
    };
    return badges[status] || <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
  };

  const getTypeBadge = (type) => {
    const badges = {
      first_deposit: <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Nạp đầu tiên</span>,
      monthly_profit: <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Lợi nhuận tháng</span>
    };
    return badges[type] || <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{type}</span>;
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số {totalItems} giao dịch
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-8 text-center">Đang tải...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý giao dịch giới thiệu</h1>
        
        {/* Stats Cards */}
        <div className="flex gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600">Tổng giao dịch</div>
            <div className="text-xl font-bold text-blue-800">{stats.totalCount}</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-sm text-yellow-600">Chờ duyệt</div>
            <div className="text-xl font-bold text-yellow-800">{stats.pendingCount}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600">Đã duyệt</div>
            <div className="text-xl font-bold text-green-800">{stats.approvedCount}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-600">Tổng tiền</div>
            <div className="text-xl font-bold text-purple-800">{stats.totalAmount?.toLocaleString()} đ</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            handleFilterChange();
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
        
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            handleFilterChange();
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">Tất cả loại</option>
          <option value="first_deposit">Nạp đầu tiên</option>
          <option value="monthly_profit">Lợi nhuận tháng</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người giới thiệu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người được giới thiệu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số tiền thưởng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Không có giao dịch giới thiệu nào
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.referrer?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.referrer?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.referredUser?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.referredUser?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {transaction.amount?.toLocaleString()} đ
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(transaction.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {transaction.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setConfirm({ 
                            open: true, 
                            id: transaction._id, 
                            status: 'approved',
                            reason: ""
                          })}
                          disabled={actionLoading === transaction._id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          {actionLoading === transaction._id ? "Đang duyệt..." : "Duyệt"}
                        </button>
                        <button
                          onClick={() => setConfirm({ 
                            open: true, 
                            id: transaction._id, 
                            status: 'rejected',
                            reason: ""
                          })}
                          disabled={actionLoading === transaction._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {actionLoading === transaction._id ? "Đang từ chối..." : "Từ chối"}
                        </button>
                      </div>
                    )}
                    {transaction.status !== 'pending' && (
                      <div className="text-sm text-gray-500">
                        {transaction.approvedBy?.name && `Bởi: ${transaction.approvedBy.name}`}
                        {transaction.reason && (
                          <div className="text-xs text-red-500 mt-1">
                            Lý do: {transaction.reason}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        {totalPages > 1 && renderPagination()}
      </div>

      <ConfirmModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null, status: null, reason: "" })}
        onConfirm={handleAction}
        title={`${confirm.status === 'approved' ? 'Duyệt' : 'Từ chối'} giao dịch giới thiệu`}
        message={
          <div>
            <p>Bạn có chắc chắn muốn {confirm.status === 'approved' ? 'duyệt' : 'từ chối'} giao dịch giới thiệu này?</p>
            {confirm.status === 'rejected' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do từ chối (tùy chọn):
                </label>
                <textarea
                  value={confirm.reason}
                  onChange={(e) => setConfirm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows="3"
                  placeholder="Nhập lý do từ chối..."
                />
              </div>
            )}
          </div>
        }
      />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: "", type: "" })}
      />
    </div>
  );
} 