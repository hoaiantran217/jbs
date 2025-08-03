import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";
import UserFormModal from "../components/UserFormModal";
import TransactionDetailModal from "../components/TransactionDetailModal";

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

function UserTransactionsModal({ open, onClose, user }) {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = 'https://jbs-invest.onrender.com';
  
  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    Promise.all([
      axios.get(`${BASE_URL}/api/transactions/user/${user._id}?type=deposit`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      axios.get(`${BASE_URL}/api/transactions/user/${user._id}?type=withdraw`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
    ]).then(([dep, wit]) => {
      setDeposits(dep.data);
      setWithdrawals(wit.data);
    }).finally(() => setLoading(false));
  }, [open, user]);
  
  if (!open || !user) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[400px] max-w-[90vw] max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Lịch sử giao dịch của {user.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Thống kê nhanh */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 text-sm font-medium">Tổng nạp tiền</div>
                <div className="text-xl font-bold text-green-800">
                  {deposits.reduce((sum, tx) => sum + (tx.amount || 0), 0).toLocaleString()} đ
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-red-600 text-sm font-medium">Tổng rút tiền</div>
                <div className="text-xl font-bold text-red-800">
                  {withdrawals.reduce((sum, tx) => sum + (tx.amount || 0), 0).toLocaleString()} đ
                </div>
              </div>
            </div>
            
            {/* Lịch sử nạp tiền */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-700">Lịch sử nạp tiền</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border px-3 py-2 text-left text-sm font-medium text-gray-700">Số tiền</th>
                      <th className="border px-3 py-2 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                      <th className="border px-3 py-2 text-left text-sm font-medium text-gray-700">Ngày</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deposits.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="border px-3 py-2 text-center text-gray-500">
                          Chưa có giao dịch nạp tiền
                        </td>
                      </tr>
                    ) : (
                      deposits.map(tx => (
                        <tr key={tx._id} className="hover:bg-gray-50">
                          <td className="border px-3 py-2 text-green-600 font-medium">
                            {tx.amount?.toLocaleString()} đ
                          </td>
                          <td className="border px-3 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              tx.status === 'approved' ? 'bg-green-100 text-green-800' :
                              tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {tx.status === 'approved' ? 'Đã duyệt' :
                               tx.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                            </span>
                          </td>
                          <td className="border px-3 py-2 text-sm text-gray-600">
                            {new Date(tx.createdAt).toLocaleString('vi-VN')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Lịch sử rút tiền */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-700">Lịch sử rút tiền</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border px-3 py-2 text-left text-sm font-medium text-gray-700">Số tiền</th>
                      <th className="border px-3 py-2 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                      <th className="border px-3 py-2 text-left text-sm font-medium text-gray-700">Ngày</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="border px-3 py-2 text-center text-gray-500">
                          Chưa có giao dịch rút tiền
                        </td>
                      </tr>
                    ) : (
                      withdrawals.map(tx => (
                        <tr key={tx._id} className="hover:bg-gray-50">
                          <td className="border px-3 py-2 text-red-600 font-medium">
                            {tx.amount?.toLocaleString()} đ
                          </td>
                          <td className="border px-3 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              tx.status === 'approved' ? 'bg-green-100 text-green-800' :
                              tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {tx.status === 'approved' ? 'Đã duyệt' :
                               tx.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                            </span>
                          </td>
                          <td className="border px-3 py-2 text-sm text-gray-600">
                            {new Date(tx.createdAt).toLocaleString('vi-VN')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <button 
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formModal, setFormModal] = useState({ open: false, initialData: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [actionLoading, setActionLoading] = useState("");
  const [lockConfirm, setLockConfirm] = useState({ open: false, id: null, isActive: true });
  const [txModal, setTxModal] = useState({ open: false, user: null });
  const [roleTab, setRoleTab] = useState('user');
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 2500);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Sắp xếp theo thứ tự mới nhất lên đầu
      const sortedUsers = res.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setUsers(sortedUsers);
      setTotalPages(Math.ceil(sortedUsers.length / itemsPerPage));
    } catch (err) {
      setError("Không thể tải danh sách user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset currentPage khi thay đổi filter
  useEffect(() => {
    setCurrentPage(1);
  }, [roleTab, search, statusFilter]);

  const handleCreate = async (data) => {
    setActionLoading("create");
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchUsers();
      setFormModal({ open: false, initialData: null });
      showToast("Tạo user thành công!", "success");
    } catch (err) {
      showToast("Lỗi khi tạo user", "error");
    } finally {
      setActionLoading("");
    }
  };

  const handleEdit = async (data) => {
    setActionLoading("edit" + data._id);
    try {
      await axios.put(`${BASE_URL}/api/user/${data._id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchUsers();
      setFormModal({ open: false, initialData: null });
      showToast("Cập nhật user thành công!", "success");
    } catch (err) {
      showToast("Lỗi khi sửa user", "error");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async () => {
    setActionLoading("delete" + confirm.id);
    try {
      await axios.delete(`${BASE_URL}/api/user/admin/${confirm.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchUsers();
      setConfirm({ open: false, id: null });
      showToast("Đã xóa user!", "success");
    } catch (err) {
      showToast("Lỗi khi xóa user", "error");
    } finally {
      setActionLoading("");
    }
  };

  const handleLockToggle = async () => {
    setActionLoading("lock" + lockConfirm.id);
    try {
      await axios.patch(
          `${BASE_URL}/api/user/admin/${lockConfirm.id}/status`,
        { isActive: lockConfirm.isActive },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      await fetchUsers();
      setLockConfirm({ open: false, id: null, isActive: true });
      showToast("Cập nhật trạng thái user thành công!", "success");
    } catch (err) {
      showToast("Lỗi khi cập nhật trạng thái user", "error");
    } finally {
      setActionLoading("");
    }
  };

  // Hàm cập nhật realtime số dư user
  const handleUserBalanceChange = (userId, newBalance) => {
    setUsers(users => users.map(u => u._id === userId ? { ...u, balance: newBalance } : u));
  };

  // Hàm sắp xếp users
  const sortUsers = (users) => {
    return users.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'balance':
          aValue = a.balance || 0;
          bValue = b.balance || 0;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const filteredUsers = sortUsers(
    users
      .filter(u => u.role === roleTab)
      .filter(u =>
        (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === "all" || (statusFilter === "active" ? u.isActive : !u.isActive))
      )
  );

  // Tính toán phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm format trạng thái
  const getStatusLabel = (isActive) => {
    return isActive ? "Đang hoạt động" : "Đã khóa";
  };

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  // Hàm format vai trò
  const getRoleLabel = (role) => {
    return role === 'admin' ? 'Quản trị viên' : 'Người dùng';
  };

  // Hàm lấy màu cho vai trò
  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  // Hàm format ngày
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Hàm xử lý bulk actions
  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) return;
    
    setActionLoading("bulk");
    try {
      const promises = selectedUsers.map(userId => {
        if (bulkAction === 'lock') {
          return axios.patch(`${BASE_URL}/api/user/${userId}/active`, 
            { isActive: false },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
        } else if (bulkAction === 'unlock') {
          return axios.patch(`${BASE_URL}/api/user/${userId}/active`, 
            { isActive: true },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
        } else if (bulkAction === 'delete') {
          return axios.delete(`${BASE_URL}/api/user/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
        }
      });
      
      await Promise.all(promises);
      await fetchUsers();
      setSelectedUsers([]);
      setBulkAction('');
      showToast(`Đã ${bulkAction === 'lock' ? 'khóa' : bulkAction === 'unlock' ? 'mở khóa' : 'xóa'} ${selectedUsers.length} thành viên!`, "success");
    } catch (err) {
      showToast("Lỗi khi thực hiện hành động hàng loạt", "error");
    } finally {
      setActionLoading("");
    }
  };

  // Hàm toggle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(paginatedUsers.map(u => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Hàm toggle select user
  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: toast.type })} />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý thành viên</h1>
        <p className="text-gray-600">Quản lý tất cả thành viên trong hệ thống</p>
      </div>
      
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-600">Tổng thành viên</div>
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              <div className="text-xs text-gray-500">
                {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} mới tuần này
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-600">Đang hoạt động</div>
              <div className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.isActive).length}
              </div>
              <div className="text-xs text-gray-500">
                {((users.filter(u => u.isActive).length / users.length) * 100).toFixed(1)}% tổng số
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-600">Đã khóa</div>
              <div className="text-2xl font-bold text-gray-900">
                {users.filter(u => !u.isActive).length}
              </div>
              <div className="text-xs text-gray-500">
                {((users.filter(u => !u.isActive).length / users.length) * 100).toFixed(1)}% tổng số
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-600">Quản trị viên</div>
              <div className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-xs text-gray-500">
                {((users.filter(u => u.role === 'admin').length / users.length) * 100).toFixed(1)}% tổng số
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              onClick={() => setFormModal({ open: true, initialData: null })}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tạo mới
            </button>
            
            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <span className="text-sm text-yellow-800">
                  Đã chọn {selectedUsers.length} thành viên
                </span>
                <select 
                  className="border border-gray-300 px-3 py-1 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                >
                  <option value="">Chọn hành động...</option>
                  <option value="lock">Khóa tài khoản</option>
                  <option value="unlock">Mở khóa tài khoản</option>
                  <option value="delete">Xóa tài khoản</option>
                </select>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                  onClick={handleBulkAction}
                  disabled={!bulkAction || actionLoading === "bulk"}
                >
                  {actionLoading === "bulk" ? "Đang xử lý..." : "Thực hiện"}
                </button>
                <button
                  className="text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedUsers([])}
                >
                  Hủy chọn
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setRoleTab('user')} 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  roleTab === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Người dùng ({users.filter(u => u.role === 'user').length})
              </button>
              <button 
                onClick={() => setRoleTab('admin')} 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  roleTab === 'admin' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Quản trị viên ({users.filter(u => u.role === 'admin').length})
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm tên hoặc email..." 
                className="border border-gray-300 px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select 
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="locked">Đã khóa</option>
            </select>
            
            <select 
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={`${sortBy}-${sortOrder}`} 
              onChange={e => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
            >
              <option value="createdAt-desc">Mới nhất</option>
              <option value="createdAt-asc">Cũ nhất</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
              <option value="balance-desc">Số dư cao nhất</option>
              <option value="balance-asc">Số dư thấp nhất</option>
            </select>
            
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setRoleTab("user");
                setCurrentPage(1);
                setSortBy("createdAt");
                setSortOrder("desc");
              }}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
      
      {/* Table */}
      {loading ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="text-center text-red-600">{error}</div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {paginatedUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {filteredUsers.length === 0 
                ? "Không có thành viên nào" 
                : "Không có thành viên nào phù hợp với bộ lọc"
              }
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số dư
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin ngân hàng
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
                  {paginatedUsers.map((u) => (
                    <tr key={u._id} className={`hover:bg-gray-50 transition-colors ${selectedUsers.includes(u._id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedUsers.includes(u._id)}
                          onChange={(e) => handleSelectUser(u._id, e.target.checked)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {u.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={u.avatar} alt={u.name} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{u.name}</div>
                            <div className="text-sm text-gray-500">{u.email}</div>
                            {u.phone && (
                              <div className="text-sm text-gray-500">{u.phone}</div>
                            )}
                            <div className="text-xs text-gray-400 mt-1">
                              {u.isVerified ? (
                                <span className="text-green-600">✓ Đã xác minh</span>
                              ) : (
                                <span className="text-gray-500">○ Chưa xác minh</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(u.role)}`}>
                          {getRoleLabel(u.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {u.balance?.toLocaleString()} đ
                        </div>
                        <div className="text-xs text-gray-500">
                          Thu nhập: {u.income?.toLocaleString()} đ
                        </div>
                        <div className="text-xs text-gray-500">
                          Có thể rút: {u.withdrawable?.toLocaleString()} đ
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.bankAccount ? (
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">{u.bankAccount}</div>
                            <div className="text-xs text-gray-500">{u.bankName || "N/A"}</div>
                            <div className="text-xs text-gray-500">{u.bankAccountHolder || "N/A"}</div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 italic">Chưa cập nhật</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(u.isActive)}`}>
                          {getStatusLabel(u.isActive)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                            onClick={() => setFormModal({ open: true, initialData: u })}
                            disabled={actionLoading === "edit" + u._id}
                          >
                            Sửa
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                            onClick={() => setConfirm({ open: true, id: u._id })}
                            disabled={actionLoading === "delete" + u._id}
                          >
                            Xóa
                          </button>
                          {u.role !== "admin" && (
                            <button
                              className={`px-3 py-1 rounded text-xs text-white transition-colors ${
                                u.isActive 
                                  ? "bg-gray-500 hover:bg-gray-700" 
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                              onClick={() => setLockConfirm({ open: true, id: u._id, isActive: !u.isActive })}
                              disabled={actionLoading === "lock" + u._id}
                            >
                              {u.isActive ? "Khóa" : "Mở"}
                            </button>
                          )}
                          <button
                            className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600 transition-colors"
                            onClick={() => setTxModal({ open: true, user: u })}
                          >
                            Lịch sử
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Phân trang */}
      {filteredUsers.length > itemsPerPage && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} trong tổng số {filteredUsers.length} thành viên
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
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
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
      
      <UserFormModal
        open={formModal.open}
        onClose={() => setFormModal({ open: false, initialData: null })}
        onSubmit={formModal.initialData ? handleEdit : handleCreate}
        initialData={formModal.initialData}
      />
      <ConfirmModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        message="Bạn chắc chắn muốn xóa user này?"
        confirmText="Xóa"
      />
      <ConfirmModal
        open={lockConfirm.open}
        onClose={() => setLockConfirm({ open: false, id: null, isActive: true })}
        onConfirm={handleLockToggle}
        message={`Bạn chắc chắn muốn ${lockConfirm.isActive ? "mở khóa" : "khóa"} user này?`}
        confirmText={lockConfirm.isActive ? "Mở khóa" : "Khóa"}
      />
      <UserTransactionsModal
        open={txModal.open}
        onClose={() => setTxModal({ open: false, user: null })}
        user={txModal.user}
      />
    </div>
  );
} 