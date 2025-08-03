import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { 
  BellIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon as CloseIcon
} from "@heroicons/react/24/outline";

export default function WithdrawalNotifications() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAmount, setShowAmount] = useState(false);
  const [filter, setFilter] = useState("all"); // all, deposit, withdraw
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { user } = useUser();

  const BASE_URL = 'https://jbs-invest.onrender.com';

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/transactions/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      // Lọc chỉ lấy giao dịch nạp và rút tiền
      const depositWithdrawTransactions = response.data.filter(
        tx => tx.type === 'deposit' || tx.type === 'withdraw'
      );
      
      setTransactions(depositWithdrawTransactions);
    } catch (err) {
      setError("Không thể tải lịch sử giao dịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return 'Thành công';
      case 'pending':
        return 'Đang xử lý';
      case 'rejected':
        return 'Từ chối';
      default:
        return 'Không xác định';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon className="w-5 h-5 text-green-600" />;
      case 'withdraw':
        return <ArrowUpIcon className="w-5 h-5 text-red-600" />;
      default:
        return <CurrencyDollarIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'deposit':
        return 'Nạp tiền';
      case 'withdraw':
        return 'Rút tiền';
      default:
        return 'Giao dịch';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'withdraw':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const totalDeposits = transactions
    .filter(tx => tx.type === 'deposit' && tx.status === 'approved')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const totalWithdrawals = transactions
    .filter(tx => tx.type === 'withdraw' && tx.status === 'approved')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const pendingTransactions = transactions.filter(tx => tx.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BanknotesIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lịch sử nạp rút</h1>
              <p className="text-gray-600">Xem lại tất cả giao dịch nạp và rút tiền của bạn</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng giao dịch</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowDownIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng nạp</p>
                <p className="text-2xl font-bold text-green-600">
                  {showAmount ? formatCurrency(totalDeposits) : '***'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <ArrowUpIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng rút</p>
                <p className="text-2xl font-bold text-red-600">
                  {showAmount ? formatCurrency(totalWithdrawals) : '***'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingTransactions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Lọc theo:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="deposit">Nạp tiền</option>
                <option value="withdraw">Rút tiền</option>
              </select>
            </div>
            <button
              onClick={() => setShowAmount(!showAmount)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {showAmount ? (
                <>
                  <EyeSlashIcon className="w-5 h-5" />
                  <span>Ẩn số tiền</span>
                </>
              ) : (
                <>
                  <EyeIcon className="w-5 h-5" />
                  <span>Hiện số tiền</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại giao dịch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <BanknotesIcon className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không có giao dịch</h3>
                        <p className="text-gray-500">Bạn chưa có giao dịch nạp rút nào.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                                     filteredTransactions.map((transaction) => (
                     <tr 
                       key={transaction._id} 
                       className="hover:bg-gray-50 cursor-pointer"
                       onClick={() => {
                         setSelectedTransaction(transaction);
                         setShowDetailModal(true);
                       }}
                     >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg border ${getTypeColor(transaction.type)}`}>
                            {getTypeIcon(transaction.type)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {getTypeLabel(transaction.type)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction._id.slice(-8).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold">
                          {showAmount ? formatCurrency(transaction.amount) : '***'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {getStatusLabel(transaction.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate">
                          {transaction.note || transaction.description || 'Không có ghi chú'}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredTransactions.filter(tx => tx.type === 'deposit' && tx.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-600">Giao dịch nạp thành công</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredTransactions.filter(tx => tx.type === 'withdraw' && tx.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-600">Giao dịch rút thành công</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredTransactions.filter(tx => tx.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Giao dịch đang xử lý</div>
              </div>
            </div>
          </div>
                 )}
       </div>

       {/* Transaction Detail Modal */}
       {showDetailModal && selectedTransaction && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
             <div className="flex items-center justify-between p-6 border-b border-gray-200">
               <div className="flex items-center space-x-3">
                 <div className={`p-3 rounded-lg ${getTypeColor(selectedTransaction.type)}`}>
                   {getTypeIcon(selectedTransaction.type)}
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-gray-900">
                     {getTypeLabel(selectedTransaction.type)}
                   </h2>
                   <p className="text-sm text-gray-500">
                     {selectedTransaction._id.slice(-8).toUpperCase()}
                   </p>
                 </div>
               </div>
               <button
                 onClick={() => setShowDetailModal(false)}
                 className="text-gray-400 hover:text-gray-600 transition-colors"
               >
                 <CloseIcon className="w-6 h-6" />
               </button>
             </div>

             <div className="p-6 space-y-6">
               {/* Amount */}
               <div className="bg-gray-50 rounded-lg p-4">
                 <h3 className="text-sm font-medium text-gray-600 mb-2">Số tiền</h3>
                 <div className="text-3xl font-bold text-gray-900">
                   {formatCurrency(selectedTransaction.amount)}
                 </div>
               </div>

               {/* Status */}
               <div className="flex items-center justify-between">
                 <h3 className="text-sm font-medium text-gray-600">Trạng thái</h3>
                 <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                   {getStatusLabel(selectedTransaction.status)}
                 </span>
               </div>

               {/* Time */}
               <div className="flex items-center justify-between">
                 <h3 className="text-sm font-medium text-gray-600">Thời gian tạo</h3>
                 <span className="text-sm text-gray-900">{formatDate(selectedTransaction.createdAt)}</span>
               </div>

               {/* Bank Info for Withdrawals */}
               {selectedTransaction.type === 'withdraw' && selectedTransaction.bankInfo && (
                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                   <h3 className="text-sm font-medium text-blue-800 mb-3">Thông tin ngân hàng</h3>
                   <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                       <span className="text-blue-700">Ngân hàng:</span>
                       <span className="text-blue-900 font-medium">{selectedTransaction.bankInfo.bankName}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-blue-700">Số tài khoản:</span>
                       <span className="text-blue-900 font-medium">{selectedTransaction.bankInfo.accountNumber}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-blue-700">Người thụ hưởng:</span>
                       <span className="text-blue-900 font-medium">{selectedTransaction.bankInfo.accountName}</span>
                     </div>
                   </div>
                 </div>
               )}

               {/* Proof Image for Deposits */}
               {selectedTransaction.type === 'deposit' && selectedTransaction.proofImage && (
                 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                   <h3 className="text-sm font-medium text-green-800 mb-3">Hình ảnh xác thực</h3>
                   <img 
                     src={selectedTransaction.proofImage} 
                     alt="Proof" 
                     className="w-full h-48 object-cover rounded-lg"
                   />
                 </div>
               )}

               {/* Note */}
               {(selectedTransaction.note || selectedTransaction.description) && (
                 <div className="bg-gray-50 rounded-lg p-4">
                   <h3 className="text-sm font-medium text-gray-600 mb-2">Ghi chú</h3>
                   <p className="text-sm text-gray-900">
                     {selectedTransaction.note || selectedTransaction.description}
                   </p>
                 </div>
               )}

               {/* Approved Time */}
               {selectedTransaction.status === 'approved' && selectedTransaction.approvedAt && (
                 <div className="flex items-center justify-between">
                   <h3 className="text-sm font-medium text-gray-600">Thời gian duyệt</h3>
                   <span className="text-sm text-gray-900">{formatDate(selectedTransaction.approvedAt)}</span>
                 </div>
               )}
             </div>

             <div className="flex justify-end p-6 border-t border-gray-200">
               <button
                 onClick={() => setShowDetailModal(false)}
                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
               >
                 Đóng
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 } 