import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef(user); // Ref để lưu trữ user hiện tại

  // Cập nhật ref khi user thay đổi
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  // Event handlers - moved to top level to avoid invalid hook calls
  const handleBalanceUpdate = useCallback((event) => {
    const { newBalance, userId } = event.detail;
    
    // Chỉ cập nhật nếu là user hiện tại
    if (userRef.current && userRef.current._id === userId) {
      setUser(prev => prev ? { ...prev, balance: newBalance } : null);
    }
  }, []);

  const handleUserDataChange = useCallback((event) => {
    const { userData } = event.detail;
    if (userRef.current && userRef.current._id === userData._id) {
      setUser(userData);
    }
  }, []);

  const handleUserLoggedIn = useCallback((event) => {
    const { userData } = event.detail;
    setUser(userData);
  }, []);

  // Lấy thông tin user từ localStorage và API
  useEffect(() => {
    fetchUserData().finally(() => {
      setLoading(false);
    });
  }, [fetchUserData]);

  // Auto refresh user data mỗi 30 giây (reduced from 10 seconds)
  useEffect(() => {
    if (user) {
      const interval = setInterval(fetchUserData, 30000); // Increased from 10000 to 30000
      return () => clearInterval(interval);
    }
  }, [user, fetchUserData]);

  // Lắng nghe events để cập nhật balance real-time - optimized for performance
  useEffect(() => {
    // Use regular event listeners to avoid initialization issues
    window.addEventListener('balanceUpdated', handleBalanceUpdate);
    window.addEventListener('userBalanceChanged', handleBalanceUpdate);
    window.addEventListener('userDataChanged', handleUserDataChange);
    window.addEventListener('userLoggedIn', handleUserLoggedIn);

    return () => {
      window.removeEventListener('balanceUpdated', handleBalanceUpdate);
      window.removeEventListener('userBalanceChanged', handleBalanceUpdate);
      window.removeEventListener('userDataChanged', handleUserDataChange);
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
    };
  }, [handleBalanceUpdate, handleUserDataChange, handleUserLoggedIn]); // Add dependencies

  // Cập nhật balance
  const updateBalance = (newBalance) => {
    setUser(prev => prev ? { ...prev, balance: newBalance } : null);
  };

  // Cập nhật toàn bộ user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Refresh user data manually
  const refreshUser = () => {
    fetchUserData();
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    updateBalance,
    updateUser,
    refreshUser,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 