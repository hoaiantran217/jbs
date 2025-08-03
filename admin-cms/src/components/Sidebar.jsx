import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";

// Icons cho từng menu item
const icons = {
  dashboard: "📊",
  users: "👥",
  packages: "📦",
  transactions: "💳",
  investments: "💰",
  maturities: "📅",
  posts: "📝",
  notifications: "🔔",
  reviews: "⭐",
  deposits: "💵",
  withdrawals: "🏦",
  withdrawalNotifications: "💸",
  transactionNotifications: "📢",
  bankInfo: "🏛️",
  teamMembers: "👨‍💼",
  investmentData: "📈",
  identityVerifications: "🆔",
  database: "🗄️",
  createAdmin: "👑",
  securitySettings: "🔒",
  referralTransactions: "🤝",
  promotions: "🎁"
};

// Cấu trúc menu được nhóm theo chức năng
const menuGroups = [
  {
    title: "Tổng quan",
    items: [
      { to: "/", label: "Dashboard", icon: icons.dashboard }
    ]
  },
  {
    title: "Quản lý người dùng",
    items: [
      { to: "/users", label: "Thành viên", icon: icons.users },
      // { to: "/create-admin", label: "Tạo Admin", icon: icons.createAdmin },
      { to: "/identity-verifications", label: "Xác minh danh tính", icon: icons.identityVerifications }
    ]
  },
  {
    title: "Đầu tư & Giao dịch",
    items: [
      { to: "/packages", label: "Gói đầu tư", icon: icons.packages },
      { to: "/investments", label: "Đầu tư", icon: icons.investments },
      { to: "/transactions", label: "Giao dịch", icon: icons.transactions },
      { to: "/maturities", label: "Đáo hạn", icon: icons.maturities },
      { to: "/investment-data", label: "Dữ liệu đầu tư", icon: icons.investmentData }
    ]
  },
  {
    title: "Tài chính",
    items: [
      { to: "/deposits", label: "Nạp tiền", icon: icons.deposits },
      { to: "/withdrawals", label: "Rút tiền", icon: icons.withdrawals },
      { to: "/referral-transactions", label: "Giao dịch giới thiệu", icon: icons.referralTransactions },
      { to: "/withdrawal-notifications", label: "Thông báo rút tiền", icon: icons.withdrawalNotifications },
      { to: "/transaction-notifications", label: "Thông báo giao dịch", icon: icons.transactionNotifications },
      { to: "/bank-info", label: "Thông tin ngân hàng", icon: icons.bankInfo },
      { to: "/promotions", label: "Khuyến mãi", icon: icons.promotions }
    ]
  },
  {
    title: "Nội dung & Marketing",
    items: [
      { to: "/posts", label: "Bài viết", icon: icons.posts },
      { to: "/notifications", label: "Thông báo", icon: icons.notifications },
      { to: "/reviews", label: "Đánh giá", icon: icons.reviews },
      { to: "/team-members", label: "Đội ngũ", icon: icons.teamMembers }
    ]
  },
  {
    title: "Hệ thống",
    items: [
      { to: "/security-settings", label: "Cài đặt bảo mật", icon: icons.securitySettings },
      { to: "/zuna", label: "Database", icon: icons.database, className: "text-red-300 hover:text-red-100" }
    ]
  }
];

export default function Sidebar({ onToggle }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(new Set(menuGroups.map((_, index) => index)));

  const toggleGroup = (groupIndex) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupIndex)) {
      newExpanded.delete(groupIndex);
    } else {
      newExpanded.add(groupIndex);
    }
    setExpandedGroups(newExpanded);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`${collapsed ? 'w-30' : 'w-64'} h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white flex flex-col fixed left-0 top-0 z-10 transition-all duration-300 shadow-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        {!collapsed && (
          <div className="text-xl font-bold text-white">
            {/* Left side - Title */}
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-white">B-Finance Admin</h1>
              <div className="text-sm text-white">Telegram: @Brian8882014</div>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            const newCollapsed = !collapsed;
            setCollapsed(newCollapsed);
            if (onToggle) onToggle(newCollapsed);
          }}
          className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
          title={collapsed ? "Mở rộng" : "Thu gọn"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 sidebar-scroll">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-1">
            {!collapsed && (
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider px-2 py-1">
                  {group.title}
                </h3>
                <button
                  onClick={() => toggleGroup(groupIndex)}
                  className="text-blue-300 hover:text-white transition-colors collapse-btn"
                >
                  {expandedGroups.has(groupIndex) ? "−" : "+"}
                </button>
              </div>
            )}
            
            {expandedGroups.has(groupIndex) && (
              <div className="space-y-1 menu-group-content">
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 group sidebar-menu-item ${
                      isActive(item.to)
                        ? "bg-blue-600 text-white shadow-md sidebar-active"
                        : "text-blue-100 hover:bg-blue-700 hover:text-white"
                    } ${item.className || ""}`}
                    title={collapsed ? item.label : ""}
                  >
                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform menu-icon">
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

     
    </aside>
  );
} 