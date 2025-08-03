import { useState, useEffect } from 'react';
import { GiftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

export default function PromotionNotification() {
  const { user } = useUser();
  const [showNotification, setShowNotification] = useState(false);
  const [promotionInfo, setPromotionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkPromotionStatus();
    }
  }, [user]);

  const checkPromotionStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/promotion/config`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.isEnabled && response.data.amount > 0) {
        // Kiểm tra xem user đã nhận khuyến mãi chưa
        const transactionResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const hasReceivedPromotion = transactionResponse.data.some(
          tx => tx.type === 'promotion' && tx.status === 'approved'
        );
        
        if (!hasReceivedPromotion) {
          setPromotionInfo(response.data);
          setShowNotification(true);
        }
      }
    } catch (err) {
      console.error('Error checking promotion status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowNotification(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading || !showNotification || !promotionInfo) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg p-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <GiftIcon className="w-8 h-8 text-yellow-300 mr-3" />
            <div>
              <h3 className="text-lg font-bold mb-1">🎉 Chào mừng thành viên mới!</h3>
              <p className="text-sm text-green-100 mb-2">
                Bạn đã nhận được khuyến mãi đặc biệt từ hệ thống
              </p>
              <div className="bg-white/20 rounded-lg p-3 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">
                    {formatCurrency(promotionInfo.amount)}
                  </div>
                  <div className="text-xs text-green-100">
                    Khuyến mãi đã được cộng vào tài khoản
                  </div>
                </div>
              </div>
              <p className="text-xs text-green-100">
                Số tiền này đã được tự động cộng vào số dư của bạn. 
                Hãy bắt đầu đầu tư ngay hôm nay!
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-yellow-300 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 