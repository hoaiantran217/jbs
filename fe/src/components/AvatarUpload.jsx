import { useState, useRef } from 'react';
import axios from 'axios';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AvatarUpload({ currentAvatar, onAvatarUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage('Chỉ hỗ trợ file ảnh: JPG, JPEG, PNG, GIF, WEBP');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Kích thước file không được vượt quá 5MB');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/upload-avatar`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.user && onAvatarUpdate) {
        onAvatarUpdate(response.data.user.avatar);
      }

      setMessage('Upload avatar thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(error.response?.data?.message || 'Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentAvatar) return;

    setUploading(true);
    setMessage('');

    try {
      // Gửi request để xóa avatar (có thể cần tạo API endpoint mới)
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/user/profile`,
        { avatar: null },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (onAvatarUpdate) {
        onAvatarUpdate(null);
      }

      setMessage('Đã xóa avatar!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Remove avatar error:', error);
      setMessage('Xóa avatar thất bại');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          {!currentAvatar && (
            <PhotoIcon className="w-12 h-12 text-gray-400" />
          )}
        </div>
        
        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-colors disabled:opacity-50"
        >
          <PhotoIcon className="w-4 h-4" />
        </button>

        {/* Remove Button */}
        {currentAvatar && (
          <button
            onClick={handleRemoveAvatar}
            disabled={uploading}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Message */}
      {message && (
        <div className={`text-sm px-3 py-2 rounded-lg ${
          message.includes('thành công') || message.includes('Đã xóa')
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="text-sm text-blue-600">
          Đang upload...
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-500 text-center max-w-xs">
        <p>Click vào icon camera để upload ảnh đại diện</p>
        <p>Hỗ trợ: JPG, PNG, GIF, WEBP (tối đa 5MB)</p>
      </div>
    </div>
  );
} 