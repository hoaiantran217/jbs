import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  CameraIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import MobileDatePicker from '../components/MobileDatePicker';

const IdentityVerification = () => {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    idType: 'CCCD',
    idNumber: '',
    frontImage: '',
    backImage: ''
  });
  const BASE_URL = 'https://jbs-invest.onrender.com';

  // Fetch verification status
  const fetchVerificationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/identity-verification/my-verification`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setVerification(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  // Upload image
  const uploadImage = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/identity-verification/upload-image`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          [type]: response.data.data.url
        }));
        toast.success('Tải ảnh thành công');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Lỗi khi tải ảnh');
    }
  };

  // Handle file upload
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      uploadImage(file, type);
    }
  };

  // Submit verification
  const handleSubmit = async () => {
    try {
      if (!formData.fullName || !formData.dateOfBirth || !formData.idNumber || !formData.frontImage || !formData.backImage) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/identity-verification/submit`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Gửi yêu cầu xác minh thành công');
      fetchVerificationStatus();
      setCurrentStep(1);
      setFormData({
        fullName: '',
        dateOfBirth: '',
        idType: 'CCCD',
        idNumber: '',
        frontImage: '',
        backImage: ''
      });
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  // Get status display
  const getStatusDisplay = () => {
    if (!verification) return null;

    if (verification.status === 'pending') {
      return (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <ClockIcon className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Thông tin của bạn đang được xác minh
              </h3>
              <p className="text-yellow-700 mb-4">
                Cảm ơn bạn đã hoàn tất bước gửi thông tin xác minh danh tính.
              </p>
              
              <div className="bg-white rounded-lg p-4 mb-4 border border-yellow-100">
                <p className="text-sm text-gray-700 mb-3">
                  Đội ngũ JBS đang tiến hành kiểm tra và xử lý hồ sơ của bạn.
                  Đây là bước cần thiết để đảm bảo an toàn và tuân thủ các quy định bảo mật thông tin.
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-600">🕒</span>
                    <span className="text-gray-700">Thời gian xử lý dự kiến: trong vòng 5 – 24 giờ làm việc.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-600">📩</span>
                    <span className="text-gray-700">Kết quả xác minh sẽ được thông báo qua email hoặc trong ứng dụng JBS.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-green-800">✅ Trường hợp thành công</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    Tài khoản của bạn sẽ được xác minh và có thể truy cập đầy đủ các tính năng JBS.
                  </p>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <XCircleIcon className="w-5 h-5 text-red-500" />
                    <h4 className="font-semibold text-red-800">❌ Trường hợp từ chối</h4>
                  </div>
                  <p className="text-sm text-red-700">
                    Bạn sẽ nhận được thông báo lý do và hướng dẫn thực hiện lại.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (verification.status === 'approved') {
      return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                🎉 Tài khoản của bạn đã được xác minh thành công
              </h3>
              <p className="text-green-700 mb-3">
                Chúc mừng! Quá trình xác minh danh tính của bạn đã hoàn tất.
              </p>
              <p className="text-green-700">
                Bạn hiện có thể truy cập đầy đủ các tính năng và dịch vụ của JBS.
              </p>
              {verification.processedAt && (
                <p className="text-sm text-green-600 mt-3">
                  Xác minh thành công vào {new Date(verification.processedAt).toLocaleDateString('vi-VN')}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (verification.status === 'rejected') {
      return (
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <XCircleIcon className="w-8 h-8 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                ⚠️ Xác minh không thành công
              </h3>
              <p className="text-red-700 mb-4">
                Chúng tôi rất tiếc! Hồ sơ xác minh của bạn chưa đáp ứng đủ yêu cầu.
              </p>
              
              {verification.adminNotes && (
                <div className="bg-white rounded-lg p-4 mb-4 border border-red-100">
                  <h4 className="font-semibold text-red-800 mb-2">📝 Lý do từ chối:</h4>
                  <p className="text-sm text-gray-700">{verification.adminNotes}</p>
                </div>
              )}

              <div className="bg-white rounded-lg p-4 mb-4 border border-red-100">
                <h4 className="font-semibold text-red-800 mb-3">👉 Vui lòng thực hiện lại bước xác minh:</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">1.</span>
                    <span>Chuẩn bị giấy tờ hợp lệ (CCCD, hộ chiếu, v.v.)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">2.</span>
                    <span>Đảm bảo hình ảnh rõ nét, không bị lóa hoặc che khuất</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">3.</span>
                    <span>Tải lại thông tin qua mục "Xác minh tài khoản"</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  📩 Nếu bạn cần hỗ trợ thêm, đừng ngần ngại liên hệ chăm sóc khách JBS trực tuyến.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // If user is already verified
  if (user?.isVerified) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Tài khoản đã được xác minh</h1>
          <p className="text-gray-600">Bạn có thể sử dụng đầy đủ các tính năng của hệ thống</p>
        </div>
      </div>
    );
  }

  // If verification exists, show status
  if (verification) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Xác minh danh tính</h1>
          <p className="text-gray-600">Trạng thái yêu cầu xác minh của bạn</p>
        </div>

        {getStatusDisplay()}

        {verification.status === 'rejected' && (
          <div className="mt-6">
            <button
              onClick={() => {
                setVerification(null);
                setCurrentStep(1);
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Gửi lại yêu cầu xác minh
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl h-full my-4 m-auto p-4 md:p-6 bg-white rounded-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center md:text-left">Xác minh danh tính</h1>
        <p className="text-gray-600 text-center md:text-left">Hoàn tất xác minh tài khoản để sử dụng đầy đủ tính năng</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex-1 md:flex-row flex-col items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className=" text-center md:text-left text-sm md:text-base">Thông tin cá nhân</span>
          </div>
          <div className={`flex-1 h-1 mx-2 md:mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 md:flex-row flex-col items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className=" text-center md:text-left text-sm md:text-base">Giấy tờ tùy thân</span>
          </div>
          <div className={`flex-1 h-1 mx-2 md:mx-4 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 md:flex-row flex-col items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className=" text-center md:text-left text-sm md:text-base">Gửi yêu cầu</span>
          </div>
        </div>
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <UserIcon className="w-6 h-6 mr-2" />
            Thông tin cá nhân
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập họ và tên đầy đủ"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sinh
              </label>
              <MobileDatePicker
                value={formData.dateOfBirth}
                onChange={(value) => setFormData({...formData, dateOfBirth: value})}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại giấy tờ
              </label>
              <select
                value={formData.idType}
                onChange={(e) => setFormData({...formData, idType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CCCD">Căn cước công dân</option>
                <option value="CMND">Chứng minh nhân dân</option>
                <option value="PASSPORT">Hộ chiếu</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số giấy tờ
              </label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập số giấy tờ"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!formData.fullName || !formData.dateOfBirth || !formData.idNumber}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}

      {/* Step 2: ID Documents */}
      {currentStep === 2 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <DocumentTextIcon className="w-6 h-6 mr-2" />
            Giấy tờ tùy thân
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mặt trước {formData.idType}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {formData.frontImage ? (
                  <div>
                    <img src={formData.frontImage} alt="Front" className="w-full h-48 object-cover rounded" />
                    <button
                      onClick={() => setFormData({...formData, frontImage: ''})}
                      className="mt-2 text-red-600 text-sm"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                ) : (
                  <div>
                    <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Tải ảnh mặt trước</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'frontImage')}
                      className="hidden"
                      id="frontImage"
                    />
                    <label htmlFor="frontImage" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer">
                      Chọn ảnh
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Back Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mặt sau {formData.idType}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {formData.backImage ? (
                  <div>
                    <img src={formData.backImage} alt="Back" className="w-full h-48 object-cover rounded" />
                    <button
                      onClick={() => setFormData({...formData, backImage: ''})}
                      className="mt-2 text-red-600 text-sm"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                ) : (
                  <div>
                    <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Tải ảnh mặt sau</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'backImage')}
                      className="hidden"
                      id="backImage"
                    />
                    <label htmlFor="backImage" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer">
                      Chọn ảnh
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Lưu ý quan trọng:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Ảnh phải rõ nét, không mờ hoặc bị che khuất thông tin</li>
              <li>• Đảm bảo tất cả thông tin trên giấy tờ có thể đọc được</li>
              <li>• Chúng tôi cam kết bảo mật tuyệt đối thông tin của bạn</li>
            </ul>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!formData.frontImage || !formData.backImage}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Submit */}
      {currentStep === 3 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Xác nhận thông tin</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <p className="text-gray-900">{formData.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                <p className="text-gray-900">{new Date(formData.dateOfBirth).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Loại giấy tờ</label>
                <p className="text-gray-900">{formData.idType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số giấy tờ</label>
                <p className="text-gray-900">{formData.idNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mặt trước</label>
                <img src={formData.frontImage} alt="Front" className="w-full h-32 object-cover rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mặt sau</label>
                <img src={formData.backImage} alt="Back" className="w-full h-32 object-cover rounded" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu xác minh'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentityVerification; 