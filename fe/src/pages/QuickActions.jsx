import { useState, useEffect } from "react";
import axios from "axios";
import { 
  UserGroupIcon, 
  ArrowUpTrayIcon, 
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserIcon,
  XMarkIcon,
  QrCodeIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/solid';
import { FaIdCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { dispatchUserBalanceChanged } from "../utils/events";
import TransactionNotificationModal from "../components/TransactionNotificationModal";

function ActionModal({ open, onClose, type, onSubmit, userBalance }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adminBankInfo, setAdminBankInfo] = useState(null);
  const [step, setStep] = useState(1); // 1: Input, 2: QR Codes, 3: Proof Upload
  const [transactionId, setTransactionId] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  // XÓA state: isWaitingForApproval, waitingTime

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setStep(1);
      setAmount("");
      setError("");
      setSuccess("");
      setTransactionId(null);
      setProofImage(null);
      // XÓA setIsWaitingForApproval(false);
      // XÓA setWaitingTime(0);
    }
  }, [open]);

  // XÓA timer for waiting approval
  // XÓA useEffect(() => {
  // XÓA   let interval;
  // XÓA   if (isWaitingForApproval && waitingTime > 0) {
  // XÓA     interval = setInterval(() => {
  // XÓA       setWaitingTime(prev => {
  // XÓA         if (prev <= 1) {
  // XÓA           setIsWaitingForApproval(false);
  // XÓA           setWaitingTime(0);
  // XÓA           localStorage.removeItem('depositWaitingTime');
  // XÓA           localStorage.removeItem('depositWaitingStart');
  // XÓA           return 0;
  // XÓA         }
  // XÓA         const newTime = prev - 1;
  // XÓA         localStorage.setItem('depositWaitingTime', newTime.toString());
  // XÓA         return newTime;
  // XÓA       });
  // XÓA     }
  // XÓA   };
  // XÓA   return () => {
  // XÓA     if (interval) clearInterval(interval);
  // XÓA   };
  // XÓA }, [isWaitingForApproval, waitingTime]);

  // XÓA Khôi phục trạng thái chờ từ localStorage
  // XÓA useEffect(() => {
  // XÓA   const savedWaitingTime = localStorage.getItem('depositWaitingTime');
  // XÓA   const savedWaitingStart = localStorage.getItem('depositWaitingStart');
  // XÓA   
  // XÓA   if (savedWaitingTime && savedWaitingStart) {
  // XÓA     const startTime = parseInt(savedWaitingStart);
  // XÓA     const currentTime = Date.now();
  // XÓA     const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
  // XÓA     const remainingTime = Math.max(0, parseInt(savedWaitingTime) - elapsedSeconds);
  // XÓA     
  // XÓA     if (remainingTime > 0) {
  // XÓA       setIsWaitingForApproval(true);
  // XÓA       setWaitingTime(remainingTime);
  // XÓA     } else {
  // XÓA       localStorage.removeItem('depositWaitingTime');
  // XÓA       localStorage.removeItem('depositWaitingStart');
  // XÓA     }
  // XÓA   }
  // XÓA }, []);

  // Hàm format số tiền với dấu phẩy
  const formatAmount = (value) => {
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = value.replace(/[^\d]/g, '');
    // Format với dấu phẩy phân cách hàng nghìn
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Hàm chuyển đổi từ format có dấu phẩy về số
  const parseAmount = (formattedValue) => {
    return formattedValue.replace(/[^\d]/g, '');
  };

  // Fetch admin bank info when deposit modal opens
  useEffect(() => {
    if (open && type === 'deposit') {
      const fetchBankInfo = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/bank-info/public`);
          if (response.data && response.data.length > 0) {
            setAdminBankInfo(response.data);
          }
        } catch (error) {
          console.error('Error fetching bank info:', error);
        }
      };
      fetchBankInfo();
    }
  }, [open, type]);

  const handleProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
    }
  };

  const handleConfirmDeposit = async () => {
    if (!proofImage) {
      setError("Vui lòng chọn hình ảnh xác thực");
      return;
    }

    setUploadingProof(true);
    setError("");

    let transactionId = null;

    try {
      // First, create the transaction
      const transactionResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/transactions`, {
        type: 'deposit',
        amount: Number(amount)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      transactionId = transactionResponse.data._id;
      console.log("✅ Transaction created successfully:", transactionId);

      // Then, confirm the deposit with proof image
      const formData = new FormData();
      formData.append('proofImage', proofImage);
      formData.append('transactionId', transactionId);

      const confirmResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/transactions/confirm-deposit`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("✅ Proof uploaded successfully");
      setError(""); // Clear any previous errors
      setSuccess("Xác thực thành công! Admin sẽ kiểm tra và cập nhật số dư của bạn.");
      
      // Trigger immediate status update
      if (onSubmit) {
        onSubmit({ type: 'deposit', amount: Number(amount), transactionId });
      }
      
      setTimeout(() => {
        onClose();
        setStep(1);
        setProofImage(null);
        setTransactionId(null);
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("❌ Lỗi trong quá trình xác thực:", error);
      
      // Xử lý lỗi chi tiết hơn
      if (error.response?.status === 400) {
        // Lỗi validation từ server
        const errorMessage = error.response.data.message || "Dữ liệu không hợp lệ";
        setError(errorMessage);
      } else if (error.response?.status === 404) {
        // Transaction không tồn tại
        setError("Không tìm thấy giao dịch. Vui lòng thử lại.");
      } else if (error.response?.status === 413) {
        // File quá lớn
        setError("File ảnh quá lớn. Vui lòng chọn file nhỏ hơn 5MB.");
      } else if (error.response?.status === 415) {
        // Định dạng file không hợp lệ
        setError("Định dạng file không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP.");
      } else if (error.response?.status >= 500) {
        // Lỗi server
        if (transactionId) {
          // Transaction đã tạo thành công nhưng upload proof thất bại
          setError("Giao dịch đã được tạo nhưng upload ảnh thất bại. Vui lòng liên hệ admin để được hỗ trợ.");
          console.log("⚠️ Transaction created but proof upload failed:", transactionId);
          
          // Tự động rollback transaction
          try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/transactions/${transactionId}/rollback`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            console.log("✅ Transaction rolled back successfully");
            setError("Giao dịch đã được tạo nhưng upload ảnh thất bại. Giao dịch đã được hủy tự động. Vui lòng thử lại.");
          } catch (rollbackError) {
            console.error("❌ Rollback failed:", rollbackError);
            setError("Giao dịch đã được tạo nhưng upload ảnh thất bại. Vui lòng liên hệ admin để được hỗ trợ.");
          }
        } else {
          setError("Lỗi server. Vui lòng thử lại sau.");
        }
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
        // Lỗi kết nối
        if (transactionId) {
          setError("Giao dịch đã được tạo nhưng kết nối bị gián đoạn. Vui lòng kiểm tra lại sau.");
          
          // Tự động rollback transaction
          try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/transactions/${transactionId}/rollback`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            console.log("✅ Transaction rolled back successfully");
            setError("Giao dịch đã được tạo nhưng kết nối bị gián đoạn. Giao dịch đã được hủy tự động. Vui lòng thử lại.");
          } catch (rollbackError) {
            console.error("❌ Rollback failed:", rollbackError);
            setError("Giao dịch đã được tạo nhưng kết nối bị gián đoạn. Vui lòng kiểm tra lại sau.");
          }
        } else {
          setError("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.");
        }
      } else {
        setError("Xác thực thất bại. Vui lòng thử lại.");
      }
    } finally {
      setUploadingProof(false);
    }
  };

  const handleContinue = async () => {
    // Kiểm tra nếu đang trong thời gian chờ
    // XÓA if (type === 'deposit' && isWaitingForApproval) {
    // XÓA   setError(`Vui lòng chờ ${waitingTime} giây nữa trước khi gửi lệnh nạp tiền mới`);
    // XÓA   return;
    // XÓA }

    // Kiểm tra thông tin ngân hàng cho withdraw
    if (type === 'withdraw') {
      const bankAccount = localStorage.getItem('bankAccount');
      const bankName = localStorage.getItem('bankName');
      const bankAccountHolder = localStorage.getItem('bankAccountHolder');
      
      if (!bankAccount || !bankName || !bankAccountHolder) {
        setError("Vui lòng cập nhật thông tin ngân hàng cá nhân trước khi rút tiền");
        setTimeout(() => {
          onClose();
          window.location.href = '/bank-info';
        }, 2000);
        return;
      }
    }

    // Validation for withdrawal
    if (type === 'withdraw') {
      const withdrawAmount = Number(amount);
      if (withdrawAmount < 500000) {
        setError("Số tiền rút phải từ 500,000 VNĐ trở lên");
        return;
      }
      if (withdrawAmount > userBalance) {
        setError("Số tiền rút không được vượt quá số dư hiện tại");
        return;
      }
    } else if (type === 'deposit') {
      const depositAmount = Number(amount);
      if (depositAmount < 100000) {
        setError("Số tiền nạp phải từ 100,000 VNĐ trở lên");
        return;
      }
    }
    
    // For deposit, just move to step 2 without making API call
    if (type === 'deposit') {
      setStep(2); // Show QR codes
      return;
    }
    
    // For withdrawal, make API call and show notification modal
    setLoading(true);
    setError("");
    try {
      const result = await onSubmit({ amount });
      setError("Thành công!");
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
    
    // For withdrawal, make API call as before
    setLoading(true);
    setError("");
    try {
      const result = await onSubmit({ amount });
      setError("Thành công!");
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  
  const isDeposit = type === 'deposit';

  // Step 1: Input Form
  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDeposit ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isDeposit ? (
                <ArrowUpTrayIcon className="w-8 h-8 text-green-600" />
              ) : (
                <ArrowDownTrayIcon className="w-8 h-8 text-red-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isDeposit ? 'Gửi tiền đầu tư' : 'Rút tiền'}
            </h2>
            <p className="text-gray-600">
              {isDeposit ? 'Nạp tiền vào tài khoản để bắt đầu đầu tư' : 'Rút tiền từ tài khoản đầu tư'}
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền (VNĐ)
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={formatAmount(amount)}
                onChange={e => setAmount(parseAmount(e.target.value))} 
                required 
                placeholder="Nhập số tiền..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {isDeposit ? "Số tiền tối thiểu: 100,000 VNĐ" : "Số tiền tối thiểu: 500,000 VNĐ"}
              </p>
            </div>
            


            {error && (
              <div className={`p-3 rounded-lg text-sm flex items-center ${error === "Thành công!"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }`}>
                {error === "Thành công!" ? (
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                )}
                {error}
              </div>
            )}
            
            <div className="flex gap-3">
              <button 
                type="button" 
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" 
                onClick={onClose} 
                disabled={loading}
              >
                Hủy
              </button>
              <button 
                type="button" 
                onClick={handleContinue}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-all ${
                  isDeposit 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                }`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  'Tiếp tục'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: QR Codes for Deposit
  if (step === 2 && type === 'deposit') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8 w-full max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Thông tin chuyển khoản
            </h2>
            <p className="text-gray-600">Sử dụng QR code hoặc thông tin bên dưới để chuyển khoản</p>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              
              {adminBankInfo && adminBankInfo.length > 0 ? (
                <div className="space-y-3">
                  {adminBankInfo.map((bank, index) => (
                    <div key={bank._id} className="border border-green-200 rounded-lg p-3 bg-white">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-green-800">{bank.bankName}</div>
                          <div className="text-sm text-gray-600">Số TK: <span className="font-mono font-semibold">{bank.accountNumber}</span></div>
                          <div className="text-sm text-gray-600">Chủ TK: <span className="font-semibold">{bank.accountHolder}</span></div>
                          {bank.transferContent && (
                            <div className="text-sm text-gray-600 mt-1">
                              Nội dung: <span className="font-semibold text-blue-600">{bank.transferContent}</span>
                            </div>
                          )}
                        </div>
                        
                      </div>
                      {bank.qrCode && (
                          <div className="bg-white p-2 rounded border">
                            <img
                              src={bank.qrCode}
                              alt="QR Code"
                              className="w-[180px] h-[180px] mx-auto"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded" style={{ display: 'none' }}>
                              <QrCodeIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          </div>
                        )}
                      <div className="text-xs text-green-700 bg-green-50 p-2 rounded">
                         
                        {bank.description ? (
                          <>Nội dung chuyển khoản: <span className="font-mono font-semibold">{bank.description}</span></>
                        ) : (
                          <>Nội dung chuyển khoản: <span className="font-mono font-semibold">Tên + SĐT của bạn</span></>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <BuildingLibraryIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <div>Chưa có thông tin ngân hàng</div>
                  <div className="text-sm">Vui lòng liên hệ admin</div>
                </div>
              )}
            </div>

            
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-md"
            >
              Quay lại
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all text-sm md:text-md"
            >
              Đã chuyển khoản
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Proof Upload
  if (step === 3 && type === 'deposit') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Xác thực giao dịch
            </h2>
            <p className="text-gray-600">Vui lòng upload hình ảnh biên lai chuyển khoản</p>
            
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh biên lai *
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleProofUpload}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Chụp ảnh màn hình hoặc chọn file biên lai chuyển khoản
              </p>
            </div>

            {proofImage && (
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium">{proofImage.name}</span>
                  </div>
                  <button
                    onClick={() => setProofImage(null)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" 
                disabled={uploadingProof}
              >
                Quay lại
              </button>
              <button 
                type="button" 
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors" 
                onClick={handleConfirmDeposit}
                disabled={uploadingProof || !proofImage}
              >
                {uploadingProof ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang upload...
                  </div>
                ) : (
                  'Xác thực'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function QuickActions({ showAlert = true, onSuccess, baseUrl }) {
  const [modal, setModal] = useState({ open: false, type: null });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactionNotification, setTransactionNotification] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState({
    hasPendingDeposit: false,
    hasPendingWithdraw: false,
    pendingDeposit: null,
    pendingWithdraw: null
  });
  const [pollingInterval, setPollingInterval] = useState(null);
  const navigate = useNavigate();
  const { user, updateBalance } = useUser();

  const userBalance = user?.balance || 0;
  const isLoggedIn = !!user;

  // Fetch transactions function
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${baseUrl || import.meta.env.VITE_BASE_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  // Fetch transaction status
  const fetchTransactionStatus = async () => {
    try {
      const response = await axios.get(`${baseUrl || import.meta.env.VITE_BASE_URL}/api/transactions/status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      const newStatus = response.data;
      const oldStatus = transactionStatus;
      
      // Kiểm tra nếu có thay đổi trạng thái
      if (
        oldStatus.hasPendingDeposit !== newStatus.hasPendingDeposit ||
        oldStatus.hasPendingWithdraw !== newStatus.hasPendingWithdraw ||
        (oldStatus.pendingDeposit?._id !== newStatus.pendingDeposit?._id) ||
        (oldStatus.pendingWithdraw?._id !== newStatus.pendingWithdraw?._id)
      ) {
        console.log("🔄 Transaction status changed:", { old: oldStatus, new: newStatus });
        
        // Nếu có giao dịch được duyệt, cập nhật balance
        if (
          (oldStatus.hasPendingDeposit && !newStatus.hasPendingDeposit) ||
          (oldStatus.hasPendingWithdraw && !newStatus.hasPendingWithdraw)
        ) {
          // Refresh user balance
          try {
            const userResponse = await axios.get(`${baseUrl || import.meta.env.VITE_BASE_URL}/api/user/profile`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            updateBalance(userResponse.data.balance || 0);
            console.log("✅ Balance updated after transaction approval");
          } catch (err) {
            console.error("❌ Error updating balance:", err);
          }
        }
      }
      
      setTransactionStatus(newStatus);
    } catch (err) {
      console.error('Error fetching transaction status:', err);
    }
  };

  // Start polling for transaction status updates
  const startPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    const interval = setInterval(() => {
      if (isLoggedIn) {
        fetchTransactionStatus();
      }
    }, 3000); // Poll every 3 seconds
    
    setPollingInterval(interval);
  };

  // Stop polling
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  // Check login status and fetch user balance
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!userBalance) {
        axios.get(`${baseUrl || import.meta.env.VITE_BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => updateBalance(res.data.balance || 0)).catch(() => updateBalance(0));
      }
    } else {
      updateBalance(0);
    }
  }, [baseUrl, updateBalance]);

  // Start/stop polling based on login status and pending transactions
  useEffect(() => {
    if (isLoggedIn && (transactionStatus.hasPendingDeposit || transactionStatus.hasPendingWithdraw)) {
      console.log("🚀 Starting polling for transaction updates");
      startPolling();
    } else {
      console.log("⏹️ Stopping polling - no pending transactions");
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isLoggedIn, transactionStatus.hasPendingDeposit, transactionStatus.hasPendingWithdraw]);

  // Fetch transaction status when component mounts
  useEffect(() => {
    if (isLoggedIn) {
      fetchTransactionStatus();
    }
  }, [isLoggedIn]);

  // Khôi phục thông tin ngân hàng từ localStorage
  useEffect(() => {
    const bankAccount = localStorage.getItem('bankAccount');
    const bankName = localStorage.getItem('bankName');
    const bankAccountHolder = localStorage.getItem('bankAccountHolder');
    
    if (bankAccount && bankName && bankAccountHolder) {
      // Thông tin đã có trong localStorage
    } else if (user) {
      // Lưu thông tin từ user context vào localStorage
      localStorage.setItem('bankAccount', user.bankAccount || '');
      localStorage.setItem('bankName', user.bankName || '');
      localStorage.setItem('bankAccountHolder', user.bankAccountHolder || '');
    }
  }, [user]);

  const handleAction = async ({ amount, type, transactionId }) => {
    try {
      // Nếu có transactionId từ deposit, chỉ cần cập nhật trạng thái
      if (transactionId) {
        console.log("🔄 Updating transaction status after deposit:", transactionId);
        await fetchTransactionStatus();
        return;
      }

      const requestData = {
        type: modal.type,
        amount: Number(amount)
      };

      const response = await axios.post(`${baseUrl || import.meta.env.VITE_BASE_URL}/api/transactions`, requestData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      // Cập nhật balance và dispatch event
      if (response.data.user) {
        const newBalance = response.data.user.balance;
        updateBalance(newBalance);
        dispatchUserBalanceChanged(user._id, newBalance);
      }

      await fetchTransactions();
      await fetchTransactionStatus(); // Refresh transaction status
      
      // Chỉ hiện modal thông báo chờ duyệt cho rút tiền
      if (modal.type === 'withdraw') {
        // Lấy thông tin ngân hàng từ user
        const userBankInfo = {
          bankName: user?.bankName || '',
          accountNumber: user?.bankAccount || '',
          accountName: user?.bankAccountHolder || ''
        };
        
        if (response.data.notification) {
          // Cập nhật bankInfo từ user nếu có
          const notificationWithUserBank = {
            ...response.data.notification,
            bankInfo: userBankInfo
          };
          setTransactionNotification(notificationWithUserBank);
          setShowTransactionModal(true);
        } else {
          // Nếu không có notification từ backend, tạo một notification mặc định cho rút tiền
          const defaultNotification = {
            type: 'withdraw',
            title: '💸 Yêu cầu rút tiền đã được tiếp nhận',
            transactionCode: 'WD' + Date.now(),
            amount: Number(amount),
            createdAt: new Date(),
            bankInfo: userBankInfo,
            content: 'Yêu cầu rút tiền của bạn đã được ghi nhận và đang trong quá trình xét duyệt.'
          };
          setTransactionNotification(defaultNotification);
          setShowTransactionModal(true);
        }
        return;
      }
      
      // Chỉ hiện alert thành công cho deposit, rút tiền đã có modal thông báo
      if (showAlert) {
        alert("Giao dịch thành công! Admin sẽ kiểm tra và cập nhật số dư của bạn.");
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("❌ Error in handleAction:", err);
      if (showAlert) {
        alert(err.response?.data?.message || "Lỗi khi thực hiện giao dịch");
      }
    }
  };

  const checkLoginAndExecute = (action) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Kiểm tra thông tin ngân hàng cá nhân cho withdraw
    if (action.toString().includes('withdraw')) {
      const bankAccount = localStorage.getItem('bankAccount');
      const bankName = localStorage.getItem('bankName');
      const bankAccountHolder = localStorage.getItem('bankAccountHolder');
      
      if (!bankAccount || !bankName || !bankAccountHolder) {
        alert('Vui lòng cập nhật thông tin ngân hàng cá nhân trước khi rút tiền');
        navigate('/bank-info');
        return;
      }
    }
    
    action();
  };


  const quickActions = [
    {
      id: 'company',
      title: 'Hồ sơ công ty',
      description: 'Thông tin về công ty',
      icon: UserGroupIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      onClick: () => navigate('/company-profile'),
      disabled: false
    },
    {
      id: 'deposit',
      title: transactionStatus.hasPendingDeposit ? 'Đang chờ duyệt' : 'Gửi tiền đầu tư',
      description: transactionStatus.hasPendingDeposit 
        ? 'Lệnh nạp tiền đang chờ admin duyệt' 
        : 'Nạp tiền vào tài khoản',
      icon: ArrowUpTrayIcon,
      color: transactionStatus.hasPendingDeposit ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600',
      bgColor: transactionStatus.hasPendingDeposit ? 'bg-blue-50 pending-button' : 'bg-green-50',
      iconColor: transactionStatus.hasPendingDeposit ? 'text-blue-600' : 'text-green-600',
      onClick: () => {
        if (transactionStatus.hasPendingDeposit) {
          // Hiện modal thông báo trạng thái chờ duyệt
          const pendingNotification = {
            type: 'deposit',
            title: '💵 Lệnh nạp tiền đang chờ duyệt',
            transactionCode: 'DP' + Date.now(),
            amount: transactionStatus.pendingDeposit?.amount || 0,
            createdAt: transactionStatus.pendingDeposit?.createdAt || new Date(),
            content: 'Lệnh nạp tiền của bạn đang trong quá trình xét duyệt. Vui lòng chờ admin xử lý.',
            status: 'pending'
          };
          setTransactionNotification(pendingNotification);
          setShowTransactionModal(true);
          return;
        }
        checkLoginAndExecute(() => setModal({ open: true, type: 'deposit' }));
      },
      disabled: false // Không disable nút
    },
    {
      id: 'withdraw',
      title: transactionStatus.hasPendingWithdraw ? 'Chờ duyệt' : 'Rút tiền',
      description: transactionStatus.hasPendingWithdraw 
        ? 'Đang chờ admin duyệt' 
        : 'Rút tiền từ tài khoản',
      icon: ArrowDownTrayIcon,
      color: transactionStatus.hasPendingWithdraw ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600',
      bgColor: transactionStatus.hasPendingWithdraw ? 'bg-blue-50 pending-button' : 'bg-red-50',
      iconColor: transactionStatus.hasPendingWithdraw ? 'text-blue-600' : 'text-red-600',
      onClick: () => {
        if (transactionStatus.hasPendingWithdraw) {
          // Lấy thông tin ngân hàng từ user
          const userBankInfo = {
            bankName: user?.bankName || '',
            accountNumber: user?.bankAccount || '',
            accountName: user?.bankAccountHolder || ''
          };
          
          // Hiện modal thông báo trạng thái chờ duyệt
          const pendingNotification = {
            type: 'withdraw',
            title: '💸 Lệnh rút tiền đang chờ duyệt',
            transactionCode: 'WD' + Date.now(),
            amount: transactionStatus.pendingWithdraw?.amount || 0,
            createdAt: transactionStatus.pendingWithdraw?.createdAt || new Date(),
            bankInfo: userBankInfo,
            content: 'Lệnh rút tiền của bạn đang trong quá trình xét duyệt. Vui lòng chờ admin xử lý.',
            status: 'pending'
          };
          setTransactionNotification(pendingNotification);
          setShowTransactionModal(true);
          return;
        }
        checkLoginAndExecute(() => setModal({ open: true, type: 'withdraw' }));
      },
      disabled: false // Không disable nút
    },
    {
      id: 'account',
      title: 'Tài khoản',
      description: 'Xem thông tin tài khoản',
      icon: UserIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      onClick: () => checkLoginAndExecute(() => navigate('/profile')),
      disabled: false
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 max-w-4xl md:max-w-6xl mx-auto mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 my-4">Thao tác nhanh</h2>
        <p className="text-sm md:text-md text-gray-600 max-w-2xl mx-auto">
          Thực hiện các giao dịch nhanh chóng và tiện lợi
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action) => (
          <div 
            key={action.id}
            className="group cursor-pointer"
            onClick={action.onClick}
          >
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:shadow-xl">
              <div className={`w-8 h-8 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${action.bgColor} group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-8 md:h-8 ${action.iconColor}`} />
              </div>
              <h3 className="text-md md:text-xl font-bold mb-2 text-center text-gray-800">{action.title}</h3>
              <p className="text-center text-md md:text-lg text-gray-600">{action.description}</p>
            </div>
          </div>
        ))}
      </div>

      {showAlert && (
        <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl px-6 py-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
            <ExclamationTriangleIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Lưu ý quan trọng</h4>
            <p className="text-yellow-700 text-sm">
              Cán bộ nhân viên nội bộ trong tập đoàn, nhằm thúc đẩy quá trình đầu tư và phát triển bền vững. 
              Mọi giao dịch đều được bảo mật và minh bạch.
            </p>
          </div>
        </div>
      )}

      {/* Attendance Banner */}
      <div className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-6 py-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-blue-800 mb-1">Điểm Danh Nhận Thưởng</h4>
         
          <button 
            onClick={() => checkLoginAndExecute(() => navigate('/attendance'))}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Điểm Danh Ngay
          </button>
        </div>
      </div>

      {/* Thông báo đang chờ admin duyệt */}
      {isLoggedIn && (transactionStatus.hasPendingDeposit || transactionStatus.hasPendingWithdraw) && (
        <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl px-6 py-4 mb-6">
          <CheckCircleIcon className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-800 mb-1">Đang chờ admin duyệt</h4>
            <p className="text-yellow-700 text-sm">
              {transactionStatus.hasPendingDeposit && transactionStatus.hasPendingWithdraw 
                ? 'Bạn có lệnh nạp tiền và rút tiền đang chờ duyệt. Vui lòng chờ admin xử lý trước khi tạo lệnh mới.'
                : transactionStatus.hasPendingDeposit
                ? 'Bạn có lệnh nạp tiền đang chờ duyệt. Vui lòng chờ admin xử lý trước khi tạo lệnh mới.'
                : 'Bạn có lệnh rút tiền đang chờ duyệt. Vui lòng chờ admin xử lý trước khi tạo lệnh mới.'
              }
            </p>
          </div>
        </div>
      )}

      <ActionModal 
        open={modal.open} 
        onClose={() => setModal({ open: false, type: null })} 
        type={modal.type} 
        onSubmit={handleAction}
        userBalance={userBalance}
      />

      {/* Transaction Notification Modal */}
      <TransactionNotificationModal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setTransactionNotification(null);
        }}
        notification={transactionNotification}
      />
    </div>
  );
}