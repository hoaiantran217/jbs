import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";
import PackageFormModal from "../components/PackageFormModal";

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

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formModal, setFormModal] = useState({ open: false, initialData: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [actionLoading, setActionLoading] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const BASE_URL = 'https://jbs-invest.onrender.com';
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 2500);
  };

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/packages`);
      setPackages(res.data);
    } catch (err) {
      setError("Không thể tải danh sách gói đầu tư");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreate = async (data) => {
    setActionLoading("create");
    try {
      await axios.post(`${BASE_URL}/api/packages`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchPackages();
      setFormModal({ open: false, initialData: null });
      showToast("Tạo gói đầu tư thành công!", "success");
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Lỗi khi tạo gói đầu tư";
      showToast(msg, "error");
    } finally {
      setActionLoading("");
    }
  };

  const handleEdit = async (data) => {
    setActionLoading("edit" + data._id);
    try {
      await axios.put(`${BASE_URL}/api/packages/${data._id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchPackages();
      setFormModal({ open: false, initialData: null });
      showToast("Cập nhật gói đầu tư thành công!", "success");
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Lỗi khi sửa gói đầu tư";
      showToast(msg, "error");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async () => {
    setActionLoading("delete" + confirm.id);
    try {
      await axios.delete(`${BASE_URL}/api/packages/${confirm.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchPackages();
      setConfirm({ open: false, id: null });
      showToast("Đã xóa gói đầu tư!", "success");
    } catch (err) {
      showToast("Lỗi khi xóa gói đầu tư", "error");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="p-4 w-full bg-white rounded-lg shadow-md min-h-screen">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: toast.type })} />
      <h1 className="text-2xl font-bold mb-4">Quản lý gói đầu tư</h1>
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => setFormModal({ open: true, initialData: null })}
      >
        + Tạo mới
      </button>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Ảnh</th>
              <th className="border px-4 py-2">Tên gói</th>
              <th className="border px-4 py-2">Lãi suất (%)</th>
              <th className="border px-4 py-2">Kỳ hạn (ngày)</th>
              <th className="border px-4 py-2">Tối thiểu</th>
              <th className="border px-4 py-2">Tối đa</th>
              <th className="border px-4 py-2">Số nhà đầu tư</th>
              <th className="border px-4 py-2">Tổng đầu tư</th>
              <th className="border px-4 py-2">Tiến độ (%)</th>
              <th className="border px-4 py-2">Trạng thái</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg._id}>
                <td className="border px-4 py-2 text-center">
                  {pkg.image && <img src={pkg.image} alt="Ảnh" className="h-12 w-20 object-cover rounded mx-auto" />}
                </td>
                <td className="border px-4 py-2">{pkg.name}</td>
                <td className="border px-4 py-2">{pkg.interestRate}</td>
                <td className="border px-4 py-2">{pkg.duration}</td>
                <td className="border px-4 py-2">{pkg.minAmount?.toLocaleString()}</td>
                <td className="border px-4 py-2">{pkg.maxAmount?.toLocaleString()}</td>
                <td className="border px-4 py-2">{Math.round(Number(pkg.investorCount) || 0).toLocaleString()}</td>
                <td className="border px-4 py-2">{Math.round(Number(pkg.totalInvested) || 0).toLocaleString()}</td>
                <td className="border px-4 py-2">{pkg.progressPercent || 0}%</td>
                <td className="border px-4 py-2">{pkg.active ? "Đang mở" : "Đã đóng"}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                    onClick={() => setFormModal({ open: true, initialData: pkg })}
                    disabled={actionLoading === "edit" + pkg._id}
                  >
                    Sửa
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => setConfirm({ open: true, id: pkg._id })}
                    disabled={actionLoading === "delete" + pkg._id}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <PackageFormModal
        open={formModal.open}
        onClose={() => setFormModal({ open: false, initialData: null })}
        onSubmit={formModal.initialData ? handleEdit : handleCreate}
        initialData={formModal.initialData}
      />
      <ConfirmModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        message="Bạn chắc chắn muốn xóa gói đầu tư này?"
        confirmText="Xóa"
      />
    </div>
  );
} 