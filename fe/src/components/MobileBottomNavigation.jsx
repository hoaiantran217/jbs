import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, FolderIcon, UserIcon, StarIcon, CogIcon, CalendarDaysIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { useUser } from '../contexts/UserContext';
import { RiCustomerService2Fill } from 'react-icons/ri';

const MobileBottomNavigation = () => {
  const location = useLocation();
  const { user } = useUser();

  const navItems = [
    {
      path: '/',
      label: 'Trang chủ',
      icon: HomeIcon,
    },
    {
      path: '/reviews',
      label: 'Đánh giá',
      icon: StarIcon,
    },
    
    {
      path: '/packages',
      label: 'Đầu tư',
      icon: FolderIcon,
    },
    {
      path: 'https://app.chaport.com/widget/show.html?appid=688d785d1dd05cfde943be30',
      label: 'CSKH',
      icon: ChatBubbleLeftEllipsisIcon,
    },
    {
      path: '/profile',
      label: 'Tài khoản',
      icon: UserIcon,
    },
  ];

  const handleNavigation = (item) => {
    // Nếu click vào "Hồ sơ" hoặc "Cài đặt" và chưa đăng nhập, chuyển đến trang đăng nhập
    if ((item.path === '/profile' || item.path === '/account' || item.path === '/attendance') && !user) {
      return '/login';
    }
    return item.path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const targetPath = handleNavigation(item);
          // Nếu đang ở trang login và item là profile hoặc account, cũng highlight
          const shouldHighlight = isActive || (location.pathname === '/login' && (item.path === '/profile' || item.path === '/account' || item.path === '/attendance') && !user);
          
          return (
            <Link
              key={item.path}
              to={targetPath}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${
                shouldHighlight 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNavigation; 