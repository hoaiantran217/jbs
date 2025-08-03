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

export default function Maturities() {
  const [maturities, setMaturities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, id: null, status: null });
  const [actionLoading, setActionLoading] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const BASE_URL = 'https://jbs-invest.onrender.com';

  const fetchMaturities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/investments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Lọc chỉ những giao dịch đầu tư đã được duyệt và chờ đáo hạn
      const pendingMaturities = res.data.filter(inv => 
        inv.status === 'approved' && inv.maturityStatus === 'pending'
      );
      setMaturities(pendingMaturities);
    } catch (err) {
      console.error("Lỗi khi tải danh sách đáo hạn:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaturities();
  }, []);

  const handleAction = async () => {
    setActionLoading(confirm.id + confirm.status);
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/investments/${confirm.id}/maturity`,
        { status: confirm.status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      await fetchMaturities();
      setConfirm({ open: false, id: null, status: null });
      setToast({ show: true, message: res.data.message, type: "success" });
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || "Lỗi khi xử lý đáo hạn", type: "error" });
    } finally {
      setActionLoading("");
    }
  };

  const calculateInterest = (investment) => {
    if (!investment.package) return 0;
    return Math.round((investment.amount * investment.package.interestRate) / 100 * investment.package.duration);
  };

  const calculateMaturityDate = (investment) => {
    if (!investment.package) return null;
    const createdAt = new Date(investment.createdAt);
    const maturityDate = new Date(createdAt.getTime() + (investment.package.duration * 24 * 60 * 60 * 1000));
    return maturityDate;
  };

  if (loading) {
    return <div className="p-8 text-center">Đang tải...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý đáo hạn đầu tư</h1>
        <div className="text-sm text-gray-600">
          Tổng: {maturities.length} khoản đầu tư chờ đáo hạn
        </div>
      </div>

      {maturities.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có khoản đầu tư nào chờ đáo hạn</h3>
          <p className="text-gray-500">Tất cả các khoản đầu tư đã được xử lý đáo hạn hoặc chưa đến thời gian đáo hạn.</p>
        </div>
      ) : (
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
                  Số tiền gốc
                </th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Tổng nhận được
                 </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đầu tư
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đáo hạn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                             {maturities.map((investment) => {
                 const interest = calculateInterest(investment);
                 const totalAmount = investment.amount + interest;
                 const maturityDate = calculateMaturityDate(investment);
                 const isOverdue = maturityDate && new Date() > maturityDate;
                
                return (
                  <tr key={investment._id} className={isOverdue ? "bg-red-50" : ""}>
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
                      <div className="text-sm text-gray-500">
                        {investment.package?.duration} ngày
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {investment.amount?.toLocaleString()} đ
                      </div>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm font-medium text-green-600">
                         {totalAmount.toLocaleString()} đ
                       </div>
                       <div className="text-xs text-gray-500">
                         (Gốc: {investment.amount?.toLocaleString()} + Lãi: {interest.toLocaleString()})
                       </div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(investment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className={isOverdue ? "text-red-600 font-medium" : ""}>
                        {maturityDate ? maturityDate.toLocaleDateString() : "N/A"}
                      </div>
                      {isOverdue && (
                        <div className="text-xs text-red-500">Quá hạn</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirm({ open: true, id: investment._id, status: 'approved' })}
                          disabled={actionLoading === investment._id + 'approved'}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          {actionLoading === investment._id + 'approved' ? 'Đang xử lý...' : 'Duyệt đáo hạn'}
                        </button>
                        <button
                          onClick={() => setConfirm({ open: true, id: investment._id, status: 'rejected' })}
                          disabled={actionLoading === investment._id + 'rejected'}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {actionLoading === investment._id + 'rejected' ? 'Đang xử lý...' : 'Từ chối'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null, status: null })}
        onConfirm={handleAction}
        title={`${confirm.status === 'approved' ? 'Duyệt' : 'Từ chối'} đáo hạn`}
        message={`Bạn có chắc chắn muốn ${confirm.status === 'approved' ? 'duyệt đáo hạn và cộng tiền gốc + lãi' : 'từ chối đáo hạn'} cho khoản đầu tư này?`}
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