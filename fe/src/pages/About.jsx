import React, { useEffect, useState } from 'react';
import {
  BuildingOffice2Icon,
  LightBulbIcon,
  EyeIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import TeamMember from '../components/Home/TeamMember';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Company Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <BuildingOffice2Icon className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Tổng quan công ty</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-2">
                <LightBulbIcon className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-xl font-semibold text-blue-600">Sứ mệnh</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                JBS cam kết mang đến cơ hội đầu tư minh bạch, an toàn và hiệu quả cho mọi người. 
                Chúng tôi tin rằng ai cũng xứng đáng có cơ hội xây dựng tương lai tài chính vững chắc.
              </p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <EyeIcon className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-xl font-semibold text-green-600">Tầm nhìn</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Trở thành nền tảng đầu tư hàng đầu tại Việt Nam, được tin tưởng bởi hàng triệu nhà đầu tư 
                và là đối tác chiến lược của các tổ chức tài chính uy tín.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
          <div className="flex items-center mb-6 justify-center">
            <ShieldCheckIcon className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 text-center">Giá trị cốt lõi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckBadgeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Minh bạch</h3>
              <p className="text-gray-600 text-justify">Mỗi gói đầu tư của JBS đều đi kèm với chính sách rõ ràng, hợp đồng minh bạch và hệ thống quản lý điện tử giúp nhà đầu tư theo dõi sát sao dòng tiền và lợi nhuận. JBS cam kết báo cáo định kỳ, công khai hiệu suất đầu tư và tình hình hoạt động, đảm bảo nhà đầu tư luôn nắm rõ từng bước phát triển.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">An toàn</h3>
              <p className="text-gray-600 text-justify">JBS sở hữu mạng lưới sản xuất và phân phối toàn cầu, hoạt động tại hơn 190 quốc gia. Nhờ quy mô vượt trội, thương hiệu mạnh và khả năng quản trị rủi ro tốt, JBS đảm bảo mỗi khoản đầu tư luôn đặt yếu tố an toàn lên hàng đầu. Các gói đầu tư được thiết kế trên cơ sở pháp lý rõ ràng và được bảo chứng bằng uy tín toàn cầu của tập đoàn.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <RocketLaunchIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Hiệu quả</h3>
              <p className="text-gray-600 text-justify">Thông qua các gói đầu tư linh hoạt, JBS mang đến nhiều lựa chọn phù hợp với khẩu vị rủi ro và mục tiêu tài chính của từng nhà đầu tư. Với năng lực tài chính vững mạnh, hiệu suất kinh doanh cao và chiến lược tăng trưởng rõ ràng, JBS cam kết mang lại tỷ suất lợi nhuận hấp dẫn và bền vững theo thời gian.</p>
            </div>
          </div>
        </div>

       

        <TeamMember />
      </div>
    </div>
  );
} 