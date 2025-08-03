import { useEffect, useState, useRef } from "react";
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

function TeamMemberFormModal({ open, onClose, onSubmit, initialData, actionLoading }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    position: "",
    title: "",
    description: "",
    email: "",
    phone: "",
    linkedin: "",
    experience: "",
    education: "",
    achievements: [],
    order: 0,
    color: "blue",
    isActive: true
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (initialData) {
      console.log("✅ Setting form with initialData:", initialData);
      setForm({
        name: initialData.name || "",
        position: initialData.position || "",
        title: initialData.title || "",
        description: initialData.description || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        linkedin: initialData.linkedin || "",
        experience: initialData.experience || "",
        education: initialData.education || "",
        achievements: initialData.achievements || [],
        order: initialData.order || 0,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        color: initialData.color || "blue"
      });
      setAvatarPreview(initialData.avatar || "");
    } else {
      console.log("✅ Setting form for new team member");
      setForm({
        name: "",
        position: "",
        title: "",
        description: "",
        email: "",
        phone: "",
        linkedin: "",
        experience: "",
        education: "",
        achievements: [],
        order: 0,
        isActive: true,
        color: "blue"
      });
      setAvatarPreview("");
    }
    setAvatarFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAchievementChange = (index, value) => {
    const newAchievements = [...form.achievements];
    newAchievements[index] = value;
    setForm(prev => ({ ...prev, achievements: newAchievements }));
  };

  const addAchievement = () => {
    setForm(prev => ({ ...prev, achievements: [...prev.achievements, ""] }));
  };

  const removeAchievement = (index) => {
    setForm(prev => ({ 
      ...prev, 
      achievements: prev.achievements.filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data with avatar file and _id if editing
    const submitData = {
      ...form,
      avatarFile: avatarFile
    };
    
    // Include _id if editing (initialData exists)
    if (initialData && initialData._id) {
      submitData._id = initialData._id;
    }
    
    onSubmit(submitData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên thành viên *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chức vụ *
              </label>
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh đại diện
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  ref={fileRef}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Chọn ảnh đại diện (JPG, PNG, WEBP). Kích thước tối đa 5MB.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kinh nghiệm
              </label>
              <input
                type="text"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Học vấn
              </label>
              <input
                type="text"
                name="education"
                value={form.education}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Màu sắc
              </label>
              <select
                name="color"
                value={form.color}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="blue">Xanh dương</option>
                <option value="green">Xanh lá</option>
                <option value="red">Đỏ</option>
                <option value="purple">Tím</option>
                <option value="orange">Cam</option>
                <option value="pink">Hồng</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thành tích
            </label>
            {form.achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={achievement}
                  onChange={(e) => handleAchievementChange(index, e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập thành tích..."
                />
                <button
                  type="button"
                  onClick={() => removeAchievement(index)}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAchievement}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              + Thêm thành tích
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">
              Hiển thị trên website
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={actionLoading || uploadingAvatar}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {actionLoading || uploadingAvatar ? "Đang lưu..." : (initialData ? "Cập nhật" : "Thêm mới")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeamMembers() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formModal, setFormModal] = useState({ open: false, initialData: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [actionLoading, setActionLoading] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 3000);
  };

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/team-members`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Fetched team members:", res.data); // Debug log
      setTeamMembers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách thành viên:", err);
      showToast("Lỗi khi tải danh sách thành viên", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleCreate = async (data) => {
    setActionLoading("create");
    try {
      const response = await axios.post(`${BASE_URL}/api/team-members`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      // If there's an avatar file, upload it
      if (data.avatarFile) {
        const formData = new FormData();
        formData.append('avatar', data.avatarFile);
        
        await axios.post(`${BASE_URL}/api/team-members/${response.data._id}/avatar`, formData, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      await fetchTeamMembers();
      setFormModal({ open: false, initialData: null });
      showToast("Thêm thành viên thành công!");
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi khi thêm thành viên", "error");
    } finally {
      setActionLoading("");
    }
  };

  const handleEdit = async (data) => {
    // Validate _id
    if (!data._id) {
      console.error("❌ data._id is undefined:", data);
      showToast("Lỗi: ID thành viên không hợp lệ", "error");
      return;
    }
    
    console.log("✅ Editing team member with ID:", data._id);
    setActionLoading("edit" + data._id);
    try {
      const response = await axios.put(`${BASE_URL}/api/team-members/${data._id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      // If there's an avatar file, upload it
      if (data.avatarFile) {
        const formData = new FormData();
        formData.append('avatar', data.avatarFile);
        
        await axios.post(`${BASE_URL}/api/team-members/${data._id}/avatar`, formData, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      await fetchTeamMembers();
      setFormModal({ open: false, initialData: null });
      showToast("Cập nhật thành viên thành công!");
    } catch (err) {
      console.error("❌ Error in handleEdit:", err);
      showToast(err.response?.data?.message || "Lỗi khi cập nhật thành viên", "error");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async () => {
    setActionLoading("delete" + confirm.id);
    try {
      await axios.delete(`${BASE_URL}/api/team-members/${confirm.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchTeamMembers();
      setConfirm({ open: false, id: null });
      showToast("Xóa thành viên thành công!");
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi khi xóa thành viên", "error");
    } finally {
      setActionLoading("");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await axios.patch(`${BASE_URL}/api/team-members/${id}/status`, 
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      await fetchTeamMembers();
      showToast("Cập nhật trạng thái thành công!");
    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi khi cập nhật trạng thái", "error");
    }
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: "bg-blue-600",
      green: "bg-green-600", 
      red: "bg-red-600",
      purple: "bg-purple-600",
      orange: "bg-orange-600",
      pink: "bg-pink-600"
    };
    return colorMap[color] || "bg-blue-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý đội ngũ lãnh đạo</h1>
        <button
          onClick={() => setFormModal({ open: true, initialData: null })}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Thêm thành viên
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className={`w-16 h-16 ${getColorClass(member.color)} rounded-full flex items-center justify-center mr-4`}>
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                <p className="text-blue-600">{member.position}</p>
                <p className="text-sm text-gray-600">{member.title}</p>
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">{member.description}</p>

            <div className="space-y-2 mb-4">
              {member.email && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {member.email}
                </p>
              )}
              {member.phone && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {member.phone}
                </p>
              )}
              {member.experience && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Kinh nghiệm:</span> {member.experience}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                member.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {member.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    console.log("🔍 Clicked edit button for member:", member);
                    if (!member._id) {
                      console.error("❌ member._id is undefined:", member);
                      showToast("Lỗi: ID thành viên không hợp lệ", "error");
                      return;
                    }
                    console.log("✅ Opening edit modal with member ID:", member._id);
                    setFormModal({ open: true, initialData: member });
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleStatusToggle(member._id, member.isActive)}
                  className={`px-3 py-1 rounded text-sm ${
                    member.isActive
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {member.isActive ? 'Ẩn' : 'Hiện'}
                </button>
                <button
                  onClick={() => setConfirm({ open: true, id: member._id })}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Chưa có thành viên nào</p>
        </div>
      )}

      <TeamMemberFormModal
        open={formModal.open}
        onClose={() => setFormModal({ open: false, initialData: null })}
        onSubmit={formModal.initialData ? handleEdit : handleCreate}
        initialData={formModal.initialData}
        actionLoading={actionLoading}
      />

      <ConfirmModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa thành viên này không?"
        loading={actionLoading.startsWith("delete")}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
} 