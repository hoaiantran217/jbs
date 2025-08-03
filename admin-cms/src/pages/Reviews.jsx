import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";
import ReviewFormModal from "../components/ReviewFormModal";

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

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formModal, setFormModal] = useState({ open: false, initialData: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [actionLoading, setActionLoading] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 2500);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/reviews`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReviews(res.data);
    } catch (err) {
      setError("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleCreate = async (data) => {
    setActionLoading("create");
    try {
      const formData = new FormData();
      formData.append('reviewerName', data.reviewerName);
      formData.append('comment', data.comment);
      formData.append('rating', data.rating);
      if (data.avatar) {
        formData.append('avatar', data.avatar);
      }

      await axios.post(`${BASE_URL}/api/reviews`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      await fetchReviews();
      setFormModal({ open: false, initialData: null });
      showToast("Tạo đánh giá thành công!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi khi tạo đánh giá", "error");
    } finally {
      setActionLoading("");
    }
  };

  const handleEdit = async (data) => {
    setActionLoading("edit" + data._id);
    try {
      const formData = new FormData();
      formData.append('reviewerName', data.reviewerName);
      formData.append('comment', data.comment);
      formData.append('rating', data.rating);
      formData.append('isActive', data.isActive);
      if (data.avatar && data.avatar instanceof File) {
        formData.append('avatar', data.avatar);
      }

      await axios.put(`${BASE_URL}/api/reviews/${data._id}`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      await fetchReviews();
      setFormModal({ open: false, initialData: null });
      showToast("Cập nhật đánh giá thành công!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi khi sửa đánh giá", "error");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async () => {
    setActionLoading("delete" + confirm.id);
    try {
      await axios.delete(`${BASE_URL}/api/reviews/${confirm.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchReviews();
      setConfirm({ open: false, id: null });
      showToast("Đã xóa đánh giá!", "success");
    } catch (err) {
      showToast("Lỗi khi xóa đánh giá", "error");
    } finally {
      setActionLoading("");
    }
  };

  const handleToggleActive = async (reviewId, currentStatus) => {
    setActionLoading("toggle" + reviewId);
    try {
      await axios.patch(
        `${BASE_URL}/api/reviews/${reviewId}/active`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      await fetchReviews();
      showToast("Cập nhật trạng thái thành công!", "success");
    } catch (err) {
      showToast("Lỗi khi cập nhật trạng thái", "error");
    } finally {
      setActionLoading("");
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const filteredReviews = reviews.filter(review =>
    (!search || review.reviewerName.toLowerCase().includes(search.toLowerCase()) || review.comment.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "all" || (statusFilter === "active" ? review.isActive : !review.isActive))
  );

  return (
    <div className="p-4 w-full bg-white rounded-lg shadow-md min-h-screen">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: toast.type })} />
      
      <h1 className="text-2xl font-bold mb-4">Quản lý đánh giá</h1>
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => setFormModal({ open: true, initialData: null })}
      >
        + Tạo đánh giá mới
      </button>
      
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="Tìm tên hoặc nội dung..." 
          className="border px-2 py-1 rounded" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
        <select 
          className="border px-2 py-1 rounded" 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="active">Đang hiển thị</option>
          <option value="inactive">Đã ẩn</option>
        </select>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Avatar</th>
                <th className="border px-4 py-2">Tên người đánh giá</th>
                <th className="border px-4 py-2">Nội dung</th>
                <th className="border px-4 py-2">Đánh giá</th>
                <th className="border px-4 py-2">Trạng thái</th>
                <th className="border px-4 py-2">Ngày tạo</th>
                <th className="border px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review._id}>
                  <td className="border px-4 py-2">
                    {review.avatar ? (
                      <img 
                        src={review.avatar} 
                        alt="avatar" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">👤</span>
                      </div>
                    )}
                  </td>
                  <td className="border px-4 py-2 font-medium">{review.reviewerName}</td>
                  <td className="border px-4 py-2 max-w-xs">
                    <div className="truncate" title={review.comment}>
                      {review.comment}
                    </div>
                  </td>
                  <td className="border px-4 py-2">
                    <span className="text-yellow-500 font-bold">
                      {renderStars(review.rating)}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                  </td>
                  <td className="border px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      review.isActive 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {review.isActive ? "Đang hiển thị" : "Đã ẩn"}
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                      onClick={() => setFormModal({ open: true, initialData: review })}
                      disabled={actionLoading === "edit" + review._id}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2"
                      onClick={() => setConfirm({ open: true, id: review._id })}
                      disabled={actionLoading === "delete" + review._id}
                    >
                      Xóa
                    </button>
                    <button
                      className={`px-3 py-1 rounded text-white ${
                        review.isActive 
                          ? "bg-gray-500 hover:bg-gray-700" 
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      onClick={() => handleToggleActive(review._id, review.isActive)}
                      disabled={actionLoading === "toggle" + review._id}
                    >
                      {review.isActive ? "Ẩn" : "Hiện"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ReviewFormModal
        open={formModal.open}
        onClose={() => setFormModal({ open: false, initialData: null })}
        onSubmit={formModal.initialData ? handleEdit : handleCreate}
        initialData={formModal.initialData}
      />
      
      <ConfirmModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        message="Bạn chắc chắn muốn xóa đánh giá này?"
        confirmText="Xóa"
      />
    </div>
  );
} 