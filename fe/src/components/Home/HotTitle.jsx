import React from 'react'
import { useNavigate } from 'react-router-dom'

const HotTitle = () => {
  const navigate = useNavigate()
  return (
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">
              <span className="block mb-2 text-3xl">Đầu tư thông minh</span>
              <span className="block text-yellow-300">Lợi nhuận bền vững mỗi ngày cùng JBS</span>
            </h2>
          </div>
          {/* Call to Action */}
          <div className="text-center mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-white/30 max-w-4xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                Không rủi ro - Chỉ có lợi nhuận!
              </h3>
              <p className="text-md md:text-xl mb-8 text-blue-100">
                Tham gia ngay hôm nay để bắt đầu hành trình tăng trưởng tài sản cùng 150.000+ nhà đầu tư thông minh
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/packages')}
                  className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Bắt đầu đầu tư ngay
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
                >
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default HotTitle