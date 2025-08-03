import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useBankInfoStore } from "../store/bankInfoStore";
import { dispatchUserBalanceChanged } from "../utils/events";
import { useUser } from "../contexts/UserContext";
import { MdNavigateNext } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { TbPigMoney } from "react-icons/tb";
import { FaMoneyBillWave } from "react-icons/fa";
import { GiCartwheel } from "react-icons/gi";
import { FaIdCard } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import AttendanceCard from "../components/AttendanceCard";
import TransactionNotificationModal from "../components/TransactionNotificationModal";
import AvatarUploadModal from "../components/AvatarUploadModal";
import {
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  ChartBarIcon, 
  DocumentTextIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  UsersIcon,
  CreditCardIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  PaperClipIcon,
  BuildingLibraryIcon,
  QrCodeIcon,
  GiftIcon,
  BellIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';

function ActionModal({ open, onClose, onSubmit, type, userBalance, adminBankInfo = [] }) {
  const { user } = useUser();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1: Input, 2: QR Codes, 3: Proof Upload
  const [transactionId, setTransactionId] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const bankAccount = useBankInfoStore(state => state.bankAccount);
  const bankName = useBankInfoStore(state => state.bankName);
  const bankAccountHolder = useBankInfoStore(state => state.bankAccountHolder);

  console.log(adminBankInfo);
  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setStep(1);
      setAmount("");
      setMessage("");
      setTransactionId(null);
      setProofImage(null);
    }
  }, [open]);

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

  const handleProofUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProofImage(file);
  };

  const handleConfirmDeposit = async () => {
    if (!proofImage) {
      setMessage("Vui lòng chọn hình ảnh xác thực");
      return;
    }

    setUploadingProof(true);
    setMessage("");

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

      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/transactions/confirm-deposit`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("✅ Proof uploaded successfully");

      // Cập nhật balance nếu có thông tin user
      if (transactionResponse.data.user && user) {
        const newBalance = transactionResponse.data.user.balance;
        dispatchUserBalanceChanged(user._id, newBalance);
      }

      setMessage("Xác thực thành công! Admin sẽ kiểm tra và cập nhật số dư của bạn.");
      
      // Trigger immediate status update
      if (onSubmit) {
        onSubmit({ type: 'deposit', amount: Number(amount), transactionId });
      }
      
      setTimeout(() => {
        onClose();
        setStep(1);
        setProofImage(null);
        setTransactionId(null);
      }, 2000);
    } catch (error) {
      console.error("❌ Lỗi trong quá trình xác thực:", error);
      
      // Xử lý lỗi chi tiết hơn
      if (error.response?.status === 400) {
        // Lỗi validation từ server
        const errorMessage = error.response.data.message || "Dữ liệu không hợp lệ";
        setMessage(errorMessage);
      } else if (error.response?.status === 404) {
        // Transaction không tồn tại
        setMessage("Không tìm thấy giao dịch. Vui lòng thử lại.");
      } else if (error.response?.status === 413) {
        // File quá lớn
        setMessage("File ảnh quá lớn. Vui lòng chọn file nhỏ hơn 5MB.");
      } else if (error.response?.status === 415) {
        // Định dạng file không hợp lệ
        setMessage("Định dạng file không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP.");
      } else if (error.response?.status >= 500) {
        // Lỗi server
        if (transactionId) {
          // Transaction đã tạo thành công nhưng upload proof thất bại
          setMessage("Giao dịch đã được tạo nhưng upload ảnh thất bại. Vui lòng liên hệ admin để được hỗ trợ.");
          console.log("⚠️ Transaction created but proof upload failed:", transactionId);
          
          // Tự động rollback transaction
          try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/transactions/${transactionId}/rollback`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            console.log("✅ Transaction rolled back successfully");
            setMessage("Giao dịch đã được tạo nhưng upload ảnh thất bại. Giao dịch đã được hủy tự động. Vui lòng thử lại.");
          } catch (rollbackError) {
            console.error("❌ Rollback failed:", rollbackError);
            setMessage("Giao dịch đã được tạo nhưng upload ảnh thất bại. Vui lòng liên hệ admin để được hỗ trợ.");
          }
        } else {
          setMessage("Lỗi server. Vui lòng thử lại sau.");
        }
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
        // Lỗi kết nối
        if (transactionId) {
          setMessage("Giao dịch đã được tạo nhưng kết nối bị gián đoạn. Vui lòng kiểm tra lại sau.");
          
          // Tự động rollback transaction
          try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/transactions/${transactionId}/rollback`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            console.log("✅ Transaction rolled back successfully");
            setMessage("Giao dịch đã được tạo nhưng kết nối bị gián đoạn. Giao dịch đã được hủy tự động. Vui lòng thử lại.");
          } catch (rollbackError) {
            console.error("❌ Rollback failed:", rollbackError);
            setMessage("Giao dịch đã được tạo nhưng kết nối bị gián đoạn. Vui lòng kiểm tra lại sau.");
          }
        } else {
          setMessage("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.");
        }
      } else {
        // Lỗi khác
        const errorMessage = error.response?.data?.message || error.message || "Xác thực thất bại";
        setMessage(errorMessage);
      }
    } finally {
      setUploadingProof(false);
    }
  };

  const handleContinue = async () => {
    // Kiểm tra nếu đang trong thời gian chờ
    if (type === "withdraw" && (!bankAccount || !bankName || !bankAccountHolder)) {
      setMessage("Vui lòng nhập đầy đủ thông tin ngân hàng trước khi rút tiền!");
      setTimeout(() => {
        onClose();
        navigate('/bank-info');
      }, 2000);
      return;
    }

    // Validation for amount
    const numericAmount = Number(amount);
    if (type === "withdraw") {
      if (numericAmount < 500000) {
        setMessage("Số tiền rút phải từ 500,000 VNĐ trở lên");
        return;
      }
      if (numericAmount > userBalance) {
        setMessage("Số tiền rút không được vượt quá số dư hiện tại");
        return;
      }
    } else if (type === "deposit") {
      if (numericAmount < 100000) {
        setMessage("Số tiền nạp phải từ 100,000 VNĐ trở lên");
        return;
      }
    }

    // For deposit, just move to step 2 without making API call
    if (type === "deposit") {
      setStep(2); // Show QR codes
      return;
    }

    // For withdrawal, make API call as before
    setLoading(true);
    setMessage("");
    try {
      const result = await onSubmit({ amount });
      setMessage("Thành công!");
      setTimeout(onClose, 1200);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // Step 1: Input Form
  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              {type === "deposit" ? (
                <ArrowDownIcon className="w-8 h-8 text-white" />
              ) : (
                <ArrowUpIcon className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {type === "deposit" ? "Nạp tiền" : "Rút tiền"}
            </h2>
            <p className="text-gray-600">Nhập thông tin để tiếp tục</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền (VND)
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="text"
                placeholder="Nhập số tiền"
                value={formatAmount(amount)}
                onChange={e => setAmount(parseAmount(e.target.value))}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {type === "deposit" ? "Số tiền tối thiểu: 100,000 VNĐ" : "Số tiền tối thiểu: 500,000 VNĐ"}
              </p>
            </div>



            {message && (
              <div className={`p-3 rounded-lg text-sm flex items-center ${message === "Thành công!"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }`}>
                {message === "Thành công!" ? (
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                ) : (
                  <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                )}
                {message}
              </div>
            )}

          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              Huỷ
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className={`flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Tiếp tục"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: QR Codes for Deposit
  if (step === 2 && type === "deposit") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl mx-auto">
          <div className="text-center mb-6">
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Thông tin chuyển khoản
            </h2>
            <p className="text-gray-600">Sử dụng QR code hoặc thông tin bên dưới để chuyển khoản</p>
            
            
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              
              {adminBankInfo.length > 0 ? (
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
  if (step === 3 && type === "deposit") {
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
            
            {/* Hiển thị số tiền đã chuyển */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Số tiền đã chuyển:</div>
              <div className="text-lg font-bold text-green-800">{formatAmount(amount)} VNĐ</div>
            </div>
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
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Chụp ảnh màn hình hoặc chọn file biên lai chuyển khoản
              </p>
            </div>

            {proofImage && (
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentTextIcon className="w-5 h-5 text-green-600 mr-2" />
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

            {message && (
              <div className={`p-3 rounded-lg text-sm flex items-center ${
                message.includes('thành công') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message.includes('thành công') ? (
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                ) : (
                  <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                )}
                {message}
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
                onClick={handleConfirmDeposit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50"
                disabled={uploadingProof || !proofImage}
              >
                {uploadingProof ? "Đang xử lý..." : "Xác thực"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function Profile() {
  const { user } = useUser();
  const [form, setForm] = useState({
    name: "",
    email: "",
    bankAccount: "",
    bankName: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    withdrawable: 0,
    withdrawing: 0,
  });
  const [incomeStats, setIncomeStats] = useState({
    totalIncome: 0,
    monthlyIncome: [],
    recentInterests: [],
    totalTransactions: 0
  });
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState({ open: false, type: "deposit" });
  const setBankInfo = useBankInfoStore(state => state.setBankInfo);
  const [investments, setInvestments] = useState([]);
  const [interests, setInterests] = useState([]);
  const [adminBankInfo, setAdminBankInfo] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState({
    hasPendingDeposit: false,
    hasPendingWithdraw: false,
    pendingDeposit: null,
    pendingWithdraw: null
  });
  const [transactionNotification, setTransactionNotification] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Fetch transaction status
  const fetchTransactionStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/transactions/status`, {
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
        console.log("🔄 Transaction status changed in Profile:", { old: oldStatus, new: newStatus });
        
        // Nếu có giao dịch được duyệt, cập nhật balance
        if (
          (oldStatus.hasPendingDeposit && !newStatus.hasPendingDeposit) ||
          (oldStatus.hasPendingWithdraw && !newStatus.hasPendingWithdraw)
        ) {
          // Refresh user data
          try {
            const userResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/profile`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const userData = userResponse.data;
            setForm(prev => ({
              ...prev,
              balance: userData.balance || 0
            }));
            setStats(prev => ({
              ...prev,
              balance: Math.round(userData.balance || 0)
            }));
            console.log("✅ Profile balance updated after transaction approval");
          } catch (err) {
            console.error("❌ Error updating profile balance:", err);
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
      if (user) {
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

  // Start/stop polling based on pending transactions
  useEffect(() => {
    if (user && (transactionStatus.hasPendingDeposit || transactionStatus.hasPendingWithdraw)) {
      console.log("🚀 Starting polling for transaction updates in Profile");
      startPolling();
    } else {
      console.log("⏹️ Stopping polling in Profile - no pending transactions");
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [user, transactionStatus.hasPendingDeposit, transactionStatus.hasPendingWithdraw]);

  // Fetch transaction status when component mounts
  useEffect(() => {
    if (user) {
      fetchTransactionStatus();
    }
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          bankAccount: res.data.bankAccount || "",
          bankName: res.data.bankName || "",
          bankAccountHolder: res.data.bankAccountHolder || "",
          avatar: res.data.avatar || "",
        });
        setStats({
          balance: Math.round(res.data.balance || 0),
          income: Math.round(res.data.income || 0),
          withdrawable: Math.round(res.data.withdrawable || 0),
          withdrawing: Math.round(res.data.withdrawing || 0),
        });
        setBankInfo({ 
          bankAccount: res.data.bankAccount || "", 
          bankName: res.data.bankName || "",
          bankAccountHolder: res.data.bankAccountHolder || ""
        });
      } catch (err) {
        setMessage("Không thể tải thông tin cá nhân");
      }
    };
    fetchProfile();

    const token = localStorage.getItem("token");
    if (token) {
      // Lấy thông tin đầu tư
      axios.get(`${import.meta.env.VITE_BASE_URL}/api/investments/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setInvestments(res.data)).catch(() => setInvestments([]));

      // Lấy thống kê thu nhập chi tiết
      axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/income-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        setIncomeStats(res.data);
        setInterests(res.data.recentInterests);
      }).catch(() => {
        setIncomeStats({
          totalIncome: 0,
          monthlyIncome: [],
          recentInterests: [],
          totalTransactions: 0
        });
        setInterests([]);
      });
    }

    // Lấy thông tin ngân hàng từ admin
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/bank-info/public`)
      .then(res => setAdminBankInfo(res.data))
      .catch(() => setAdminBankInfo([]));

    // Lấy trạng thái lệnh hiện tại
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/transactions/status`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setTransactionStatus(res.data)).catch(() => setTransactionStatus({
      hasPendingDeposit: false,
      hasPendingWithdraw: false,
      pendingDeposit: null,
      pendingWithdraw: null
    }));
  }, []);

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

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === "bankAccount" || name === "bankName" || name === "bankAccountHolder") {
      setBankInfo({ ...form, [name]: value });
    }
  };


  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // Chỉ gửi những trường cần thiết
      const updateData = {
        name: form.name,
        bankAccount: form.bankAccount,
        bankName: form.bankName,
        bankAccountHolder: form.bankAccountHolder
      };

      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/profile`, updateData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log('✅ Update response:', response.data);
      setMessage("Cập nhật thành công!");
    } catch (err) {
      console.error('❌ Update error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async ({ amount, type, transactionId }) => {
    // Nếu có transactionId từ deposit, chỉ cần cập nhật trạng thái
    if (transactionId) {
      console.log("🔄 Updating transaction status after deposit:", transactionId);
      const statusRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/transactions/status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactionStatus(statusRes.data);
      return;
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/transactions`, {
      type: modal.type,
      amount: Number(amount)
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    
    // Cập nhật balance và dispatch event
    if (response.data.user) {
      const newBalance = response.data.user.balance;
      setForm(f => ({ ...f, balance: Math.round(newBalance) }));
      setStats(s => ({ ...s, balance: Math.round(newBalance) }));
      dispatchUserBalanceChanged(user._id, newBalance);
    }
    
    // Refresh transaction status after creating transaction
    const statusRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/transactions/status`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setTransactionStatus(statusRes.data);
    
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
      return; // IMPORTANT: Stop here for withdrawal to only show modal
    }
    
    if (modal.type === "deposit") {
      return { transactionId: response.data._id };
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Hàm mở modal deposit
  const openDepositModal = () => {
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
    setModal({ open: true, type: "deposit" });
  };

  // Hàm mở modal withdraw
  const handleAvatarUpdate = (newAvatar) => {
    setForm(prev => ({ ...prev, avatar: newAvatar }));
  };

  const openWithdrawModal = () => {
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
    
    // Kiểm tra thông tin ngân hàng từ user thay vì localStorage
    if (!user?.bankAccount || !user?.bankName || !user?.bankAccountHolder) {
      alert('Vui lòng cập nhật thông tin ngân hàng cá nhân trước khi rút tiền');
      navigate('/bank-info');
      return;
    }
    
    setModal({ open: true, type: "withdraw" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white hidden md:block rounded-xl shadow-lg p-2 md:p-4 mb-4">
            <div className="flex flex-col items-center md:items-start gap-6">
              {/* User Avatar and Info */}
              <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="relative group"
                  >
                    {form.avatar ? (
                      <img 
                        src={form.avatar} 
                        alt="Avatar" 
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-blue-500 group-hover:border-blue-600 transition-colors"
                      />
                    ) : (
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-500 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <UsersIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all">
                      <CameraIcon className="w-4 h-4 md:w-5 md:h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                  <div className="flex flex-col items-start gap-1">
                    <div className="text-md md:text-xl font-bold text-blue-800">{form.name}</div>
                    <div className="text-sm md:text-md text-gray-600">{form.email}</div>
                    <div className="text-md md:text-xl font-bold text-blue-800">Số dư: {stats.balance?.toLocaleString()} đ</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <button 
                    onClick={openDepositModal} 
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-md ${
                      transactionStatus.hasPendingDeposit
                        ? 'bg-blue-500 text-white hover:bg-blue-600 pending-button'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {transactionStatus.hasPendingDeposit ? 'Đang chờ duyệt' : 'Nạp tiền'}
                  </button>

                  <button 
                    onClick={openWithdrawModal} 
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-md ${
                      transactionStatus.hasPendingWithdraw
                        ? 'bg-blue-500 text-white hover:bg-blue-600 pending-button'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                    }`}
                  >
                    {transactionStatus.hasPendingWithdraw ? 'Đang chờ duyệt' : 'Rút tiền'}
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-all flex items-center gap-2 text-sm md:text-md"
                  >
                    <IoIosLogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                <div className="border border-blue-500 bg-blue-500 text-white rounded-lg p-4 text-center">
                  <BanknotesIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
                  <div className="text-xs md:text-sm opacity-90">Số tiền nạp</div>
                  <div className="text-md md:text-xl font-bold">{stats.balance?.toLocaleString()} đ</div>
                </div>
                <div className="border border-green-500 bg-green-500 text-white rounded-lg p-4 text-center">
                  <ChartBarIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
                  <div className="text-xs md:text-sm opacity-90">Lợi nhuận</div>
                  <div className="text-md md:text-xl font-bold">{stats.income?.toLocaleString()} đ</div>
                </div>
                <div className="border border-purple-500 bg-purple-500 text-white rounded-lg p-4 text-center">
                  <ArrowUpIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
                  <div className="text-xs md:text-sm opacity-90">Số tiền đã rút</div>
                  <div className="text-md md:text-xl font-bold">{stats.withdrawing?.toLocaleString()} đ</div>
                </div>
                <div className="border border-orange-500 bg-orange-500 text-white rounded-lg p-4 text-center">
                  <ClockIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
                  <div className="text-xs md:text-sm opacity-90">Tổng doanh thu</div>
                  <div className="text-md md:text-xl font-bold">{stats.withdrawing?.toLocaleString()} đ</div>
                </div>

              </div>
              
              {/* Promotion Info */}
              {/* <div className="w-full bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <GiftIcon className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">Khuyến mãi thành viên mới</h3>
                </div>
                <div className="text-sm text-green-700">
                  <p className="mb-2">
                    🎉 Chào mừng bạn đến với JBS Invest! 
                    Thành viên mới sẽ nhận được khuyến mãi đặc biệt từ hệ thống.
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">200k - 800k</div>
                      <div className="text-xs text-green-600">Khuyến mãi tự động</div>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-green-600">
                    Số tiền khuyến mãi sẽ được tự động cộng vào tài khoản khi bạn đăng ký thành công.
                  </p>
                </div>
              </div> */}
              
              {/* Attendance Card for Desktop */}
              <div className="w-full">
                <AttendanceCard />
              </div>
            </div>
          </div>
          {/* Mobile Links */}
          <div className="md:hidden bg-white rounded-xl shadow-lg p-2 md:p-4 mb-4 flex flex-col gap-2">
                
              <Link to="/account" className="bg-white border text-blue-500 border-blue-500 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center w-full flex-col justify-start gap-2">
                    <div className="flex justify-between w-full items-center gap-2">
                      <div className="flex flex-col items-start justify-start text-blue-500">
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => setShowAvatarModal(true)}
                              className="relative group"
                            >
                              {form.avatar ? (
                                <img 
                                  src={form.avatar} 
                                  alt="Avatar" 
                                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 group-hover:border-blue-600 transition-colors"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                  <UsersIcon className="w-6 h-6 text-white" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all">
                                <CameraIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </button>
                          </div>
                          <div className="flex flex-col items-start justify-start text-blue-500">
                            <span className="text-xs md:text-lg font-bold">Họ và tên: {form.name}</span>
                            <span className="text-xs md:text-lg font-bold">{form.email}</span>
                          </div>
                        </div>
                        
                      </div>
                      <MdNavigateNext className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                    </div>
                  </div>
                </div>
              </Link>
               
              <div className="grid grid-cols-2 gap-2 w-full justify-between">
                <Link to="/bank-info" className="bg-white border text-green-500 border-green-500 rounded-lg p-2 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-start gap-2">
                      <div className="flex items-center justify-center w-10 h-10">
                        <CreditCardIcon className="w-8 h-8 mx-auto" />
                      </div>
                      <div className="flex flex-col items-start justify-start text-green-500">
                        <span className="text-xs md:text-lg font-bold">Số dư tài khoản</span>
                        <span className="text-xs md:text-sm font-bold">{stats.balance?.toLocaleString()} đ</span>
                      </div>
                    </div>
                    
                  </div>
                </Link>
                {/* Lợi nhuận */}
                <div className="flex flex-col items-center justify-center border-green-500 border rounded-lg p-2">
                  <div className="flex items-start justify-start flex-col w-full">
                    <div className="flex items-center justify-center gap-2">
                      <ChartBarIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto text-green-500" />
                      <div className="flex flex-col items-start justify-start text-green-500">
                        <span className="text-xs md:text-lg font-bold text-green-500">Lợi nhuận: </span>
                        <span className="text-xs md:text-lg font-bold text-green-500">{stats.income?.toLocaleString()} đ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Xác minh tài khoản */}
              <Link to="/identity-verification" className="bg-white border text-blue-500 border-blue-500 rounded-lg p-2 flex items-center justify-between w-full">
                <div className="flex items-center justify-start gap-2">
                  <div className="flex items-center justify-center w-10 h-10">
                    <FaIdCard className="w-8 h-8 mx-auto" />
                  </div>
                  <div className="flex flex-col items-start justify-start text-blue-500">
                    <span className="text-xs md:text-lg font-bold">Xác minh tài khoản</span>
                    <span className="text-xs md:text-sm font-bold">{form.email}</span>
                  </div>
                </div>
                <MdNavigateNext className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              </Link>
             

              <div className="grid grid-cols-2 gap-2 w-full justify-between">
                <button 
                  onClick={openDepositModal} 
                  className={`border rounded-lg p-4 flex flex-col items-center justify-center w-full transition-all duration-300 ${
                    transactionStatus.hasPendingDeposit
                      ? 'bg-green-500 text-white border-green-500 hover:bg-green-600 hover:scale-105 pending-button'
                      : 'bg-green-500 text-white border-green-500 hover:bg-green-600 hover:scale-105'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-start gap-2">
                      <TbPigMoney className={`w-6 h-6 md:w-8 md:h-8 mx-auto ${transactionStatus.hasPendingDeposit ? 'text-white' : 'text-white'}`} />
                      <span className={`text-xs md:text-lg font-bold ${transactionStatus.hasPendingDeposit ? 'text-white' : 'text-white'}`}>
                        {transactionStatus.hasPendingDeposit ? 'Đang chờ duyệt' : 'Nạp tiền'}
                      </span>
                    </div>
                  </div>
                </button>
                <button 
                  onClick={openWithdrawModal} 
                  className={`border rounded-lg p-4 flex flex-col items-center justify-center w-full transition-all duration-300 ${
                    transactionStatus.hasPendingWithdraw
                      ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:scale-105 pending-button'
                      : 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:scale-105'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-start gap-2">
                      <FaMoneyBillWave className={`w-6 h-6 md:w-8 md:h-8 mx-auto ${transactionStatus.hasPendingWithdraw ? 'text-white' : 'text-white'}`} />
                      <span className={`text-xs md:text-lg font-bold ${transactionStatus.hasPendingWithdraw ? 'text-white' : 'text-white'}`}>
                        {transactionStatus.hasPendingWithdraw ? 'Đang chờ duyệt' : 'Rút tiền'}
                      </span>
                    </div>
                  </div>
                </button>
                <Link to='/rewards' className="bg-gradient-to-r from-blue-500 to-blue-600 border text-white border-blue-500 rounded-lg p-4 flex items-center justify-center hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-start gap-2 w-full">
                    <GiftIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    <span className="text-xs md:text-lg font-bold text-white">Phần thưởng</span>
                  </div>
                </Link>
                  <Link to="/referral-info" className="bg-gradient-to-r from-blue-500 to-blue-600 border text-white border-blue-500 rounded-lg p-4 flex items-center justify-center hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-start gap-2 w-full">
                    <FaUserFriends className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    <span className="text-xs md:text-lg font-bold text-white">Mời bạn</span>
                  </div>
                </Link>
                <AttendanceCard />
                
                <Link to="/lucky-wheel" className=" border bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:bg-blue-600 hover:text-white  border-blue-200 rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-start gap-2">
                      <GiCartwheel className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
                      <span className="text-xs md:text-lg font-bold text-white">Vòng quay may mắn</span>
                    </div>
                  </div>
                </Link>

              </div>
               
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg p-0 md:p-4 mb-4 md:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-0 md:gap-2 text-center">
              <Link to="/account" className="bg-white border text-blue-500 border-blue-200 rounded-t-lg md:rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center justify-start gap-2">
                  <UsersIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
                  <span className="text-xs md:text-lg font-bold">Thông tin cá nhân</span>
                </div>
                <MdNavigateNext className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              </Link>
              <Link to="/bank-info" className="bg-white border text-blue-500 border-blue-200 rounded-none md:rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center justify-start gap-2">
                  <BanknotesIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
                  <span className="text-xs md:text-lg font-bold">Thông tin ngân hàng</span>
                </div>
                <MdNavigateNext className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              </Link>
              <Link to="/investment-history" className="bg-white border text-blue-500 border-blue-200 rounded-none md:rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center justify-start gap-2">
                  <ChartBarIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
                  <span className="text-xs md:text-lg font-bold">Lịch sử gói đầu tư</span>
                </div>
                <MdNavigateNext className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              </Link>
             
              <Link to="/withdrawal-notifications" className="bg-white border text-blue-500 border-blue-200 rounded-none md:rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center justify-start gap-2">
                  <BanknotesIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
                  <span className="text-xs md:text-lg font-bold">Lịch sử nạp rút</span>
                </div>
                <MdNavigateNext className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              </Link>
              <Link to="/referral-info" className="bg-white border text-blue-500 border-blue-200 rounded-none md:rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center justify-start gap-2">
                  <FaUserFriends className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
                  <span className="text-xs md:text-lg font-bold">Hệ thống giới thiệu</span>
                </div>
                <MdNavigateNext className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              </Link>
              <Link to="/about" className="bg-white border text-blue-500 border-blue-200 rounded-none md:rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center justify-start gap-2">
                  <InformationCircleIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
                  <span className="text-xs md:text-lg font-bold">Về chúng tôi</span>
                </div>
                <MdNavigateNext className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              </Link>
              <Link to="/packages" className="bg-white border text-blue-500 border-blue-200 rounded-none md:rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center justify-start gap-2">
                  <PaperClipIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
                  <span className="text-xs md:text-lg font-bold">Gói đầu tư</span>
                </div>
                <MdNavigateNext className="w-6 h-6 md:w-8 md:h-8 text-blue-500" /> 
              </Link>
              <Link to="/quick-actions" className="bg-white border text-blue-500 border-blue-200 rounded-none md:rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center justify-start gap-2">
                  <ArrowPathIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
                  <span className="text-xs md:text-lg font-bold">Thao tác nhanh</span>
                </div>
                <MdNavigateNext className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />       
              </Link>
              <div   onClick={handleLogout} className="bg-white border text-blue-500 border-blue-200 rounded-none md:rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center justify-start gap-2">
                  <IoIosLogOut className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
                  <span className="text-xs md:text-lg font-bold">Đăng xuất</span>
                </div>
                <MdNavigateNext className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />       
              </div>
            </div>
          </div>
        </div>
      </div>

      <ActionModal
        open={modal.open}
        onClose={() => setModal({ open: false, type: "deposit" })}
        onSubmit={handleAction}
        type={modal.type}
        userBalance={stats.balance}
        adminBankInfo={adminBankInfo}
      />
      
      <TransactionNotificationModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        notification={transactionNotification}
      />
      
      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatar={form.avatar}
        onAvatarUpdate={handleAvatarUpdate}
      />
    </div>
  );
} 