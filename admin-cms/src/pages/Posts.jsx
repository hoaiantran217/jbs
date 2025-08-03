import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";

function PostFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({ title: "", content: "", active: true });
  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ title: "", content: "", active: true });
  }, [initialData, open]);
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form className="bg-white rounded shadow-lg p-6 min-w-[350px] max-w-[90vw]" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">{initialData ? "Sửa bài viết" : "Tạo bài viết"}</h2>
        <input className="border p-2 mb-2 w-full" name="title" placeholder="Tiêu đề" value={form.title} onChange={handleChange} required />
        <textarea className="border p-2 mb-2 w-full" name="content" placeholder="Nội dung" value={form.content} onChange={handleChange} required rows={5} />
        <label className="flex items-center mb-4">
          <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="mr-2" /> Hiển thị
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Huỷ</button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{initialData ? "Lưu" : "Tạo"}</button>
        </div>
      </form>
    </div>
  );
}

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formModal, setFormModal] = useState({ open: false, initialData: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [actionLoading, setActionLoading] = useState("");
  const BASE_URL = 'https://jbs-invest.onrender.com';
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPosts(res.data);
    } catch (err) {
      setError("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async (data) => {
    setActionLoading("create");
    try {
      await axios.post(`${BASE_URL}/api/posts`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchPosts();
      setFormModal({ open: false, initialData: null });
    } catch (err) {
      alert("Lỗi khi tạo bài viết");
    } finally {
      setActionLoading("");
    }
  };

  const handleEdit = async (data) => {
    setActionLoading("edit" + data._id);
    try {
      await axios.put(`${BASE_URL}/api/posts/${data._id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchPosts();
      setFormModal({ open: false, initialData: null });
    } catch (err) {
      alert("Lỗi khi sửa bài viết");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async () => {
    setActionLoading("delete" + confirm.id);
    try {
        await axios.delete(`${BASE_URL}/api/posts/${confirm.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchPosts();
      setConfirm({ open: false, id: null });
    } catch (err) {
      alert("Lỗi khi xóa bài viết");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="p-4 w-full bg-white rounded-lg shadow-md min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Danh sách bài viết</h1>
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
              <th className="border px-4 py-2">Tiêu đề</th>
              <th className="border px-4 py-2">Tác giả</th>
              <th className="border px-4 py-2">Ngày đăng</th>
              <th className="border px-4 py-2">Trạng thái</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p._id}>
                <td className="border px-4 py-2">{p.title}</td>
                <td className="border px-4 py-2">{p.author?.name || p.author || "-"}</td>
                <td className="border px-4 py-2">{new Date(p.createdAt).toLocaleString()}</td>
                <td className="border px-4 py-2">{p.active ? "Hiển thị" : "Ẩn"}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                    onClick={() => setFormModal({ open: true, initialData: p })}
                    disabled={actionLoading === "edit" + p._id}
                  >
                    Sửa
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => setConfirm({ open: true, id: p._id })}
                    disabled={actionLoading === "delete" + p._id}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <PostFormModal
        open={formModal.open}
        onClose={() => setFormModal({ open: false, initialData: null })}
        onSubmit={formModal.initialData ? handleEdit : handleCreate}
        initialData={formModal.initialData}
      />
      <ConfirmModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        message="Bạn chắc chắn muốn xóa bài viết này?"
        confirmText="Xóa"
      />
    </div>
  );
} 