import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircleIcon, ExclamationCircleIcon, ArrowTrendingUpIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/solid';
import { images } from "../assets/images";
import toast from 'react-hot-toast';
import { useUser } from "../contexts/UserContext";
import { dispatchUserBalanceChanged, optimisticBalanceUpdate, rollbackBalanceUpdate } from "../utils/events";
import Doitacdautu from "../components/Doitacdautu";

function ProgressBar({ value, max }) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300" style={{ width: percent + '%' }}></div>
    </div>
  );
}

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("");
  const [investModal, setInvestModal] = useState({ open: false, pkg: null });
  const [purchasedPackages, setPurchasedPackages] = useState([]);
  const { user, updateBalance } = useUser();

  const isLoggedIn = !!user;

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/packages`)
      .then(res => setPackages(res.data))
      .catch(() => setPackages([]));
  }, []);

  // Lấy danh sách gói đã mua
  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`${import.meta.env.VITE_BASE_URL}/api/investments/my-packages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then(res => setPurchasedPackages(res.data.purchasedPackageIds || []))
      .catch(() => setPurchasedPackages([]));
    }
  }, [isLoggedIn]);

  // Sử dụng dữ liệu từ backend thay vì tính toán
  const getCurrentInvested = (pkg) => {
    // Ưu tiên sử dụng dữ liệu từ admin
    if (pkg.totalInvested && pkg.totalInvested !== "0") {
      return parseInt(pkg.totalInvested.replace(/[^\d]/g, '')) || 0;
    }
    // Fallback về tính toán cũ
    return pkg.currentInvested || Math.floor(pkg.maxAmount * 0.9);
  };

  // Lấy tiến độ từ backend
  const getProgressPercent = (pkg) => {
    if (pkg.progressPercent !== undefined && pkg.progressPercent >= 0) {
      return pkg.progressPercent;
    }
    // Fallback về tính toán cũ
    const invested = getCurrentInvested(pkg);
    return Math.min(100, Math.round((invested / pkg.maxAmount) * 100));
  };

  // Lấy hình ảnh cố định cho mỗi gói dựa trên ID
  const getPackageImage = (pkg) => {
    if (pkg.image) return pkg.image;
    const index = pkg._id ? pkg._id.charCodeAt(pkg._id.length - 1) % images.investmentImages.length : 0;
    return images.investmentImages[index];
  };

  // Kiểm tra user đã mua gói này chưa
  const hasPurchasedPackage = (pkg) => {
    return purchasedPackages.includes(pkg._id);
  };

  // Điều kiện tham gia (ví dụ: số dư >= tối thiểu)
  const canInvest = (pkg) => isLoggedIn && user && user.balance >= pkg.minAmount && !hasPurchasedPackage(pkg);

  const handleInvest = async (pkg, amount) => {
    if (!isLoggedIn) {
      setMessage("Bạn cần đăng nhập để đầu tư.");
      return;
    }
    
    setLoading(pkg._id);
    setMessage("");
    
    // Optimistic update - cập nhật balance ngay lập tức
    const originalBalance = user.balance;
    const optimisticBalance = optimisticBalanceUpdate(user._id, originalBalance, amount, 'subtract');
    updateBalance(optimisticBalance);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/investments`, {
        packageId: pkg._id,
        amount,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      // Cập nhật số dư thực tế từ response
      if (response.data.user) {
        const newBalance = response.data.user.balance;
        updateBalance(newBalance);
        dispatchUserBalanceChanged(user._id, newBalance);
      }
      
      // Thông báo thành công ngay lập tức
      setMessage("Đầu tư thành công! Gói đầu tư đã được kích hoạt.");
      setInvestModal({ open: false, pkg: null });
      
      // Hiển thị toast thông báo thành công
      toast.success("Đầu tư thành công! Gói đầu tư đã được kích hoạt.");
      
    } catch (err) {
      // Rollback nếu thất bại
      rollbackBalanceUpdate(user._id, originalBalance);
      updateBalance(originalBalance);
      setMessage(err?.response?.data?.message || "Đầu tư thất bại");
      toast.error(err?.response?.data?.message || "Đầu tư thất bại");
    } finally {
      setLoading("");
    }
  };

  const checkLoginAndInvest = (pkg) => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để đầu tư.");
      return;
    }
    
    if (hasPurchasedPackage(pkg)) {
      toast.error("Bạn đã mua gói đầu tư này rồi. Mỗi gói chỉ được mua 1 lần.");
      return;
    }
    
    if (!user || user.balance < pkg.minAmount) {
      toast.error("Số dư không đủ để đầu tư gói này.");
      return;
    }
    setInvestModal({ open: true, pkg });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Gói đầu tư</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chọn gói đầu tư phù hợp với mục tiêu tài chính và khả năng của bạn
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {packages.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">📊</div>
              <div className="text-xl">Không có gói đầu tư nào hiện tại.</div>
              <div className="text-sm text-gray-400">Vui lòng quay lại sau.</div>
            </div>
          ) : (
            packages.map(pkg => {
              const invested = getCurrentInvested(pkg);
              const percent = getProgressPercent(pkg);
              return (
                <div key={pkg._id} className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border ${hasPurchasedPackage(pkg) ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}>
                  <div className="text-center mb-6">
                    {/* Package Image */}
                    <div className="w-full h-60 mb-4 rounded-lg overflow-hidden relative">
                      <img 
                        src={getPackageImage(pkg)} 
                        alt={pkg.name}
                        className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${hasPurchasedPackage(pkg) ? 'opacity-75' : ''}`}
                      />
                      {hasPurchasedPackage(pkg) && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          ĐÃ MUA
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-xl font-bold text-green-600 mb-1">{pkg.interestRate}%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Mô tả: {pkg.description}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Kỳ hạn:</span>
                      <span className="font-semibold">{pkg.duration} ngày</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Số tiền đầu tư:</span>
                      <span className="font-semibold">{pkg.minAmount?.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Lợi nhuận sau {pkg.duration} ngày:</span>
                      <span className="font-semibold text-green-600">{Math.round((Number(pkg.minAmount) * pkg.interestRate / 100)).toLocaleString()} đ</span>
                    </div>
                     <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tổng tiền nhận về:</span>
                      <span className="font-semibold text-green-600">{Math.round(Number(pkg.minAmount) + (Number(pkg.minAmount) * pkg.interestRate / 100)).toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tổng nhà đầu tư đã tham gia:</span>
                      <span className="font-semibold text-blue-600">{Math.round(Number(pkg.investorCount) || 0).toLocaleString()}</span>
                    </div>
                    <div className="text-md text-gray-500 flex justify-between items-center">
                      <span className="text-gray-600">Tổng số tiền đã đầu tư:</span>
                      <span className="font-semibold text-blue-600">{Math.round(Number(pkg.totalInvested) || 0).toLocaleString()} đ</span>
                    </div>
                  </div>
                  <div className="mb-4 mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Tiến độ đầu tư</span>
                      <span className="font-semibold">{percent}%</span>
                    </div>
                    <ProgressBar value={percent} max={100} />
                  </div>

                  <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    {hasPurchasedPackage(pkg) ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : isLoggedIn && user && user.balance >= pkg.minAmount ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm text-blue-700">
                      {hasPurchasedPackage(pkg) 
                        ? "Đã bán hết gói" 
                        : `Số tiền đầu tư: ${pkg.minAmount?.toLocaleString()} đ`
                      }
                    </span>
                  </div>

                  {hasPurchasedPackage(pkg) ? (
                    <button
                      className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 bg-gray-400 text-white cursor-not-allowed"
                      disabled={true}
                    >
                      Đã bán hết gói
                    </button>
                  ) : (
                    <button
                      className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading === pkg._id}
                      onClick={() => checkLoginAndInvest(pkg)}
                    >
                      {loading === pkg._id ? "Đang xử lý..." : "Đầu tư ngay"}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

       
        <Doitacdautu />
        {/* Modal đầu tư */}
        {investModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Đầu tư gói: {investModal.pkg?.name}</h2>
                <div className="text-3xl font-bold text-green-600">{investModal.pkg?.interestRate}%/{investModal.pkg?.duration} ngày</div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Kỳ hạn:</span>
                  <span className="font-semibold">{investModal.pkg?.duration} ngày</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Số tiền đầu tư:</span>
                  <span className="font-semibold text-blue-600">{investModal.pkg?.minAmount?.toLocaleString()} đ</span>
                </div>
              </div>

              {/* Hiển thị lãi dự kiến */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-gray-600 mb-2">Lãi dự kiến sau {investModal.pkg?.duration} ngày:</div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((investModal.pkg?.minAmount * investModal.pkg?.interestRate) / 100).toLocaleString()} đ
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  ({investModal.pkg?.interestRate}% × {investModal.pkg?.minAmount?.toLocaleString()} đ)
                </div>
              </div>

              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-gray-600 mb-2">Lãi dự kiến sau {investModal.pkg?.duration} ngày:</div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(Number(investModal.pkg?.minAmount) + (Number(investModal.pkg?.minAmount) * investModal.pkg?.interestRate / 100)).toLocaleString()} đ
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button" 
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setInvestModal({ open: false, pkg: null })}
                >
                  Huỷ
                </button>
                <button 
                  type="button" 
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50"
                  disabled={loading === investModal.pkg?._id}
                  onClick={() => handleInvest(investModal.pkg, investModal.pkg.minAmount)}
                >
                  {loading === investModal.pkg?._id ? "Đang xử lý..." : "Xác nhận đầu tư"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
} 