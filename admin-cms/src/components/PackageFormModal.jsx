import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function PackageFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    interestRate: "",
    duration: "",
    minAmount: "",
    maxAmount: "",
    active: true,
    image: "",
    investorCount: "0",
    totalInvested: "0",
    progressPercent: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setPreview(initialData.image || "");
    } else {
      setForm({ 
        name: "", 
        description: "", 
        interestRate: "", 
        duration: "", 
        minAmount: "", 
        maxAmount: "", 
        active: true, 
        image: "",
        investorCount: "0",
        totalInvested: "0",
        progressPercent: 0,
      });
      setPreview("");
    }
    setImageFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }, [initialData, open]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImage = e => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const data = new FormData();
      // Xóa _id nếu có khi tạo mới
      const formData = { ...form };
      if (!initialData) delete formData._id;
      // Ép kiểu các trường số
      formData.interestRate = Number(formData.interestRate);
      formData.duration = Number(formData.duration);
      formData.minAmount = Number(formData.minAmount);
      formData.maxAmount = Number(formData.maxAmount);
      formData.progressPercent = Number(formData.progressPercent);
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.set("image", imageFile);
      let res;
      if (initialData) {
        res = await axios.put(`${BASE_URL}/api/packages/${initialData._id}`, data, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        res = await axios.post(`${BASE_URL}/api/packages`, data, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      onSubmit(res.data);
    } catch (err) {
      alert("Lỗi khi lưu gói đầu tư");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form className="bg-white rounded shadow-lg p-6 min-w-[350px] max-w-[90vw] max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Sửa gói đầu tư" : "Tạo gói đầu tư"}</h2>
        <input className="border p-2 mb-2 w-full" name="name" placeholder="Tên gói" value={form.name} onChange={handleChange} required />
        <input className="border p-2 mb-2 w-full" name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} />
        <div className="mb-2">
          <input className="border p-2 w-full" name="interestRate" placeholder="Lãi suất (%)" type="number" value={form.interestRate} onChange={handleChange} required />
          <small className="text-gray-600">Lãi sẽ được tính theo % của số tiền đầu tư (VD: 10% = 10,000đ lãi cho 100,000đ đầu tư)</small>
        </div>
        <input className="border p-2 mb-2 w-full" name="duration" placeholder="Kỳ hạn (ngày)" type="number" value={form.duration} onChange={handleChange} required />
        <input className="border p-2 mb-2 w-full" name="minAmount" placeholder="Tối thiểu" type="number" value={form.minAmount} onChange={handleChange} required />
        <input className="border p-2 mb-2 w-full" name="maxAmount" placeholder="Tối đa" type="number" value={form.maxAmount} onChange={handleChange} required />
        
        {/* Các trường thống kê */}
        <div className="mb-2">
          <input className="border p-2 w-full" name="investorCount" placeholder="Số nhà đầu tư đã tham gia" value={form.investorCount} onChange={handleChange} />
          <small className="text-gray-600">Số lượng nhà đầu tư đã tham gia gói này</small>
        </div>
        <div className="mb-2">
          <input className="border p-2 w-full" name="totalInvested" placeholder="Tổng số tiền đã đầu tư" value={form.totalInvested} onChange={handleChange} />
          <small className="text-gray-600">Tổng số tiền đã được đầu tư vào gói này</small>
        </div>
        <div className="mb-2">
          <input className="border p-2 w-full" name="progressPercent" placeholder="Tiến độ đầu tư (%)" type="number" min="0" max="100" value={form.progressPercent} onChange={handleChange} />
          <small className="text-gray-600">Tiến độ đầu tư từ 0-100%</small>
        </div>
        
        <label className="flex items-center mb-2">
          <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="mr-2" /> Đang mở
        </label>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Ảnh đại diện</label>
          <input type="file" accept="image/*" onChange={handleImage} ref={fileRef} className="mb-2" />
          {preview && <img src={preview} alt="preview" className="h-32 rounded object-cover" />}
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose} disabled={loading}>Huỷ</button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={loading}>{loading ? "Đang lưu..." : (initialData ? "Lưu" : "Tạo")}</button>
        </div>
      </form>
    </div>
  );
} 