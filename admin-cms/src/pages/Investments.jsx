import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";

function Toast({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
      onClick={onClose}
    >
      {message}
    </div>
  );
}

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, id: null, status: null, action: null });
  const [actionLoading, setActionLoading] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [maturityFilter, setMaturityFilter] = useState("all");
  
  const BASE_URL = 'https://jbs-invest.onrender.com';

  const fetchInvestments = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        sort: '-createdAt' // Sắp xếp theo thứ tự mới nhất trước
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (maturityFilter !== 'all') {
        params.append('maturityStatus', maturityFilter);
      }
      
      const res = await axios.get(`${BASE_URL}/api/investments?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      setInvestments(res.data.investments || res.data);
      setTotalItems(res.data.total || res.data.length);
      setTotalPages(Math.ceil((res.data.total || res.data.length) / itemsPerPage));
    } catch (err) {
      console.error("Lỗi khi tải danh sách đầu tư:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments(currentPage);
  }, [currentPage, statusFilter, maturityFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset về trang đầu khi thay đổi filter
    fetchInvestments(1);
  };

  const handleAction = async () => {
    setActionLoading(confirm.id + confirm.action + confirm.status);
    try {
      const endpoint = confirm.action === 'maturity' ? 'maturity' : 'approve';
      const res = await axios.patch(
        `${BASE_URL}/api/investments/${confirm.id}/${endpoint}`,
        { status: confirm.status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      await fetchInvestments(currentPage);
      setConfirm({ open: false, id: null, status: null, action: null });
      setToast({ show: true, message: res.data.message, type: "success" });
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || "Lỗi khi xử lý đầu tư", type: "error" });
    } finally {
      setActionLoading("");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status] || "bg-gray-100 text-gray-800"}`}>
        {status === 'pending' ? 'Chờ duyệt' : status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
      </span>
    );
  };

  const getMaturityStatusBadge = (status) => {
    const badges = {
      pending: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status] || "bg-gray-100 text-gray-800"}`}>
        {status === 'pending' ? 'Chờ đáo hạn' : status === 'approved' ? 'Đã đáo hạn' : 'Từ chối đáo hạn'}
      </span>
    );
  };

  const calculateInterest = (investment) => {
    if (!investment.package) return 0;
    return Math.round((investment.amount * investment.package.interestRate) / 100);
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
            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số {totalItems} đầu tư
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
        <h1 className="text-2xl font-bold">Quản lý đầu tư</h1>
        
        {/* Filters */}
        <div className="flex gap-4">
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
            value={maturityFilter}
            onChange={(e) => {
              setMaturityFilter(e.target.value);
              handleFilterChange();
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Tất cả đáo hạn</option>
            <option value="pending">Chờ đáo hạn</option>
            <option value="approved">Đã đáo hạn</option>
            <option value="rejected">Từ chối đáo hạn</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gói đầu tư
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng nhận được
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đáo hạn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {investments.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  Không có giao dịch đầu tư nào
                </td>
              </tr>
            ) : (
              investments.map((investment) => (
                <tr key={investment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {investment.user?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {investment.user?.email || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {investment.package?.name || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {investment.amount?.toLocaleString()} đ
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {(investment.amount + calculateInterest(investment)).toLocaleString()} đ
                    </div>
                    <div className="text-xs text-gray-500">
                      (Gốc: {investment.amount?.toLocaleString()} + Lãi: {calculateInterest(investment).toLocaleString()})
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(investment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getMaturityStatusBadge(investment.maturityStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(investment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col gap-1">
                      {/* Duyệt đầu tư */}
                      {investment.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirm({ open: true, id: investment._id, status: 'approved', action: 'approve' })}
                            disabled={actionLoading === investment._id + 'approveapproved'}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 text-xs"
                          >
                            {actionLoading === investment._id + 'approveapproved' ? 'Đang xử lý...' : 'Duyệt đầu tư'}
                          </button>
                          <button
                            onClick={() => setConfirm({ open: true, id: investment._id, status: 'rejected', action: 'approve' })}
                            disabled={actionLoading === investment._id + 'approverejected'}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 text-xs"
                          >
                            {actionLoading === investment._id + 'approverejected' ? 'Đang xử lý...' : 'Từ chối'}
                          </button>
                        </div>
                      )}
                      
                      {/* Duyệt đáo hạn */}
                      {investment.status === 'approved' && investment.maturityStatus === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirm({ open: true, id: investment._id, status: 'approved', action: 'maturity' })}
                            disabled={actionLoading === investment._id + 'maturityapproved'}
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50 text-xs"
                          >
                            {actionLoading === investment._id + 'maturityapproved' ? 'Đang xử lý...' : 'Duyệt đáo hạn'}
                          </button>
                          <button
                            onClick={() => setConfirm({ open: true, id: investment._id, status: 'rejected', action: 'maturity' })}
                            disabled={actionLoading === investment._id + 'maturityrejected'}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 text-xs"
                          >
                            {actionLoading === investment._id + 'maturityrejected' ? 'Đang xử lý...' : 'Từ chối đáo hạn'}
                          </button>
                        </div>
                      )}
                    </div>
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
        onClose={() => setConfirm({ open: false, id: null, status: null, action: null })}
        onConfirm={handleAction}
        title={`${confirm.status === 'approved' ? 'Duyệt' : 'Từ chối'} ${confirm.action === 'maturity' ? 'đáo hạn' : 'đầu tư'}`}
        message={`Bạn có chắc chắn muốn ${confirm.status === 'approved' ? 'duyệt' : 'từ chối'} ${confirm.action === 'maturity' ? 'đáo hạn và cộng tiền gốc + lãi' : 'yêu cầu đầu tư'} này?`}
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