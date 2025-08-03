import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const InvestmentData = () => {
  const [investmentData, setInvestmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    amount: '',
    type: 'deposit',
    time: ''
  });
  const [totalInvested, setTotalInvested] = useState('');

  // Fetch investment data
  const fetchInvestmentData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/investment-data/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setInvestmentData(response.data.data);
        setTotalInvested(response.data.data?.totalInvested || '');
      }
    } catch (error) {
      console.error('Error fetching investment data:', error);
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestmentData();
  }, []);

  // Update total invested
  const handleUpdateTotalInvested = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/investment-data/admin/total-invested', 
        { totalInvested },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Cập nhật tổng số tiền đầu tư thành công');
      fetchInvestmentData();
    } catch (error) {
      console.error('Error updating total invested:', error);
      toast.error('Lỗi khi cập nhật tổng số tiền');
    }
  };

  // Add new investment
  const handleAddInvestment = async () => {
    try {
      if (!newInvestment.name || !newInvestment.amount || !newInvestment.time) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const token = localStorage.getItem('token');
      await axios.post('/api/investment-data/admin/active-investment',
        newInvestment,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Thêm hoạt động đầu tư thành công');
      setShowAddModal(false);
      setNewInvestment({ name: '', amount: '', type: 'deposit', time: '' });
      fetchInvestmentData();
    } catch (error) {
      console.error('Error adding investment:', error);
      toast.error('Lỗi khi thêm hoạt động đầu tư');
    }
  };

  // Delete investment
  const handleDeleteInvestment = async (investmentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa hoạt động này?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/investment-data/admin/active-investment/${investmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Xóa hoạt động đầu tư thành công');
      fetchInvestmentData();
    } catch (error) {
      console.error('Error deleting investment:', error);
      toast.error('Lỗi khi xóa hoạt động đầu tư');
    }
  };

  // Clear all investments
  const handleClearAllInvestments = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa tất cả hoạt động đầu tư?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete('/api/investment-data/admin/active-investments', {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Xóa tất cả hoạt động đầu tư thành công');
      fetchInvestmentData();
    } catch (error) {
      console.error('Error clearing all investments:', error);
      toast.error('Lỗi khi xóa tất cả hoạt động');
    }
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý dữ liệu đầu tư thực tế</h1>
        <p className="text-gray-600">Cập nhật tổng số tiền đầu tư và hoạt động đầu tư</p>
      </div>

      {/* Total Invested Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Tổng số tiền đầu tư</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tổng số tiền (VNĐ)
            </label>
            <input
              type="text"
              value={totalInvested}
              onChange={(e) => setTotalInvested(e.target.value)}
              placeholder="VD: 92,548,200,000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleUpdateTotalInvested}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Cập nhật
          </button>
        </div>
      </div>

      {/* Active Investments Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Hoạt động đầu tư đang diễn ra</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Thêm hoạt động
            </button>
            <button
              onClick={handleClearAllInvestments}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        </div>

        {/* Investment List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investmentData?.activeInvestments?.map((investment, index) => (
                <tr key={investment._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {investment.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {investment.amount.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      investment.type === 'deposit' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {investment.type === 'deposit' ? 'Nạp' : 'Rút'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {investment.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteInvestment(investment._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!investmentData?.activeInvestments || investmentData.activeInvestments.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Chưa có hoạt động đầu tư nào
            </div>
          )}
        </div>
      </div>

      {/* Add Investment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Thêm hoạt động đầu tư</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  value={newInvestment.name}
                  onChange={(e) => setNewInvestment({...newInvestment, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên người dùng"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tiền (VNĐ)
                </label>
                <input
                  type="number"
                  value={newInvestment.amount}
                  onChange={(e) => setNewInvestment({...newInvestment, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số tiền"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại
                </label>
                <select
                  value={newInvestment.type}
                  onChange={(e) => setNewInvestment({...newInvestment, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="deposit">Nạp tiền</option>
                  <option value="withdrawal">Rút tiền</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian (HH:MM)
                </label>
                <input
                  type="text"
                  value={newInvestment.time}
                  onChange={(e) => setNewInvestment({...newInvestment, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: 14:30"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddInvestment}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Thêm
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
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

export default InvestmentData; 