import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header({ depositCount = 0, withdrawCount = 0 }) {
  const navigate = useNavigate()
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="bg-gradient-to-b from-blue-800 to-blue-900 text-white border-b border-gray-200 p-4 w-full shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between">
        {/* Left side - Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-white">JBS Admin</h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button 
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors relative"
              onClick={() => navigate('/deposits')}
            >
              <span className="text-sm font-medium">Nạp tiền</span>
              {depositCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {depositCount}
                </span>
              )}
            </button>
            
            <button 
              className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors relative"
              onClick={() => navigate('/withdrawals')}
            >
              <span className="text-sm font-medium">Rút tiền</span>
              {withdrawCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {withdrawCount}
                </span>
              )}
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <button 
              className="px-3 bg-white rounded-lg py-2 text-red-600 hover:text-red-700 transition-colors"
              onClick={() => navigate('/users')}
            >
              <span className="text-sm font-medium">Tài khoản</span>
            </button>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            <button 
              className="px-3 bg-white rounded-lg py-2 text-red-600 hover:text-red-700 transition-colors"
              onClick={handleLogout}
            >
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}   