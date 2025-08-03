import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { useUser } from "../contexts/UserContext";
import { dispatchUserLoggedIn } from "../utils/events";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");
  
  // Referral validation states
  const [referralValidating, setReferralValidating] = useState(false);
  const [referralValidation, setReferralValidation] = useState(null);
  
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const [searchParams] = useSearchParams();

  // Tự động điền email giới thiệu từ URL parameter
  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) {
      setReferralCode(refParam.toLowerCase());
    }
  }, [searchParams]);

  // Validate referral code when it changes
  useEffect(() => {
    const validateReferralCode = async () => {
      if (!referralCode || !referralCode.trim()) {
        setReferralValidation(null);
        return;
      }

      setReferralValidating(true);
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/check-referral`, {
          referralCode: referralCode.trim()
        });
        setReferralValidation({
          valid: true,
          referrerName: response.data.referrerName,
          message: response.data.message
        });
      } catch (err) {
        setReferralValidation({
          valid: false,
          message: err.response?.data?.message || 'Email không hợp lệ'
        });
      } finally {
        setReferralValidating(false);
      }
    };

    // Debounce validation
    const timeoutId = setTimeout(validateReferralCode, 500);
    return () => clearTimeout(timeoutId);
  }, [referralCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, { 
        name, 
        email, 
        password,
        phone: phone.trim() || undefined,
        referralCode: referralCode.trim() || undefined
      });
      setSuccess("Đăng ký thành công! Đang đăng nhập...");
      
      // Tự động đăng nhập sau khi đăng ký
      setTimeout(async () => {
        try {
          const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, { email, password });
          localStorage.setItem("token", res.data.token);
          setSuccess("Đăng nhập thành công! Đang chuyển hướng...");
          // Cập nhật state user trước khi chuyển hướng
          await refreshUser();
          // Dispatch event để thông báo đăng nhập thành công
          if (res.data.user) {
            dispatchUserLoggedIn(res.data.user);
          }
          setTimeout(() => {
            navigate("/");
          }, 100);
        } catch (loginErr) {
          setError("Đăng ký thành công nhưng đăng nhập thất bại. Vui lòng đăng nhập thủ công.");
        }
      }, 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo và Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tạo tài khoản mới</h1>
          <p className="text-gray-600">Tham gia cùng chúng tôi để bắt đầu đầu tư</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                  placeholder="Họ và tên"
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                  placeholder="Email"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                  placeholder="Số điện thoại"
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                  placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Referral Code Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã giới thiệu <span className="text-gray-500 text-xs">(Email người giới thiệu)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    referralValidation?.valid === true 
                      ? 'border-green-300 focus:ring-green-500' 
                      : referralValidation?.valid === false 
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Email người giới thiệu (nếu có)"
                  value={referralCode} 
                  onChange={e => setReferralCode(e.target.value.toLowerCase())} 
                />
                {referralValidating && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              
              {/* Validation Messages */}
              {referralValidation?.valid === true && (
                <div className="flex items-center p-2 rounded-lg bg-green-50 text-green-700 border border-green-200 mt-2">
                  <CheckCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">
                    ✅ {referralValidation.referrerName} - {referralValidation.message}
                  </span>
                </div>
              )}
              
              {referralValidation?.valid === false && (
                <div className="flex items-center p-2 rounded-lg bg-red-50 text-red-700 border border-red-200 mt-2">
                  <ExclamationCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">
                    ❌ {referralValidation.message}
                  </span>
                </div>
              )}
              
              {!referralValidation && (
                <p className="text-xs text-gray-500 mt-1">
                  Nhập email người giới thiệu để nhận thưởng 5% cho lần nạp đầu tiên
                </p>
              )}
            </div>

            

            {/* Error Message */}
            {error && (
              <div className="flex items-center p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
                <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center p-3 rounded-lg bg-green-50 text-green-700 border border-green-200">
                <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang đăng ký...
                </div>
              ) : (
                "Đăng ký tài khoản"
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <div className="text-gray-600 text-sm">
              Đã có tài khoản?{" "}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                Điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                Chính sách bảo mật
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} JBS. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </div>
  );
} 