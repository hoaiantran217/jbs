import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  QrCodeIcon,
  CreditCardIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';

function BankInfoModal({ open, onClose, onSubmit, bankInfo = null, mode = 'create' }) {
  const [form, setForm] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    qrCode: '',
    transferContent: '',
    description: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (bankInfo && mode === 'edit') {
      setForm({
        bankName: bankInfo.bankName || '',
        accountNumber: bankInfo.accountNumber || '',
        accountHolder: bankInfo.accountHolder || '',
        qrCode: bankInfo.qrCode || '',
        transferContent: bankInfo.transferContent || '',
        description: bankInfo.description || '',
        isActive: bankInfo.isActive !== undefined ? bankInfo.isActive : true
      });
    } else {
      setForm({
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        qrCode: '',
        transferContent: '',
        description: '',
        isActive: true
      });
    }
  }, [bankInfo, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.qrCode) {
      setMessage('Vui lòng upload hoặc nhập URL QR code');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      await onSubmit(form);
      setMessage('Thành công!');
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Chỉ hỗ trợ file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size không được vượt quá 5MB');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('qrCode', file);

    try {
      console.log('Uploading to:', `${import.meta.env.VITE_BASE_URL}/api/bank-info/admin/upload-qr`);
      console.log('Token:', localStorage.getItem('token'));
      
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/bank-info/admin/upload-qr`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Upload response:', response.data);
      setForm({ ...form, qrCode: response.data.url });
      setMessage('Upload QR code thành công!');
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error response:', error.response);
      setMessage(error.response?.data?.message || 'Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'create' ? 'Thêm thông tin ngân hàng' : 'Chỉnh sửa thông tin ngân hàng'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên ngân hàng *
              </label>
              <input
                type="text"
                required
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VD: Vietcombank, BIDV, Techcombank..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tài khoản *
              </label>
              <input
                type="text"
                required
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập số tài khoản"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chủ tài khoản *
              </label>
              <input
                type="text"
                required
                value={form.accountHolder}
                onChange={(e) => setForm({ ...form, accountHolder: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tên chủ tài khoản"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={true}>Hoạt động</option>
                <option value={false}>Không hoạt động</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code *
            </label>
            <div className="space-y-3">
              {/* Upload file */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-sm text-blue-600 mt-1">Đang upload...</p>
                )}
              </div>
              
              {/* URL input */}
              <div>
                <input
                  type="url"
                  value={form.qrCode}
                  onChange={(e) => setForm({ ...form, qrCode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Hoặc nhập URL QR code trực tiếp"
                />
              </div>

              {/* Preview */}
              {form.qrCode && (
                <div className="flex items-center space-x-3">
                  <img
                    src={form.qrCode}
                    alt="QR Code Preview"
                    className="w-16 h-16 rounded border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-16 h-16 rounded border border-gray-300 flex items-center justify-center bg-gray-50" style={{ display: 'none' }}>
                    <QrCodeIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, qrCode: '' })}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Upload file QR code hoặc nhập URL trực tiếp
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả (tùy chọn)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mô tả thêm về tài khoản ngân hàng..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung chuyển khoản (tùy chọn)
            </label>
            <textarea
              value={form.transferContent}
              onChange={(e) => setForm({ ...form, transferContent: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nội dung chuyển khoản (VD: Chuyển khoản cho A, 1234567890, 1000000)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Nội dung này sẽ được hiển thị cho người dùng khi chuyển khoản
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm ${
              message === 'Thành công!' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : (mode === 'create' ? 'Thêm mới' : 'Cập nhật')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BankInfo() {
  const [bankInfos, setBankInfos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'create', bankInfo: null });

  useEffect(() => {
    fetchBankInfos();
  }, []);

  const fetchBankInfos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/bank-info/admin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBankInfos(response.data);
    } catch (error) {
      console.error('Error fetching bank info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/bank-info/admin`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchBankInfos();
  };

  const handleUpdate = async (formData) => {
    await axios.put(`${import.meta.env.VITE_BASE_URL}/api/bank-info/admin/${modal.bankInfo._id}`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchBankInfos();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thông tin ngân hàng này?')) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/bank-info/admin/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchBankInfos();
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa');
    }
  };

  const handleSubmit = (formData) => {
    if (modal.mode === 'create') {
      return handleCreate(formData);
    } else {
      return handleUpdate(formData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý thông tin ngân hàng</h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản ngân hàng và QR code</p>
        </div>
        <button
          onClick={() => setModal({ open: true, mode: 'create', bankInfo: null })}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Thêm mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {bankInfos.length === 0 ? (
          <div className="text-center py-12">
            <BuildingLibraryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thông tin ngân hàng</h3>
            <p className="text-gray-500 mb-4">Bắt đầu bằng cách thêm thông tin ngân hàng đầu tiên</p>
            <button
              onClick={() => setModal({ open: true, mode: 'create', bankInfo: null })}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Thêm thông tin ngân hàng
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin ngân hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QR Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bankInfos.map((bankInfo) => (
                  <tr key={bankInfo._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <BuildingLibraryIcon className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {bankInfo.bankName}
                          </div>
                          <div className="text-sm text-gray-500">
                            <CreditCardIcon className="w-4 h-4 inline mr-1" />
                            {bankInfo.accountNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            Chủ TK: {bankInfo.accountHolder}
                          </div>
                          {bankInfo.transferContent && (
                            <div className="text-sm text-gray-400 mt-1">
                              Nội dung: {bankInfo.transferContent}
                            </div>
                          )}
                          {bankInfo.description && (
                            <div className="text-sm text-gray-400 mt-1">
                              {bankInfo.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {bankInfo.qrCode ? (
                        <div className="flex items-center">
                          <img
                            src={bankInfo.qrCode}
                            alt="QR Code"
                            className="h-12 w-12 rounded border"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="h-12 w-12 rounded border border-gray-300 flex items-center justify-center bg-gray-50" style={{ display: 'none' }}>
                            <QrCodeIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded border border-gray-300 flex items-center justify-center bg-gray-50">
                          <QrCodeIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        bankInfo.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {bankInfo.isActive ? (
                          <>
                            <EyeIcon className="w-3 h-3 mr-1" />
                            Hoạt động
                          </>
                        ) : (
                          <>
                            <EyeSlashIcon className="w-3 h-3 mr-1" />
                            Không hoạt động
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(bankInfo.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setModal({ open: true, mode: 'edit', bankInfo })}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(bankInfo._id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
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

      <BankInfoModal
        open={modal.open}
        onClose={() => setModal({ open: false, mode: 'create', bankInfo: null })}
        onSubmit={handleSubmit}
        bankInfo={modal.bankInfo}
        mode={modal.mode}
      />
    </div>
  );
} 