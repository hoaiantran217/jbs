import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";
import TransactionDetailModal from "../components/TransactionDetailModal";

const typeOptions = [
  { value: "", label: "Tất cả loại" },
  { value: "deposit", label: "Nạp tiền" },
  { value: "withdraw", label: "Rút tiền" },
  { value: "investment", label: "Đầu tư" },
  { value: "interest", label: "Lãi" },
  { value: "attendance", label: "Điểm danh" },
];
const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null, status: null });
  const [detail, setDetail] = useState({ open: false, transaction: null });
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const BASE_URL = 'https://jbs-invest.onrender.com';

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Sắp xếp theo thứ tự mới nhất lên đầu
      const sortedTransactions = res.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTransactions(sortedTransactions);
      setTotalPages(Math.ceil(sortedTransactions.length / itemsPerPage));
    } catch (err) {
      setError("Không thể tải danh sách giao dịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleApprove = async () => {
    setActionLoading(confirm.id + confirm.status);
    try {
      await axios.patch(
        `${BASE_URL}/api/transactions/${confirm.id}/approve`,
        { status: confirm.status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      await fetchTransactions();
      setConfirm({ open: false, id: null, status: null });
    } catch (err) {
      alert("Lỗi khi duyệt giao dịch");
    } finally {
      setActionLoading("");
    }
  };

  const filtered = transactions.filter(
    (tx) =>
      (activeTab === "all" || tx.type === activeTab) &&
      (!statusFilter || tx.status === statusFilter) &&
      (!typeFilter || tx.type === typeFilter)
  );

  // Tính toán phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filtered.slice(startIndex, endIndex);

  // Thống kê số lượng giao dịch cho mỗi loại
  const getTransactionCount = (type) => {
    if (type === "all") {
      return transactions.length;
    }
    return transactions.filter(tx => tx.type === type).length;
  };

  // Hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm format loại giao dịch
  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'deposit': return 'Nạp tiền';
      case 'withdraw': return 'Rút tiền';
      case 'investment': return 'Đầu tư';
      case 'interest': return 'Lãi';
      case 'attendance': return 'Điểm danh';
      default: return type;
    }
  };

  // Hàm format trạng thái
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  // Hàm lấy màu cho loại giao dịch
  const getTypeColor = (type) => {
    switch (type) {
      case 'deposit': return 'bg-blue-100 text-blue-800';
      case 'withdraw': return 'bg-red-100 text-red-800';
      case 'investment': return 'bg-green-100 text-green-800';
      case 'interest': return 'bg-purple-100 text-purple-800';
      case 'attendance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 w-full bg-white rounded-lg shadow-md min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Quản lý giao dịch</h1>
      
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 text-sm font-medium">Tổng giao dịch</div>
          <div className="text-2xl font-bold text-blue-800">{transactions.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 text-sm font-medium">Đã duyệt</div>
          <div className="text-2xl font-bold text-green-800">
            {transactions.filter(tx => tx.status === 'approved').length}
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-yellow-600 text-sm font-medium">Chờ duyệt</div>
          <div className="text-2xl font-bold text-yellow-800">
            {transactions.filter(tx => tx.status === 'pending').length}
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-orange-600 text-sm font-medium">Điểm danh</div>
          <div className="text-2xl font-bold text-orange-800">
            {transactions.filter(tx => tx.type === 'attendance').length}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Tất cả ({getTransactionCount("all")})
          </button>
          <button
            onClick={() => setActiveTab("deposit")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "deposit"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Nạp tiền ({getTransactionCount("deposit")})
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "withdraw"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Rút tiền ({getTransactionCount("withdraw")})
          </button>
          <button
            onClick={() => setActiveTab("investment")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "investment"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Đầu tư ({getTransactionCount("investment")})
          </button>
          <button
            onClick={() => setActiveTab("interest")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "interest"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Lãi ({getTransactionCount("interest")})
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "attendance"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Điểm danh ({getTransactionCount("attendance")})
          </button>
        </div>
        
        {/* Status Filter */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Loại:</label>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => {
              setStatusFilter("");
              setTypeFilter("");
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {paginatedTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {activeTab === "all" 
                ? "Không có giao dịch nào" 
                : `Không có giao dịch ${activeTab === "deposit" ? "nạp tiền" : 
                   activeTab === "withdraw" ? "rút tiền" : 
                   activeTab === "investment" ? "đầu tư" : 
                   activeTab === "interest" ? "lãi" : "điểm danh"} nào`
              }
            </div>
          ) : (
            <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Người dùng</th>
              <th className="border px-4 py-2">Loại</th>
              <th className="border px-4 py-2">Số tiền</th>
              <th className="border px-4 py-2">Trạng thái</th>
              <th className="border px-4 py-2">Ghi chú</th>
              <th className="border px-4 py-2">Proof</th>
              <th className="border px-4 py-2">Ngân hàng</th>
              <th className="border px-4 py-2">Ngày tạo</th>
              <th className="border px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((tx) => (
              <tr key={tx._id}>
                <td className="border px-4 py-2">{tx.user?.name || tx.user?.email || 'N/A'}</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    getTypeColor(tx.type)
                  }`}>
                    {getTransactionTypeLabel(tx.type)}
                  </span>
                </td>
                <td className="border px-4 py-2">{tx.amount?.toLocaleString()} đ</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    getStatusColor(tx.status)
                  }`}>
                    {getStatusLabel(tx.status)}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  <div className="text-sm text-gray-600 max-w-xs truncate" title={tx.note}>
                    {tx.note || '-'}
                  </div>
                </td>
                <td className="border px-4 py-2">
                  {tx.proofImage ? (
                    <button
                      onClick={() => setDetail({ open: true, transaction: tx })}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Xem proof
                    </button>
                  ) : tx.type === 'attendance' ? (
                    <span className="text-green-600 text-sm">Tự động</span>
                  ) : (
                    <span className="text-gray-400 text-sm">Chưa có</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  {tx.bankInfo ? (
                    <div className="text-sm">
                      <div className="font-medium">{tx.bankInfo.bankName || 'N/A'}</div>
                      <div className="text-gray-600">{tx.bankInfo.accountNumber || 'N/A'}</div>
                    </div>
                  ) : tx.type === 'attendance' ? (
                    <span className="text-green-600 text-sm">Tự động</span>
                  ) : (
                    <span className="text-gray-400 text-sm">Không có</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <div className="text-sm">
                    <div>{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</div>
                    <div className="text-gray-500 text-xs">
                      {new Date(tx.createdAt).toLocaleTimeString('vi-VN')}
                    </div>
                  </div>
                </td>
                <td className="border px-4 py-2">
                  {tx.status === 'pending' && tx.type !== 'attendance' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirm({ open: true, id: tx._id, status: 'approved' })}
                        disabled={actionLoading === tx._id + 'approved'}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 disabled:opacity-50"
                      >
                        {actionLoading === tx._id + 'approved' ? 'Đang xử lý...' : 'Duyệt'}
                      </button>
                      <button
                        onClick={() => setConfirm({ open: true, id: tx._id, status: 'rejected' })}
                        disabled={actionLoading === tx._id + 'rejected'}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                      >
                        {actionLoading === tx._id + 'rejected' ? 'Đang xử lý...' : 'Từ chối'}
                      </button>
                    </div>
                  )}
                  {tx.type === 'attendance' && (
                    <span className="text-green-600 text-sm font-medium">Tự động duyệt</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          )}
          
          {/* Phân trang */}
          {filtered.length > itemsPerPage && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
          
          {/* Thông tin phân trang */}
          {filtered.length > 0 && (
            <div className="text-center text-sm text-gray-500 mt-4">
              Hiển thị {startIndex + 1}-{Math.min(endIndex, filtered.length)} trong tổng số {filtered.length} giao dịch
            </div>
          )}
        </>
      )}
      <ConfirmModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null, status: null })}
        onConfirm={handleApprove}
        message={`Bạn chắc chắn muốn ${confirm.status === "approved" ? "duyệt" : "từ chối"} giao dịch này?`}
        confirmText={confirm.status === "approved" ? "Duyệt" : "Từ chối"}
      />
      <TransactionDetailModal
        open={detail.open}
        onClose={() => setDetail({ open: false, transaction: null })}
        transaction={detail.transaction}
      />
    </div>
  );
} 