import { useState, useEffect, useRef } from "react";
import { 
  GiftIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon
} from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import { Wheel } from 'react-custom-roulette';

export default function LuckyWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spins, setSpins] = useState(1); // Bắt đầu với 1 lượt miễn phí
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spinMethods, setSpinMethods] = useState([]);
  const { user, refreshUser } = useUser();

  // Các phần thưởng cho vòng quay với format phù hợp cho thư viện
  const data = [
    { option: '10.000đ', style: { backgroundColor: '#FF6B6B', textColor: '#FFFFFF' }, value: 10000, probability: 70 },
    { option: '20.000đ', style: { backgroundColor: '#4ECDC4', textColor: '#FFFFFF' }, value: 20000, probability: 10 },
    { option: '50.000đ', style: { backgroundColor: '#45B7D1', textColor: '#FFFFFF' }, value: 50000, probability: 7 },
    { option: '100.000đ', style: { backgroundColor: '#96CEB4', textColor: '#FFFFFF' }, value: 100000, probability: 5 },
    { option: '200.000đ', style: { backgroundColor: '#c8a32a', textColor: '#FFFFFF' }, value: 200000, probability: 5 },
    { option: '500.000đ', style: { backgroundColor: '#DDA0DD', textColor: '#FFFFFF' }, value: 500000, probability: 2 },
    { option: '1.000.000đ', style: { backgroundColor: '#FFB347', textColor: '#FFFFFF' }, value: 1000000, probability: 1 }
  ];

  // Kiểm tra đăng nhập lần đầu trong ngày
  const checkFirstLoginToday = () => {
    const today = new Date().toDateString();
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    const freeSpinClaimed = localStorage.getItem('freeSpinClaimed');
    
    if (lastLoginDate !== today) {
      localStorage.setItem('lastLoginDate', today);
      localStorage.removeItem('freeSpinClaimed'); // Reset khi ngày mới
      return true;
    }
    
    // Kiểm tra đã nhận lượt quay miễn phí chưa
    return freeSpinClaimed !== today;
  };

  // Kiểm tra lịch sử nạp 500k+ trong ngày
  const checkDepositHistoryToday = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseURL = 'https://jbs-invest.onrender.com';
      
      const response = await axios.get(`${baseURL}/api/transactions/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

      const depositsToday = response.data.filter(tx => {
        const txDate = new Date(tx.createdAt);
        return tx.type === 'deposit' && 
               tx.status === 'approved' && 
               tx.amount >= 500000 &&
               txDate >= todayStart && 
               txDate < todayEnd;
      });

      // Kiểm tra đã nhận lượt quay từ nạp tiền chưa
      const depositSpinClaimed = localStorage.getItem('depositSpinClaimed');
      const todayString = today.toDateString();
      
      return depositsToday.length > 0 && depositSpinClaimed !== todayString;
    } catch (error) {
      console.error('Lỗi khi kiểm tra lịch sử nạp:', error);
      return false;
    }
  };

  // Kiểm tra lịch sử đầu tư trong ngày
  const checkInvestmentHistoryToday = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseURL = 'https://jbs-invest.onrender.com';
      
      const response = await axios.get(`${baseURL}/api/investments/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

      const investmentsToday = response.data.filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate >= todayStart && invDate < todayEnd;
      });

      // Kiểm tra đã nhận lượt quay từ đầu tư chưa
      const investmentSpinClaimed = localStorage.getItem('investmentSpinClaimed');
      const todayString = today.toDateString();
      
      return investmentsToday.length > 0 && investmentSpinClaimed !== todayString;
    } catch (error) {
      console.error('Lỗi khi kiểm tra lịch sử đầu tư:', error);
      return false;
    }
  };

  // Cập nhật danh sách cách nhận lượt quay
  const updateSpinMethods = async () => {
    const isFirstLoginToday = checkFirstLoginToday();
    const hasDepositHistoryToday = await checkDepositHistoryToday();
    const hasInvestmentHistoryToday = await checkInvestmentHistoryToday();

    const methods = [
      {
        icon: <CheckCircleIcon className="w-6 h-6 text-green-600" />,
        title: "Đăng nhập lần đầu trong ngày",
        description: "Đăng nhập lần đầu tiên trong ngày để nhận lượt quay miễn phí",
        available: isFirstLoginToday,
        action: getFreeSpin
      },
      {
        icon: <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />,
        title: "Nạp 500.000đ+ trong ngày",
        description: "Đã nạp tiền từ 500.000đ trở lên trong ngày hôm nay",
        available: hasDepositHistoryToday,
        action: depositForSpin
      },
      {
        icon: <StarIcon className="w-6 h-6 text-yellow-600" />,
        title: "Đầu tư trong ngày",
        description: "Đã đầu tư vào gói bất kỳ trong ngày hôm nay",
        available: hasInvestmentHistoryToday,
        action: investForSpin
      }
    ];

    setSpinMethods(methods);
  };

  // Chọn phần thưởng ngẫu nhiên dựa trên xác suất
  const selectRandomPrize = () => {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    
    for (let i = 0; i < data.length; i++) {
      cumulativeProbability += data[i].probability;
      if (random <= cumulativeProbability) {
        return i;
      }
    }
    
    return 0; // Fallback
  };

  // API call để cộng tiền vào tài khoản
  const addBalanceToAccount = async (amount) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vui lòng đăng nhập để sử dụng vòng quay!');
        return false;
      }

      // Sử dụng URL tuyệt đối cho production
      const baseURL = 'https://jbs-invest.onrender.com';

      const response = await axios.post(`${baseURL}/api/user/add-balance`, {
        amount: amount
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        await refreshUser(); // Cập nhật thông tin user
        return true;
      }
      return false;
    } catch (error) {
      console.error('Lỗi khi cộng tiền:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      return false;
    }
  };

  // Quay vòng quay
  const spinWheel = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để sử dụng vòng quay!');
      return;
    }

    if (isSpinning || spins <= 0) {
      toast.error(spins <= 0 ? "Bạn không có lượt quay!" : "Đang quay, vui lòng đợi!");
      return;
    }

    setIsSpinning(true);
    setSpins(prev => prev - 1);
    
    const selectedIndex = selectRandomPrize();
    setPrizeNumber(selectedIndex);
    setMustSpin(true);
  };

  // Xử lý khi vòng quay dừng
  const handleStopSpinning = () => {
    setMustSpin(false);
    setIsSpinning(false);
    console.log(prizeNumber);
    const selectedPrize = data[prizeNumber];
    
    // Cộng tiền vào tài khoản thực tế
    addBalanceToAccount(selectedPrize.value).then(success => {
      if (success) {
        toast.success(`Chúc mừng! Bạn đã trúng ${selectedPrize.option}!`);
      } else {
        toast.error('Có lỗi xảy ra khi cộng tiền thưởng!');
      }
    });
    setResult(selectedPrize);
    setShowResult(true);
    
  };

  // Đóng modal kết quả
  const closeResult = () => {
    setShowResult(false);
    setResult(null);
  };

  // Lấy lượt quay miễn phí
  const getFreeSpin = () => {
    setSpins(prev => prev + 1);
    localStorage.setItem('freeSpinClaimed', new Date().toDateString());
    toast.success("Đã nhận 1 lượt quay miễn phí!");
    updateSpinMethods(); // Cập nhật lại danh sách
  };

  // Nạp tiền để có thêm lượt quay
  const depositForSpin = () => {
    setSpins(prev => prev + 1);
    localStorage.setItem('depositSpinClaimed', new Date().toDateString());
    toast.success("Đã nhận 1 lượt quay từ nạp tiền trong ngày!");
    updateSpinMethods(); // Cập nhật lại danh sách
  };

  // Đầu tư để có lượt quay
  const investForSpin = () => {
    setSpins(prev => prev + 1);
    localStorage.setItem('investmentSpinClaimed', new Date().toDateString());
    toast.success("Đã nhận 1 lượt quay từ đầu tư trong ngày!");
    updateSpinMethods(); // Cập nhật lại danh sách
  };

  // Cập nhật danh sách khi component mount
  useEffect(() => {
    if (user) {
      updateSpinMethods();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            VÒNG QUAY MAY MẮN
          </h1>
          <p className="text-md text-gray-500 mt-2">
            Tham gia vòng quay may mắn và nhận ngay tiền mặt vào ví!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Vòng quay */}
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              {/* Vòng quay */}
              <div className="relative">
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={data}
                  onStopSpinning={handleStopSpinning}
                  backgroundColors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB347']}
                  textColors={['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#000000', '#FFFFFF', '#FFFFFF']}
                  fontSize={16}
                  radiusLineWidth={2}
                  radiusLineColor={'#FFFFFF'}
                  innerRadius={20}
                  innerBorderColor={'#FFFFFF'}
                  innerBorderWidth={0}
                  outerBorderWidth={0}
                  outerBorderColor={'#E5E7EB'}
                  textDistance={70}
                  spinDuration={1}
                />
                
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full border-4 border-gray-300 shadow-lg flex items-center justify-center z-10">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <GiftIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Nút quay */}
            <button
              onClick={spinWheel}
              disabled={isSpinning || spins <= 0 || !user}
              className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 ${
                isSpinning || spins <= 0 || !user
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
              } text-white shadow-lg`}
            >
              {isSpinning ? (
                <div className="flex items-center gap-2">
                  <ArrowPathIcon className="w-6 h-6 animate-spin" />
                  Đang quay...
                </div>
              ) : !user ? (
                'Vui lòng đăng nhập'
              ) : (
                `QUAY NGAY (${spins} lượt)`
              )}
            </button>

            {/* Thông tin lượt quay */}
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Số lượt quay còn lại: <span className="font-bold text-purple-600">{spins}</span>
              </p>
              {user && (
                <p className="text-gray-600">
                  Số dư ví: <span className="font-bold text-green-600">{user.balance?.toLocaleString()}đ</span>
                </p>
              )}
            </div>
          </div>

          {/* Thông tin phần thưởng và cách nhận lượt quay */}
          <div className="space-y-4 md:space-y-6">
            {/* Phần thưởng */}
            <div className="hidden md:block bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
                💸 Phần thưởng (tiền mặt)
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {data.map((prize, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border-2 shadow-sm hover:shadow-md transition-all duration-200"
                    style={{ 
                      borderColor: prize.style.backgroundColor, 
                      backgroundColor: `${prize.style.backgroundColor}10`
                    }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: prize.style.backgroundColor }}
                    ></div>
                    <span className="font-semibold text-gray-800">{prize.option}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cách nhận lượt quay */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <ArrowPathIcon className="w-8 h-8 text-blue-600" />
                🔁 Cách nhận lượt quay
              </h2>
              <div className="space-y-4">
                {spinMethods.map((method, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{method.title}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    <button
                      onClick={method.action}
                      disabled={!method.available}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        method.available
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {method.available ? 'Nhận' : 'Đã nhận'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Lưu ý */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
                📌 Lưu ý
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <span>Tiền thưởng được cộng trực tiếp vào ví tài khoản</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <span>Có thể tích lũy và rút khi đạt tối thiểu 500.000đ</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <span>Mỗi tài khoản có giới hạn số lượt quay/ngày</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            🎉 Quay là trúng – càng chơi càng lời!
          </h2>
          <p className="text-xl mb-6 opacity-90">
            💰 Hàng ngàn phần thưởng tiền mặt đang chờ bạn mỗi ngày!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={spinWheel}
              disabled={isSpinning || spins <= 0 || !user}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {!user ? 'Đăng nhập để quay' : 'Quay ngay'}
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
              Xem gói đầu tư
            </button>
          </div>
        </div>
      </div>

      {/* Modal kết quả */}
      {showResult && result && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="mb-6">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <GiftIcon className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Chúc mừng!
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                Bạn đã trúng
              </p>
              <div className="text-4xl font-bold text-green-600 mb-6">
                {result.option}
              </div>
              <p className="text-gray-600">
                Tiền thưởng đã được cộng vào ví của bạn!
              </p>
            </div>
            <button
              onClick={closeResult}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Tiếp tục quay
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 