import React, { useState } from 'react';
import axios from 'axios';

export default function ImageUpload({ onUploadSuccess, onUploadError, multiple = false, maxFiles = 5 }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const BASE_URL = 'https://jbs-invest.onrender.com';

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Preview cho single file
    if (!multiple && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/identity-verification/upload-image`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        }
      );

      if (response.data.success) {
        onUploadSuccess(response.data.data);
        setPreview(null);
        setProgress(0);
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi tải ảnh';
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const files = e.target.files;
    
    if (!files || files.length === 0) return;

    if (multiple) {
      // Upload nhiều file
      for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
        await uploadImage(files[i]);
      }
    } else {
      // Upload single file
      await uploadImage(files[0]);
    }
  };

  const removePreview = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleUpload}
          onInput={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer block"
        >
          <div className="space-y-2">
            <div className="text-4xl">📷</div>
            <div className="text-lg font-medium text-gray-700">
              {uploading ? 'Đang tải ảnh...' : 'Chọn ảnh để tải lên'}
            </div>
            <div className="text-sm text-gray-500">
              Hỗ trợ: JPG, JPEG, PNG, GIF, WEBP (Tối đa 5MB)
            </div>
          </div>
        </label>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Đang tải...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-md h-auto rounded-lg shadow-md"
          />
          <button
            onClick={removePreview}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-700 text-sm">Đang tải ảnh lên Cloudinary...</span>
          </div>
        </div>
      )}
    </div>
  );
} 