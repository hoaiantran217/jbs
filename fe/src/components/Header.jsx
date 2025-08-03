import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { images } from '../assets/images'
import { useUser } from '../contexts/UserContext'
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  BanknotesIcon,
  HomeIcon,
  FolderIcon,
  PhoneIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  StarIcon,
  GiftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { IoIosLogOut } from 'react-icons/io'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [balanceAnimation, setBalanceAnimation] = useState(false);
  const { user, refreshUser } = useUser();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Animation khi balance thay đổi
  useEffect(() => {
    if (user?.balance !== undefined) {
      setBalanceAnimation(true);
      const timer = setTimeout(() => setBalanceAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [user?.balance]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <img src={images.logo} alt="JBS" className="w-8 h-8 object-contain" />
          </div>
          <div className="hidden md:block">
            <div className="font-bold text-lg tracking-wide">JBS</div>
            <div className="text-xs opacity-90">Đầu tư thông minh</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm font-medium"
          >
            <HomeIcon className="w-4 h-4" />
            Trang chủ
          </Link>
          <Link
            to="/packages"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm font-medium"
          >
            <FolderIcon className="w-4 h-4" />
            Gói đầu tư
          </Link>
          <Link
            to="/about"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm font-medium"
          >
            <InformationCircleIcon className="w-4 h-4" />
            Về chúng tôi
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm font-medium"
          >
            <PhoneIcon className="w-4 h-4" />
            Liên hệ
          </Link>
          <Link
            to="/reviews"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm font-medium"
          >
            <StarIcon className="w-4 h-4" />
            Đánh giá
          </Link>
          <Link
            to="/rewards"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm font-medium"
          >
            <GiftIcon className="w-4 h-4" />
            Quà tặng
          </Link>
          <Link
            to="/lucky-wheel"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm font-medium"
          >
            <SparklesIcon className="w-4 h-4" />
            Vòng quay
          </Link>
        </nav>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Balance Display with Refresh Button */}
              <div className={`hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 transition-all duration-300 ${
                balanceAnimation ? 'bg-green-500/20 border-green-300 scale-105' : ''
              }`}>
                <BanknotesIcon className="w-4 h-4" />
                <span className={`text-sm font-medium transition-all duration-300 ${
                  balanceAnimation ? 'text-green-200 font-bold' : ''
                }`}>
                  {user.balance?.toLocaleString()} đ
                </span>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="ml-2 p-1 hover:bg-white/20 rounded transition-all duration-200 disabled:opacity-50"
                  title="Làm mới số dư"
                >
                  <ArrowPathIcon className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* User Profile */}
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                <UserIcon className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:block px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="hidden md:block bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all duration-200 shadow-lg"
              >
                Đăng ký
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 md:hidden animate-in slide-in-from-top-2 duration-200">
            <div className="p-4 space-y-2">
              {/* Navigation Links */}
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <HomeIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Trang chủ</span>
              </Link>
              <Link
                to="/packages"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <FolderIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Gói đầu tư</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Về chúng tôi</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <PhoneIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Liên hệ</span>
              </Link>
              <Link
                to="/reviews"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <StarIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Đánh giá</span>
              </Link>
              
             

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* User Section */}
              {user ? (
                <>
                  <div className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 ${
                    balanceAnimation ? 'bg-green-50 border border-green-200' : 'bg-blue-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <BanknotesIcon className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-600">Số dư</div>
                        <div className={`font-bold transition-all duration-300 ${
                          balanceAnimation ? 'text-green-600 text-lg' : 'text-blue-600'
                        }`}>
                          {user.balance?.toLocaleString()} đ
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="p-2 hover:bg-blue-100 rounded transition-all duration-200 disabled:opacity-50"
                      title="Làm mới số dư"
                    >
                      <ArrowPathIcon className={`w-4 h-4 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to="/profile"
                      className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <UserIcon className="w-5 h-5 text-white" />
                      <span className="font-medium">{user.name}</span>
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                      <IoIosLogOut className="w-5 h-5 text-white" />
                      <span className="font-medium">Đăng xuất</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}