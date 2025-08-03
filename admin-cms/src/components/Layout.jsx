import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Layout({ children }) {
  const [depositCount, setDepositCount] = useState(0);
  const [withdrawCount, setWithdrawCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const BASE_URL = 'https://jbs-invest.onrender.com';
  
  useEffect(() => {
    // Lấy số lượng yêu cầu nạp/rút tiền pending
    const fetchCounts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/transactions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDepositCount(res.data.filter(tx => tx.type === "deposit" && tx.status === "pending").length);
        setWithdrawCount(res.data.filter(tx => tx.type === "withdraw" && tx.status === "pending").length);
      } catch {}
    };
    fetchCounts();
  }, []);

  // Lắng nghe sự kiện từ sidebar
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      if (event.detail && typeof event.detail.collapsed === 'boolean') {
        setSidebarCollapsed(event.detail.collapsed);
      }
    };

    window.addEventListener('sidebar-toggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle);
  }, []);

  return (
    <div className="flex">
      <Header depositCount={depositCount} withdrawCount={withdrawCount} />
      <Sidebar onToggle={(collapsed) => setSidebarCollapsed(collapsed)} />
      <main className={`transition-all duration-300 min-h-screen bg-gray-50 min-w-full p-4 mt-16 ${
        sidebarCollapsed ? 'pl-16' : 'pl-64'
      }`}>
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
} 