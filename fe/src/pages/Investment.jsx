import React from 'react';
import { ChartBarIcon, ShieldCheckIcon, CurrencyDollarIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Investment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ChartBarIcon className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Chính Sách Đầu Tư</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            JSB cam kết mang đến cơ hội đầu tư an toàn, minh bạch và hiệu quả cho mọi nhà đầu tư.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          
          {/* Section 1: Tổng quan */}
          <section className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-purple-600 font-bold text-lg">1</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">TỔNG QUAN ĐẦU TƯ</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2 text-purple-600" />
                  1.1. Triết lý đầu tư
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB hoạt động với triết lý "An toàn là trên hết". Chúng tôi cam kết 100% mỗi khoản đầu tư sẽ mang lại lợi nhuận tuyệt đối, không có rủi ro thua lỗ cho nhà đầu tư.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2. Mô hình kinh doanh</h3>
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi vận hành trên nền tảng công nghệ hiện đại và mô hình quản lý tài chính chuyên nghiệp, đảm bảo tính bền vững và khả năng sinh lời ổn định cho mọi khoản đầu tư.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3. Đối tượng đầu tư</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB phục vụ tất cả các nhà đầu tư từ cá nhân đến tổ chức, với các gói đầu tư phù hợp với mọi nhu cầu và khả năng tài chính.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Cam kết lợi nhuận */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">CAM KẾT LỢI NHUẬN</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <CurrencyDollarIcon className="w-5 h-5 mr-2 text-green-600" />
                  2.1. Lợi nhuận tuyệt đối
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB cam kết 100% mỗi khoản đầu tư sẽ mang lại lợi nhuận tuyệt đối. Chúng tôi đảm bảo rằng mọi đồng vốn của bạn đều được bảo vệ và sinh lời theo đúng cam kết.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2. Không rủi ro thua lỗ</h3>
                <p className="text-gray-700 leading-relaxed">
                  Với hệ thống quản lý vốn chặt chẽ và đa dạng hóa đầu tư, chúng tôi đảm bảo không có rủi ro thua lỗ cho nhà đầu tư. Mọi khoản đầu tư đều được bảo vệ bằng các cơ chế an toàn đa tầng.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3. Tỷ suất lợi nhuận</h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>JSB cung cấp các mức lợi nhuận cạnh tranh:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Gói cơ bản:</strong> 15-25% lợi nhuận/năm</li>
                    <li><strong>Gói nâng cao:</strong> 25-35% lợi nhuận/năm</li>
                    <li><strong>Gói VIP:</strong> 35-50% lợi nhuận/năm</li>
                    <li><strong>Gói Premium:</strong> 50-80% lợi nhuận/năm</li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-2">
                    * Tỷ suất lợi nhuận có thể thay đổi theo thị trường và sẽ được thông báo trước.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Gói đầu tư */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">GÓI ĐẦU TƯ</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1. Đa dạng lựa chọn</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB cung cấp các gói đầu tư đa dạng từ cơ bản đến cao cấp, phù hợp với mọi nhu cầu và khả năng tài chính của nhà đầu tư.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2. Tính linh hoạt</h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>Các gói đầu tư có tính linh hoạt cao:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Thời gian đầu tư:</strong> Từ 1 tháng đến 12 tháng</li>
                    <li><strong>Số tiền đầu tư:</strong> Từ 1 triệu đến không giới hạn</li>
                    <li><strong>Rút tiền linh hoạt:</strong> Có thể rút một phần hoặc toàn bộ</li>
                    <li><strong>Tái đầu tư:</strong> Tự động tái đầu tư lợi nhuận</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3. Minh bạch thông tin</h3>
                <p className="text-gray-700 leading-relaxed">
                  Mọi thông tin về gói đầu tư đều được công khai minh bạch, bao gồm tỷ suất lợi nhuận, thời gian đầu tư, điều kiện rút tiền và các rủi ro liên quan.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Quy trình đầu tư */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-orange-600 font-bold text-lg">4</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">QUY TRÌNH ĐẦU TƯ</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1. Đăng ký tài khoản</h3>
                <p className="text-gray-700 leading-relaxed">
                  Bước đầu tiên là đăng ký tài khoản trên nền tảng JSB. Bạn cần cung cấp thông tin cá nhân chính xác và xác minh danh tính theo quy định.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2. Nạp tiền</h3>
                <p className="text-gray-700 leading-relaxed">
                  Sau khi tài khoản được kích hoạt, bạn có thể nạp tiền vào tài khoản thông qua các phương thức thanh toán được hỗ trợ: chuyển khoản ngân hàng, ví điện tử, hoặc thẻ tín dụng.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3. Chọn gói đầu tư</h3>
                <p className="text-gray-700 leading-relaxed">
                  Bạn có thể chọn gói đầu tư phù hợp với nhu cầu và khả năng tài chính. Mỗi gói có thông tin chi tiết về lợi nhuận, thời gian và điều kiện đầu tư.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.4. Theo dõi và quản lý</h3>
                <p className="text-gray-700 leading-relaxed">
                  Bạn có thể theo dõi tình trạng đầu tư, lợi nhuận và quản lý tài khoản thông qua dashboard trực tuyến 24/7.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.5. Rút tiền</h3>
                <p className="text-gray-700 leading-relaxed">
                  Khi đến hạn hoặc khi cần, bạn có thể rút tiền gốc và lợi nhuận về tài khoản ngân hàng đã đăng ký. Quá trình rút tiền được xử lý nhanh chóng và an toàn.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Bảo mật và an toàn */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold text-lg">5</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">BẢO MẬT VÀ AN TOÀN</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1. Bảo mật tài khoản</h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>JSB áp dụng các biện pháp bảo mật tiên tiến:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Mã hóa SSL/TLS:</strong> Bảo vệ mọi giao dịch trực tuyến</li>
                    <li><strong>Xác thực 2 yếu tố:</strong> Tăng cường bảo mật tài khoản</li>
                    <li><strong>Giám sát 24/7:</strong> Phát hiện và ngăn chặn hoạt động bất thường</li>
                    <li><strong>Sao lưu dữ liệu:</strong> Đảm bảo thông tin không bị mất</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2. Bảo vệ vốn</h3>
                <p className="text-gray-700 leading-relaxed">
                  Mọi khoản vốn của nhà đầu tư đều được bảo vệ bằng các cơ chế đa tầng, bao gồm đa dạng hóa đầu tư, quản lý rủi ro chặt chẽ và bảo hiểm tài sản.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3. Tuân thủ pháp luật</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB hoạt động tuân thủ đầy đủ các quy định pháp luật về đầu tư, tài chính và chống rửa tiền. Chúng tôi thường xuyên cập nhật và tuân thủ các quy định mới.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Hỗ trợ khách hàng */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-indigo-600 font-bold text-lg">6</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">HỖ TRỢ KHÁCH HÀNG</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-indigo-600" />
                  6.1. Đội ngũ tư vấn
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB có đội ngũ chuyên viên tư vấn đầu tư chuyên nghiệp, sẵn sàng hỗ trợ và tư vấn cho bạn về các gói đầu tư phù hợp với nhu cầu và khả năng tài chính.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2. Kênh hỗ trợ</h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>Chúng tôi cung cấp nhiều kênh hỗ trợ:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Hotline:</strong> 1900-xxx-xxx (24/7)</li>
                    <li><strong>Email:</strong> support@jsb-invest.com</li>
                    <li><strong>Chat trực tuyến:</strong> Hỗ trợ realtime</li>
                    <li><strong>Văn phòng:</strong> Tư vấn trực tiếp</li>
                    <li><strong>Hội thảo:</strong> Đào tạo đầu tư miễn phí</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3. Tài liệu hướng dẫn</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB cung cấp đầy đủ tài liệu hướng dẫn, video tutorial và FAQ để giúp bạn hiểu rõ về các gói đầu tư và cách sử dụng nền tảng một cách hiệu quả nhất.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Rủi ro và cảnh báo */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-yellow-600 font-bold text-lg">7</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">RỦI RO VÀ CẢNH BÁO</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1. Hiểu về rủi ro</h3>
                <p className="text-gray-700 leading-relaxed">
                  Mặc dù JSB cam kết bảo vệ vốn và lợi nhuận, bạn cần hiểu rằng mọi khoản đầu tư đều có thể chứa đựng rủi ro. Chúng tôi khuyến nghị bạn chỉ đầu tư số tiền mà bạn có thể chấp nhận rủi ro.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2. Biến động thị trường</h3>
                <p className="text-gray-700 leading-relaxed">
                  Lợi nhuận có thể bị ảnh hưởng bởi các yếu tố thị trường, kinh tế và chính trị. JSB sẽ thông báo kịp thời về các thay đổi có thể ảnh hưởng đến khoản đầu tư của bạn.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">7.3. Thời gian đầu tư</h3>
                <p className="text-gray-700 leading-relaxed">
                  Một số gói đầu tư có thời gian cam kết. Rút tiền sớm có thể phát sinh phí hoặc ảnh hưởng đến lợi nhuận. Bạn nên cân nhắc kỹ trước khi đầu tư.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Liên Hệ Tư Vấn Đầu Tư</h3>
              <p className="text-gray-700 mb-4">
                Để được tư vấn chi tiết về các gói đầu tư và hỗ trợ đăng ký, vui lòng liên hệ:
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center">
                  <span className="text-purple-600 font-semibold">Email:</span>
                  <span className="ml-2 text-gray-700">invest@jbssa.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-600 font-semibold">Hotline:</span>
                  <span className="ml-2 text-gray-700">+1 (800) 555-0199</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investment; 