import { useState, useEffect, useRef } from "react";

export default function ReviewFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    reviewerName: "",
    comment: "",
    rating: 5,
    isActive: true,
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    if (initialData) {
      setForm({
        reviewerName: initialData.reviewerName || "",
        comment: initialData.comment || "",
        rating: initialData.rating || 5,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
      setAvatarPreview(initialData.avatar || "");
      setAvatar(null);
    } else {
      setForm({
        reviewerName: "",
        comment: "",
        rating: 5,
        isActive: true,
      });
      setAvatarPreview("");
      setAvatar(null);
    }
  }, [initialData, open]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const submitData = {
      ...form,
      avatar: avatar || (initialData?.avatar || null)
    };
    onSubmit(submitData);
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form className="bg-white rounded shadow-lg p-6 min-w-[400px] max-w-[90vw] max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">{initialData ? "Sửa đánh giá" : "Tạo đánh giá mới"}</h2>
        
        {/* Avatar Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Avatar người đánh giá</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-600 text-2xl">👤</span>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Chọn ảnh
              </button>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatar(null);
                    setAvatarPreview("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Nếu không chọn ảnh, sẽ sử dụng icon mặc định</p>
        </div>

        {/* Reviewer Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tên người đánh giá *</label>
          <input 
            className="border p-2 w-full rounded" 
            name="reviewerName" 
            placeholder="Nhập tên người đánh giá" 
            value={form.reviewerName} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung đánh giá *</label>
          <textarea 
            className="border p-2 w-full rounded resize-none" 
            name="comment" 
            placeholder="Nhập nội dung đánh giá" 
            value={form.comment} 
            onChange={handleChange} 
            rows="4"
            maxLength="1000"
            required 
          />
          <p className="text-xs text-gray-500 mt-1">{form.comment.length}/1000 ký tự</p>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá sao *</label>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, rating: star }))}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  {star <= form.rating ? "★" : "☆"}
                </button>
              ))}
            </div>
            <span className="text-yellow-500 font-bold ml-2">
              {renderStars(form.rating)} ({form.rating}/5)
            </span>
          </div>
        </div>

        {/* Status (only for editing) */}
        {initialData && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select 
              className="border p-2 w-full rounded" 
              name="isActive" 
              value={form.isActive} 
              onChange={handleChange}
            >
              <option value={true}>Đang hiển thị</option>
              <option value={false}>Đã ẩn</option>
            </select>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button 
            type="button" 
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" 
            onClick={onClose}
          >
            Huỷ
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {initialData ? "Lưu" : "Tạo"}
          </button>
        </div>
      </form>
    </div>
  );
} 