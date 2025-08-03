import { ArrowUpIcon, BanknotesIcon, CheckCircleIcon, UserIcon } from '@heroicons/react/24/solid'
import React from 'react'
import CountUpAnimation from '../CountUpAnimation'

const SocialProof = () => {
  return (
    <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Bằng chứng uy tín</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những con số ấn tượng chứng minh sự tin tưởng của cộng đồng đầu tư
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Thống kê thành viên */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Cộng đồng đầu tư</h3>
                <CountUpAnimation 
                  end={150000} 
                  suffix="+" 
                  className="text-4xl font-bold text-blue-600 mb-2 block"
                  duration={3000}
                  delay={200}
                />
                <p className="text-gray-600 text-lg">Thành viên đang đầu tư mỗi ngày</p>
                <div className="mt-4 flex items-center justify-center text-green-600">
                  <ArrowUpIcon className="w-5 h-5 mr-1" />
                  <span className="text-sm font-semibold">Tăng 15% so với tháng trước</span>
                </div>
              </div>
            </div>

            {/* Thống kê rút tiền thành công */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BanknotesIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Rút tiền thành công</h3>
                <CountUpAnimation 
                  end={120} 
                  suffix=" tỷ VNĐ" 
                  className="text-4xl font-bold text-green-600 mb-2 block"
                  duration={3000}
                  delay={400}
                />
                <p className="text-gray-600 text-lg">Tổng số tiền đã rút thành công</p>
                <div className="mt-4 flex items-center justify-center text-green-600">
                  <CheckCircleIcon className="w-5 h-5 mr-1" />
                  <span className="text-sm font-semibold">100% giao dịch thành công</span>
                </div>
              </div>
            </div>
          </div>
         
        </section>
  )
}

export default SocialProof