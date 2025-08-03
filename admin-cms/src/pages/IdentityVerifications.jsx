import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const IdentityVerifications = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const BASE_URL = 'https://jbs-invest.onrender.com';   
  // Fetch verifications
  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await axios.get(`${BASE_URL}/api/identity-verification/admin?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setVerifications(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [currentPage, statusFilter]);

  // Get verification detail
  const getVerificationDetail = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/identity-verification/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSelectedVerification(response.data.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('Error getting verification detail:', error);
      toast.error('Lỗi khi tải chi tiết');
    }
  };

  // Process verification
  const handleProcessVerification = async (status) => {
    try {
      if (!selectedVerification) return;

      setProcessing(true);
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/api/identity-verification/admin/${selectedVerification._id}/process`, {
        status,
        adminNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`Xử lý yêu cầu ${status === 'approved' ? 'thành công' : 'từ chối'}`);
      setShowProcessModal(false);
      setShowDetailModal(false);
      setSelectedVerification(null);
      setAdminNotes('');
      fetchVerifications();
    } catch (error) {
      console.error('Error processing verification:', error);
      toast.error('Lỗi khi xử lý yêu cầu');
    } finally {
      setProcessing(false);
    }
  };

  // Get status display
  const getStatusDisplay = (status) => {
    const statusConfig = {
      pending: {
        icon: <ClockIcon className="w-5 h-5 text-yellow-500" />,
        text: 'Chờ xử lý',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      },
      approved: {
        icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
        text: 'Đã chấp thuận',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      rejected: {
        icon: <XCircleIcon className="w-5 h-5 text-red-500" />,
        text: 'Bị từ chối',
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        {config.icon}
        <span className="ml-1">{config.text}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý xác minh danh tính</h1>
        <p className="text-gray-600">Xử lý các yêu cầu xác minh danh tính của người dùng</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="approved">Đã chấp thuận</option>
          <option value="rejected">Bị từ chối</option>
        </select>
      </div>

      {/* Verifications List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Người dùng
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Thông tin
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Hình ảnh
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Trạng thái
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Ngày gửi
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Thao tác
                 </th>
               </tr>
             </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {verifications.map((verification) => (
                <tr key={verification._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {verification.userId?.fullName || verification.userId?.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {verification.userId?.email}
                      </div>
                    </div>
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                     <div>
                       <div className="text-sm text-gray-900">
                         {verification.fullName}
                       </div>
                       <div className="text-sm text-gray-500">
                         {verification.idType} - {verification.idNumber}
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex flex-col space-y-1">
                       <div className="flex items-center space-x-1">
                         <PhotoIcon className="w-4 h-4 text-gray-400" />
                         <span className="text-xs text-gray-500">Giấy tờ:</span>
                       </div>
                       <div className="flex space-x-1">
                         {verification.frontImage && (
                           <div className="relative group" title="Mặt trước - Click để xem chi tiết">
                             <img 
                               src={verification.frontImage} 
                               alt="Mặt trước" 
                               className="w-10 h-6 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                               onClick={() => {
                                 setSelectedVerification(verification);
                                 setShowDetailModal(true);
                               }}
                             />
                             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
                               <span className="text-white text-xs opacity-0 group-hover:opacity-100 font-medium">Xem</span>
                             </div>
                           </div>
                         )}
                         {verification.backImage && (
                           <div className="relative group" title="Mặt sau - Click để xem chi tiết">
                             <img 
                               src={verification.backImage} 
                               alt="Mặt sau" 
                               className="w-10 h-6 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                               onClick={() => {
                                 setSelectedVerification(verification);
                                 setShowDetailModal(true);
                               }}
                             />
                             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
                               <span className="text-white text-xs opacity-0 group-hover:opacity-100 font-medium">Xem</span>
                             </div>
                           </div>
                         )}
                         {!verification.frontImage && !verification.backImage && (
                           <span className="text-xs text-gray-400">Chưa có ảnh</span>
                         )}
                       </div>
                       {(verification.frontImage || verification.backImage) && (
                         <button
                           onClick={() => {
                             setSelectedVerification(verification);
                             setShowDetailModal(true);
                           }}
                           className="text-xs text-blue-600 hover:text-blue-800 underline"
                         >
                           Xem chi tiết
                         </button>
                       )}
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     {getStatusDisplay(verification.status)}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(verification.submittedAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => getVerificationDetail(verification._id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    {verification.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedVerification(verification);
                          setShowProcessModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        Xử lý
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {verifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không có yêu cầu xác minh nào
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chi tiết yêu cầu xác minh</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Thông tin người dùng</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Tên:</span> {selectedVerification.userId?.fullName}</p>
                  <p><span className="font-medium">Email:</span> {selectedVerification.userId?.email}</p>
                  <p><span className="font-medium">SĐT:</span> {selectedVerification.userId?.phone || 'N/A'}</p>
                </div>

                <h4 className="font-semibold mb-3 mt-4">Thông tin xác minh</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Họ tên:</span> {selectedVerification.fullName}</p>
                  <p><span className="font-medium">Ngày sinh:</span> {new Date(selectedVerification.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                  <p><span className="font-medium">Loại giấy tờ:</span> {selectedVerification.idType}</p>
                  <p><span className="font-medium">Số giấy tờ:</span> {selectedVerification.idNumber}</p>
                  <p><span className="font-medium">Trạng thái:</span> {getStatusDisplay(selectedVerification.status)}</p>
                  <p><span className="font-medium">Ngày gửi:</span> {new Date(selectedVerification.submittedAt).toLocaleDateString('vi-VN')}</p>
                </div>

                {selectedVerification.processedAt && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-3">Thông tin xử lý</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Ngày xử lý:</span> {new Date(selectedVerification.processedAt).toLocaleDateString('vi-VN')}</p>
                      <p><span className="font-medium">Xử lý bởi:</span> {selectedVerification.processedBy?.fullName}</p>
                      {selectedVerification.adminNotes && (
                        <p><span className="font-medium">Ghi chú:</span> {selectedVerification.adminNotes}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-3">Ảnh giấy tờ</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Mặt trước</p>
                    <img 
                      src={selectedVerification.frontImage} 
                      alt="Front" 
                      className="w-full h-48 object-cover rounded border"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Mặt sau</p>
                    <img 
                      src={selectedVerification.backImage} 
                      alt="Back" 
                      className="w-full h-48 object-cover rounded border"
                    />
                  </div>
                </div>
              </div>
            </div>

            {selectedVerification.status === 'pending' && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowProcessModal(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Xử lý yêu cầu
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Process Modal */}
      {showProcessModal && selectedVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Xử lý yêu cầu xác minh</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú (tùy chọn)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập ghi chú nếu cần..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleProcessVerification('approved')}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-300 flex items-center justify-center"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                {processing ? 'Đang xử lý...' : 'Chấp thuận'}
              </button>
              <button
                onClick={() => handleProcessVerification('rejected')}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-300 flex items-center justify-center"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                {processing ? 'Đang xử lý...' : 'Từ chối'}
              </button>
              <button
                onClick={() => {
                  setShowProcessModal(false);
                  setAdminNotes('');
                }}
                disabled={processing}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:bg-gray-300"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentityVerifications; 