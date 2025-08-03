import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";
import TransactionDetailModal from "../components/TransactionDetailModal";

export default function Deposits({ onUserBalanceChange }) {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null, status: null });
  const [detail, setDetail] = useState({ open: false, transaction: null });
  const [activeTab, setActiveTab] = useState("all");
  
  // Bank info states
  const [bankInfo, setBankInfo] = useState([]);
  const [showBankInfo, setShowBankInfo] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  const BASE_URL = 'https://jbs-invest.onrender.com';
  
  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Lọc chỉ lấy deposits và sắp xếp theo createdAt mới nhất trước
      const depositData = res.data
        .filter(tx => tx.type === "deposit")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setDeposits(depositData);
    } catch (err) {
      setError("Không thể tải danh sách nạp tiền");
    } finally {
      setLoading(false);
    }
  };

  const fetchBankInfo = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/bank-info`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBankInfo(res.data);
    } catch (err) {
      console.error("Không thể tải thông tin ngân hàng:", err);
    }
  };

  useEffect(() => {
    fetchDeposits();
    fetchBankInfo();
  }, []);

  // Reset currentPage khi activeTab thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleApprove = async () => {
    setActionLoading(confirm.id + confirm.status);
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/transactions/${confirm.id}/approve`,
        { status: confirm.status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      await fetchDeposits();
      setConfirm({ open: false, id: null, status: null });
      // Nếu duyệt thành công và có callback, cập nhật số dư user
      if (onUserBalanceChange && res.data && res.data.user) {
        onUserBalanceChange(res.data.user._id, res.data.user.balance);
      }
    } catch (err) {
      alert("Lỗi khi duyệt giao dịch");
    } finally {
      setActionLoading("");
    }
  };

  // Lọc deposits theo tab
  const filteredDeposits = deposits.filter(tx => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return tx.status === "pending";
    if (activeTab === "approved") return tx.status === "approved";
    if (activeTab === "rejected") return tx.status === "rejected";
    return true;
  });

  // Pagination logic
  const paginatedDeposits = filteredDeposits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Tính tổng số trang
  const totalItems = filteredDeposits.length;
  const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);

  // Cập nhật totalPages khi filteredDeposits thay đổi
  useEffect(() => {
    setTotalPages(calculatedTotalPages);
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredDeposits, calculatedTotalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Copy bank info functions
  const copyBankInfo = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Đã sao chép thông tin ngân hàng!');
    } catch (err) {
      console.error('Lỗi khi sao chép:', err);
    }
  };

  const copyFullBankInfo = (bank) => {
    const info = `Ngân hàng: ${bank.bankName}\nSố tài khoản: ${bank.accountNumber}\nChủ tài khoản: ${bank.accountHolder}`;
    copyBankInfo(info);
  };

  // Helper functions
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Statistics
  const stats = {
    total: deposits.length,
    pending: deposits.filter(tx => tx.status === 'pending').length,
    approved: deposits.filter(tx => tx.status === 'approved').length,
    rejected: deposits.filter(tx => tx.status === 'rejected').length
  };

  return (
    <div className="p-4 w-full bg-white rounded-lg shadow-md min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý nạp tiền</h1>
        <button
          onClick={() => setShowBankInfo(!showBankInfo)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showBankInfo ? 'Ẩn' : 'Hiển thị'} Thông tin ngân hàng
        </button>
      </div>
      
      {/* Bank Info Section */}
      {showBankInfo && bankInfo.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Thông tin ngân hàng nhận tiền</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bankInfo.map((bank) => (
              <div key={bank._id} className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-blue-600">{bank.bankName}</h3>
                  <button
                    onClick={() => copyFullBankInfo(bank)}
                    className="text-blue-500 hover:text-blue-700 text-sm underline"
                  >
                    Copy tất cả
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{bank.accountNumber}</span>
                      <button
                        onClick={() => copyBankInfo(bank.accountNumber)}
                        className="text-blue-500 hover:text-blue-700 text-xs"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chủ tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <span>{bank.accountHolder}</span>
                      <button
                        onClick={() => copyBankInfo(bank.accountHolder)}
                        className="text-blue-500 hover:text-blue-700 text-xs"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  {bank.description && (
                    <div className="text-gray-600 text-xs mt-2">
                      {bank.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-600">Tổng cộng</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-yellow-600">Chờ duyệt</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-green-600">Đã duyệt</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-red-600">Từ chối</div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "pending"
              ? "bg-white text-yellow-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Chờ duyệt
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "approved"
              ? "bg-white text-green-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Đã duyệt
        </button>
        <button
          onClick={() => setActiveTab("rejected")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "rejected"
              ? "bg-white text-red-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Từ chối
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Người dùng</th>
                  <th className="border px-4 py-2">Số tiền</th>
                  <th className="border px-4 py-2">Trạng thái</th>
                  <th className="border px-4 py-2">Proof</th>
                  <th className="border px-4 py-2">Ngân hàng</th>
                  <th className="border px-4 py-2">Ngày tạo</th>
                  <th className="border px-4 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDeposits.map((tx) => (
                  <tr key={tx._id}>
                    <td className="border px-4 py-2">{tx.user?.name || tx.user?.email || 'N/A'}</td>
                    <td className="border px-4 py-2">{tx.amount?.toLocaleString()} đ</td>
                    <td className="border px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(tx.status)}`}>
                        {getStatusLabel(tx.status)}
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      {tx.proofImage ? (
                        <button
                          onClick={() => setDetail({ open: true, transaction: tx })}
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          Xem proof
                        </button>
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
                      ) : (
                        <span className="text-gray-400 text-sm">Không có</span>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(tx.createdAt).toLocaleDateString('vi-VN')} {new Date(tx.createdAt).toLocaleTimeString('vi-VN')}
                    </td>
                    <td className="border px-4 py-2">
                      {tx.status === 'pending' && (
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số {totalItems} giao dịch
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm border rounded ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}
      
      <ConfirmModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null, status: null })}
        onConfirm={handleApprove}
        message={`Bạn chắc chắn muốn ${confirm.status === "approved" ? "duyệt" : "từ chối"} giao dịch nạp tiền này?`}
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