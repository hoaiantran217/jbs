import { useState, useEffect } from "react";

export default function UserFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    balance: 0,
    bankAccount: "",
    bankName: "",
    bankAccountHolder: "",
  });

  useEffect(() => {
    if (initialData) setForm({ ...initialData, password: "" });
    else setForm({ name: "", email: "", password: "", role: "user", balance: 0, bankAccount: "", bankName: "", bankAccountHolder: "" });
  }, [initialData, open]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form className="bg-white rounded shadow-lg p-6 min-w-[350px] max-w-[90vw]" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">{initialData ? "Sửa user" : "Tạo user"}</h2>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input className="border p-2 w-full" name="name" placeholder="Tên" value={form.name} onChange={handleChange} required />
          <input className="border p-2 w-full" name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        {!initialData && <input className="border p-2 mb-2 w-full" name="password" placeholder="Mật khẩu" type="password" value={form.password} onChange={handleChange} required />}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <select className="border p-2 w-full" name="role" value={form.role} onChange={handleChange}>
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>
          <input className="border p-2 w-full" name="balance" placeholder="Số dư" type="number" value={form.balance} onChange={handleChange} />
        </div>
        <div className="border-t pt-2 mb-2">
          <div className="text-sm font-medium text-gray-700 mb-2">Thông tin ngân hàng</div>
          <input className="border p-2 mb-2 w-full" name="bankAccount" placeholder="Số tài khoản ngân hàng" value={form.bankAccount} onChange={handleChange} />
          <input className="border p-2 mb-2 w-full" name="bankName" placeholder="Tên ngân hàng" value={form.bankName} onChange={handleChange} />
          <input className="border p-2 mb-2 w-full" name="bankAccountHolder" placeholder="Chủ tài khoản" value={form.bankAccountHolder} onChange={handleChange} />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Huỷ</button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{initialData ? "Lưu" : "Tạo"}</button>
        </div>
      </form>
    </div>
  );
} 