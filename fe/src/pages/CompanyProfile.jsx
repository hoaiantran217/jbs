import { 
  BuildingOfficeIcon, 
  GlobeAltIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  StarIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

export default function CompanyProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BuildingOfficeIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">HỒ SƠ CÔNG TY JBS</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nền tảng vững chắc cho mọi khoản đầu tư
          </p>
        </div>

        {/* Company Overview */}
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Section 1: Tổng quan thương hiệu toàn cầu */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <GlobeAltIcon className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">1. Tổng quan thương hiệu toàn cầu</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                <strong>JBS S.A.</strong> là tập đoàn chế biến thực phẩm lớn nhất thế giới, thành lập từ năm 1953 tại Brazil, 
                hiện hoạt động tại hơn 20 quốc gia, với hơn 270.000 nhân viên và doanh thu hàng năm trên 77 tỷ USD.
              </p>
              <p className="text-lg leading-relaxed">
                JBS không chỉ nổi tiếng với các thương hiệu thịt bò, thịt gà và thực phẩm chế biến sẵn, 
                mà còn là một tập đoàn đầu tư tài chính đa lĩnh vực – có khả năng xoay vốn, phát triển dự án 
                và tối ưu lợi nhuận cực kỳ mạnh mẽ.
              </p>
            </div>
          </div>

          {/* Section 2: JBS Việt Nam */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <BuildingOfficeIcon className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">2. JBS Việt Nam – Cơ hội đầu tư thông minh</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                Chúng tôi là công ty con chính thức trong hệ sinh thái JBS, chuyên cung cấp các gói đầu tư tài chính 
                ngắn và dài hạn, phù hợp cho cá nhân và tổ chức có nhu cầu sinh lời ổn định, an toàn.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-3">🎯 Mục tiêu:</h3>
                <p className="text-lg leading-relaxed">
                  Tạo ra môi trường đầu tư đơn giản – hiệu quả – minh bạch, giúp nhà đầu tư an tâm gửi gắm nguồn vốn 
                  và thu về lợi nhuận cao trong thời gian ngắn hoặc dài tùy nhu cầu.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Vì sao tin tưởng JBS */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <ShieldCheckIcon className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">3. Vì sao bạn nên tin tưởng JBS?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Thương hiệu toàn cầu</h4>
                    <p className="text-gray-600">JBS là tập đoàn nằm trong top đầu thế giới, niêm yết công khai, minh bạch tài chính</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Pháp lý rõ ràng</h4>
                    <p className="text-gray-600">Các gói đầu tư đều có hợp đồng, thời gian cụ thể và chứng từ giao dịch rõ ràng</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Không rủi ro</h4>
                    <p className="text-gray-600">An toàn tuyệt đối – không ảnh hưởng bởi thị trường hay biến động bên ngoài</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Lợi nhuận cố định</h4>
                    <p className="text-gray-600">Nhận đúng hạn 100%</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Chứng minh thực tế</h4>
                    <p className="text-gray-600">Bằng số liệu – hàng ngàn nhà đầu tư đã nhận lãi đúng hẹn, liên tục mở rộng quy mô</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <StarIcon className="w-6 h-6 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Uy tín hàng đầu</h4>
                    <p className="text-gray-600">Được tin tưởng bởi hàng triệu khách hàng trên toàn thế giới</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Cam kết từ JBS Việt Nam */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <ChartBarIcon className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">4. Cam kết từ JBS Việt Nam</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                Chúng tôi không mời gọi đầu tư bằng lời nói – mà bằng uy tín, kết quả thực tế và sự minh bạch tuyệt đối.
              </p>
              <p className="text-lg leading-relaxed">
                Tất cả giao dịch đều có lịch sử đối chiếu rõ ràng, và bạn có thể kiểm tra mọi lúc, mọi nơi.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
              <div className="text-3xl font-bold mb-2">77+</div>
              <div className="text-sm opacity-90">Tỷ USD doanh thu</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
              <div className="text-3xl font-bold mb-2">270K+</div>
              <div className="text-sm opacity-90">Nhân viên toàn cầu</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center">
              <div className="text-3xl font-bold mb-2">20+</div>
              <div className="text-sm opacity-90">Quốc gia hoạt động</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white text-center">
              <div className="text-3xl font-bold mb-2">1953</div>
              <div className="text-sm opacity-90">Năm thành lập</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Sẵn sàng đầu tư cùng JBS?</h3>
            <p className="text-lg mb-6 opacity-90">
              Tham gia cùng chúng tôi để tận hưởng lợi nhuận ổn định và an toàn
            </p>
            <Link to="/packages" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Bắt đầu đầu tư ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 