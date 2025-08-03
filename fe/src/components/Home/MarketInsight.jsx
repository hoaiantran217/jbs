import React from 'react'
import { BanknotesIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

const MarketInsight = () => {
  return (
    <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Thị trường đầu tư</h2>
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <BanknotesIcon className="w-6 h-6 text-green-600 mr-2" />
                  Xu hướng thị trường
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Lãi suất trung bình</span>
                    <span className="text-green-600 font-bold">12.5%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Tổng vốn đầu tư</span>
                    <span className="text-blue-600 font-bold">500+ tỷ VNĐ</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Số nhà đầu tư</span>
                    <span className="text-purple-600 font-bold">10,000+</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Lợi ích đầu tư</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span>Lãi suất cao hơn tiết kiệm ngân hàng 3-5 lần</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span>Đầu tư với số tiền nhỏ từ 1 triệu đồng</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span>Rút tiền linh hoạt khi cần thiết</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span>Hỗ trợ tư vấn chuyên nghiệp 24/7</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
  )
}

export default MarketInsight