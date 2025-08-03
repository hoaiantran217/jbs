import React, { useState, useEffect } from 'react'
import { ArrowTrendingUpIcon, UsersIcon, BanknotesIcon, CheckCircleIcon, ArrowUpIcon, UserIcon } from '@heroicons/react/24/solid'

const RealTime = () => {
  // States đơn giản
  const [totalInvested, setTotalInvested] = useState(92548200000);
  const [displayIncrease, setDisplayIncrease] = useState(0);
  const [newUser, setNewUser] = useState("Nguyễn Văn An");
  const [newUserTime, setNewUserTime] = useState("10:42");
  const [memberNumber, setMemberNumber] = useState(150762);
  const [totalWithdrawn24h, setTotalWithdrawn24h] = useState(65823500000);
  const [transactionCount, setTransactionCount] = useState(50);
  
  // States cho hiệu ứng tăng mượt mà
  const [displayTotalInvested, setDisplayTotalInvested] = useState(92548200000);
  const [displayMemberNumber, setDisplayMemberNumber] = useState(150762);
  const [displayTotalWithdrawn, setDisplayTotalWithdrawn] = useState(65823500000);
  const [displayTransactionCount, setDisplayTransactionCount] = useState(50);
  
    // Danh sách tên đầy đủ
  const fullNames = [
    "Nguyễn Văn An", "Trần Thị Bình", "Lê Hoàng Cường", "Phạm Minh Dũng", 
    "Hoàng Thành Huy", "Huỳnh Anh Tuấn", "Phan Hùng Nam", "Vũ Linh Hương", 
    "Võ Thu Nga", "Đặng Hà Văn", "Bùi Thị Hoàng", "Đỗ Minh Thành", 
    "Hồ Huy Dũng", "Ngô Anh Tuấn", "Dương Hùng Nam", "Lý Linh Hương"
  ];

  // State cho luồng hoạt động thực tế
  const [activityFeed, setActivityFeed] = useState(() => {
    // Tạo một số hoạt động ban đầu
    const initialActivities = [];
    const now = Date.now();
    
    for (let i = 0; i < 5; i++) {
      const randomName = fullNames[Math.floor(Math.random() * fullNames.length)];
      const randomMultiplier = Math.floor(Math.random() * 10) + 1;
      const amount = randomMultiplier * 5000000;
      const time = new Date(now - (i * 60000)); // Mỗi hoạt động cách nhau 1 phút
      
             initialActivities.push({
         id: now - (i * 60000) + Math.random(),
         name: randomName,
         amount: amount,
         time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
         minutesAgo: i,
         type: Math.random() > 0.7 ? 'withdrawal' : 'investment' // 70% đầu tư, 30% rút
       });
    }
    
    return initialActivities;
  });

  // Function để animate số tăng mượt mà
  const animateNumber = (startValue, endValue, setDisplayValue, duration = 1000) => {
    const startTime = Date.now();
    const difference = endValue - startValue;
    
    const updateNumber = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function cho animation mượt mà
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + difference * easeOutQuart);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };
    
    updateNumber();
  };

  // Tăng số tiền đầu tư mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      // Tăng ngẫu nhiên từ 500,000 đến 5,000,000 (bội số của 500,000, tối đa 10 lần)
      const randomMultiplier = Math.floor(Math.random() * 10) + 1; // 1-10
      const increase = randomMultiplier * 5000000; // 500,000 - 5,000,000
      
      const newTotal = totalInvested + increase;
      setTotalInvested(newTotal);
      setDisplayIncrease(prev => prev + increase);
      
      // Animate số hiển thị
      animateNumber(displayTotalInvested, newTotal, setDisplayTotalInvested, 800);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalInvested, displayTotalInvested]);

  // Cập nhật người dùng mới mỗi 15 giây
  useEffect(() => {
    const interval = setInterval(() => {
      const randomName = fullNames[Math.floor(Math.random() * fullNames.length)];
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      setNewUser(randomName);
      setNewUserTime(time);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Tăng số thành viên mỗi 8 giây
  useEffect(() => {
    const interval = setInterval(() => {
      const increase = Math.floor(Math.random() * 3) + 1;
      const newMemberNumber = memberNumber + increase;
      setMemberNumber(newMemberNumber);
      
      // Animate số hiển thị
      animateNumber(displayMemberNumber, newMemberNumber, setDisplayMemberNumber, 600);
    }, 8000);

    return () => clearInterval(interval);
  }, [memberNumber, displayMemberNumber]);

  // Tăng số tiền rút và giao dịch mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      // Tăng ngẫu nhiên từ 500,000 đến 5,000,000 (bội số của 500,000, tối đa 10 lần)
      const randomMultiplier = Math.floor(Math.random() * 10) + 1; // 1-10
      const withdrawnIncrease = randomMultiplier * 5000000; // 500,000 - 5,000,000
      const transactionIncrease = Math.floor(Math.random() * 2) + 1;
      
      const newTotalWithdrawn = totalWithdrawn24h + withdrawnIncrease;
      const newTransactionCount = transactionCount + transactionIncrease;
      
      setTotalWithdrawn24h(newTotalWithdrawn);
      setTransactionCount(newTransactionCount);
      
      // Animate số hiển thị
      animateNumber(displayTotalWithdrawn, newTotalWithdrawn, setDisplayTotalWithdrawn, 700);
      animateNumber(displayTransactionCount, newTransactionCount, setDisplayTransactionCount, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalWithdrawn24h, displayTotalWithdrawn, transactionCount, displayTransactionCount]);

  // Thêm hoạt động đầu tư mới vào luồng hoạt động mỗi 4 giây
  useEffect(() => {
    const interval = setInterval(() => {
      const randomName = fullNames[Math.floor(Math.random() * fullNames.length)];
      const randomMultiplier = Math.floor(Math.random() * 10) + 1;
      const amount = randomMultiplier * 5000000;
      
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;
      
             const newActivity = {
         id: Date.now() + Math.random(),
         name: randomName,
         amount: amount,
         time: time,
         minutesAgo: 0,
         type: 'investment'
       };
      
      setActivityFeed(prev => {
        const updatedFeed = [newActivity, ...prev];
        // Giữ tối đa 15 hoạt động
        return updatedFeed.slice(0, 15);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Thêm hoạt động rút tiền mới vào luồng hoạt động mỗi 8 giây
  useEffect(() => {
    const interval = setInterval(() => {
      const randomName = fullNames[Math.floor(Math.random() * fullNames.length)];
      const randomMultiplier = Math.floor(Math.random() * 10) + 1;
      const amount = randomMultiplier * 5000000;
      
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;
      
             const newActivity = {
         id: Date.now() + Math.random(),
         name: randomName,
         amount: amount,
         time: time,
         minutesAgo: 0,
         type: 'withdrawal'
       };
      
      setActivityFeed(prev => {
        const updatedFeed = [newActivity, ...prev];
        // Giữ tối đa 15 hoạt động
        return updatedFeed.slice(0, 15);
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Cập nhật thời gian "phút trước" mỗi phút
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityFeed(prev => 
        prev.map(activity => ({
          ...activity,
          minutesAgo: Math.floor((Date.now() - activity.id) / 60000)
        }))
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
          Hoạt động thực tế
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Dữ liệu cập nhật theo thời gian thực từ cộng đồng đầu tư
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {/* Số tiền đang đầu tư */}
        <div className="realtime-card bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm bg-white/20 px-3 py-1 rounded-full live-indicator">
              <span className="animate-pulse">●</span> LIVE
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Số tiền đang đầu tư</h3>
                               <div className="text-2xl md:text-3xl font-bold mb-2 number-counter transition-all duration-1000 animate-pulse">
            {displayTotalInvested.toLocaleString('vi-VN')} VNĐ
          </div>
          <p className="text-blue-100 text-sm">đang được đầu tư</p>
          <div className="mt-3 flex items-center text-green-300 transition-all duration-500">
            <ArrowUpIcon className="w-4 h-4 mr-1" />
                         <span className="text-xs">
               +{displayIncrease.toLocaleString('vi-VN')} VNĐ
             </span>
          </div>
        </div>

        {/* Người mới vừa đăng ký */}
        <div className="realtime-card bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm bg-white/20 px-3 py-1 rounded-full live-indicator">
              <span className="animate-pulse">●</span> NEW
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Người mới vừa đăng ký</h3>
          <div className="text-2xl md:text-3xl font-bold mb-2 number-counter transition-all duration-1000 animate-pulse">
            {newUser}
          </div>
          <p className="text-green-100 text-sm">vừa tham gia lúc {newUserTime}</p>
                     <div className="mt-3 flex items-center text-yellow-300 transition-all duration-500">
             <UserIcon className="w-4 h-4 mr-1" />
             <span className="text-xs">Thành viên thứ{" "}
               {displayMemberNumber.toLocaleString('vi-VN')}
             </span>
           </div>
        </div>

        {/* Tổng tiền vừa rút trong 24h */}
        <div className="realtime-card bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <BanknotesIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm bg-white/20 px-3 py-1 rounded-full live-indicator">
              <span className="animate-pulse">●</span> 24H
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Tổng tiền vừa rút</h3>
                               <div className="text-2xl md:text-3xl font-bold mb-2 number-counter transition-all duration-1000 animate-pulse">
            {displayTotalWithdrawn.toLocaleString('vi-VN')} VNĐ
          </div>
          <p className="text-orange-100 text-sm">trong 24 giờ qua</p>
                     <div className="mt-3 flex items-center text-green-300 transition-all duration-500">
             <CheckCircleIcon className="w-4 h-4 mr-1" />
             <span className="text-xs">+
               {displayTransactionCount} giao dịch
             </span>
           </div>
        </div>
      </div>

      {/* Live activity feed */}
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 animate-fade-in">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Luồng hoạt động trực tiếp</h3>
          <p className="text-gray-600">Cập nhật theo thời gian thực</p>
        </div>

                 <div className="space-y-3 max-h-[250px] overflow-y-auto">
           {activityFeed.map((activity, index) => (
             <div
               key={activity.id}
               className={`activity-item flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border transition-all duration-300 ${
                 index === 0 
                   ? activity.type === 'investment' 
                     ? 'animate-pulse bg-green-50 border-green-200' 
                     : 'animate-pulse bg-orange-50 border-orange-200'
                   : activity.type === 'withdrawal'
                     ? 'border-orange-200'
                     : 'border-gray-100'
               }`}
               style={{ 
                 animationDelay: `${index * 0.05}s`,
                 transform: index === 0 ? 'scale(1.02)' : 'scale(1)'
               }}
             >
               <div className="flex items-center space-x-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                   activity.type === 'investment' 
                     ? 'bg-gradient-to-r from-blue-500 to-green-500' 
                     : 'bg-gradient-to-r from-orange-500 to-red-500'
                 }`}>
                   <UserIcon className="w-4 h-4 text-white" />
                 </div>
                 <div>
                   <div className="font-semibold text-gray-800 text-sm">
                     {activity.name} vừa {activity.type === 'investment' ? 'đầu tư' : 'rút'} {activity.amount.toLocaleString('vi-VN')} VNĐ
                   </div>
                   <div className="text-xs text-gray-500">
                     {activity.time} - {activity.minutesAgo} phút trước
                   </div>
                 </div>
               </div>
             </div>
           ))}
         </div>
      </div>
    </section>
  )
}

export default RealTime