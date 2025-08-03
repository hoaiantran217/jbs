import React, { useEffect, useState } from 'react';
import { UserIcon } from '@heroicons/react/24/solid';

interface VipMember {
  id: number;
  name: string;
  username: string;
  amount: number;
}

const VipMember = () => {
  const [vipMembers, setVipMembers] = useState<VipMember[]>([]);

  // Mock VIP members data - in real app, this would come from API
  useEffect(() => {
    // Simulate VIP members data
    const mockVipMembers: VipMember[] = [
      {
        id: 1,
        name: "Bùi Thái Hải",
        username: "******",
        amount: 10800000
      },
      {
        id: 2,
        name: "Bùi Chí Hải",
        username: "******",
        amount: 69000000
      },
      {
        id: 3,
        name: "Lê Đức Thảo",
        username: "******",
        amount: 76000000
      },
      {
        id: 4,
        name: "Đặng Ngọc Dũng",
        username: "******",
        amount: 64000000
      },
      {
        id: 5,
        name: "Nguyễn Văn An",
        username: "******",
        amount: 89000000
      },
      {
        id: 6,
        name: "Trần Thị Bình",
        username: "******",
        amount: 45000000
      },
      {
        id: 7,
        name: "Lê Văn Cường",
        username: "******",
        amount: 123000000
      },
      {
        id: 8,
        name: "Phạm Thị Dung",
        username: "******",
        amount: 98000000
      }
    ];
    setVipMembers(mockVipMembers);
  }, []);

  // Calculate statistics
  const totalInvestment = vipMembers.reduce((sum, member) => sum + member.amount, 0);
  const averageInvestment = vipMembers.length > 0 ? totalInvestment / vipMembers.length : 0;
  const maxInvestment = vipMembers.length > 0 ? Math.max(...vipMembers.map(m => m.amount)) : 0;

  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="md:text-3xl text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center">
          Danh sách thành viên VIP
        </h2>
        <p className="md:text-lg text-sm text-gray-600 max-w-2xl mx-auto">
          Những thành viên xuất sắc với khoản đầu tư lớn
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
        <div className="relative h-80 overflow-hidden">
          <div className="vip-members-container">
            {/* First set of members */}
            <div className="vip-members-slide">
              {vipMembers.map((member, index) => (
                <div
                  key={`first-${member.id}`}
                  className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-300"
                  style={{
                    animationDelay: `${index * 0.3}s`,
                    animationDuration: '0.8s',
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 md:text-lg text-sm">{member.name}</div>
                      <div className="md:text-sm text-xs text-gray-500">Tên người dùng: {member.username}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="md:text-lg text-sm font-bold text-red-500">
                      +{member.amount.toLocaleString()} VND
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Duplicate set for continuous scroll */}
            <div className="vip-members-slide">
              {vipMembers.map((member, index) => (
                <div
                  key={`second-${member.id}`}
                  className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 md:text-lg text-sm">{member.name}</div>
                      <div className="md:text-sm text-xs text-gray-500">Tên người dùng: {member.username}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="md:text-lg text-sm font-bold text-red-500">
                      +{member.amount.toLocaleString()} VND
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient overlay for smooth fade effect */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10"></div>
        </div>

        {/* Stats summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{vipMembers.length}+</div>
            <div className="text-sm text-gray-600">Thành viên VIP</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {(totalInvestment / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Tổng đầu tư</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {(averageInvestment / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Trung bình/VIP</div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {(maxInvestment / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Cao nhất</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VipMember;