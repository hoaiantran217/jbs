import React, { useState } from 'react';
import { XMarkIcon, CameraIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const AvatarUploadModal = ({ isOpen, onClose, currentAvatar, onAvatarUpdate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn hình ảnh');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/avatar`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        onAvatarUpdate(response.data.avatar);
        onClose();
        setSelectedFile(null);
        setPreview(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <CameraIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Thay đổi avatar</h2>
              <p className="text-white text-sm mt-1">Cập nhật hình ảnh đại diện của bạn</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Current Avatar */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Avatar hiện tại</h3>
            <div className="flex justify-center mb-4">
              {currentAvatar ? (
                <img 
                  src={currentAvatar} 
                  alt="Current Avatar" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
                  <CameraIcon className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <CameraIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Chọn hình ảnh mới</p>
                <p className="text-sm text-gray-500 mt-1">JPG, PNG, GIF (tối đa 5MB)</p>
              </label>
            </div>

            {/* Preview */}
            {preview && (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Xem trước</h3>
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-green-500 mx-auto"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex-shrink-0">
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                !selectedFile || uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang upload...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Cập nhật</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadModal; 