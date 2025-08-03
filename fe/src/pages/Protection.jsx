import React from 'react';
import { ShieldCheckIcon, ExclamationTriangleIcon, UserGroupIcon, LockClosedIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Protection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ShieldCheckIcon className="w-12 h-12 text-orange-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Chính Sách Bảo Vệ Người Dùng</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            JSB cam kết bảo vệ quyền lợi và tài sản của người dùng với các biện pháp toàn diện.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          
          {/* Section 1: Tổng quan bảo vệ */}
          <section className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-orange-600 font-bold text-lg">1</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">TỔNG QUAN BẢO VỆ</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2 text-orange-600" />
                  1.1. Cam kết bảo vệ
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB cam kết bảo vệ toàn diện quyền lợi và tài sản của người dùng. Chúng tôi xây dựng một hệ thống bảo vệ đa tầng để đảm bảo môi trường đầu tư an toàn và minh bạch.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2. Phạm vi bảo vệ</h3>
                <p className="text-gray-700 leading-relaxed">
                  Chính sách bảo vệ người dùng bao gồm: bảo vệ tài khoản, bảo vệ tài sản, bảo vệ thông tin cá nhân, phòng chống gian lận và xây dựng môi trường giao dịch lành mạnh.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3. Nguyên tắc hoạt động</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB hoạt động theo nguyên tắc "Người dùng là trung tâm", đặt lợi ích và sự an toàn của người dùng lên hàng đầu trong mọi quyết định và hoạt động.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Bảo vệ tài khoản */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">BẢO VỆ TÀI KHOẢN</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <LockClosedIcon className="w-5 h-5 mr-2 text-blue-600" />
                  2.1. An toàn đăng nhập
                </h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>JSB áp dụng các biện pháp bảo mật tài khoản:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Mật khẩu mạnh:</strong> Yêu cầu mật khẩu có độ phức tạp cao</li>
                    <li><strong>Xác thực 2 yếu tố:</strong> Bảo vệ tài khoản bằng SMS/Email</li>
                    <li><strong>Giới hạn đăng nhập:</strong> Khóa tài khoản sau nhiều lần sai mật khẩu</li>
                    <li><strong>Thông báo hoạt động:</strong> Email thông báo khi có đăng nhập mới</li>
                    <li><strong>Phiên đăng nhập:</strong> Tự động đăng xuất sau thời gian không hoạt động</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2. Khôi phục tài khoản</h3>
                <p className="text-gray-700 leading-relaxed">
                  Trong trường hợp tài khoản bị xâm nhập hoặc quên mật khẩu, JSB cung cấp quy trình khôi phục an toàn thông qua xác minh danh tính và thông tin bảo mật.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3. Giám sát hoạt động</h3>
                <p className="text-gray-700 leading-relaxed">
                  Hệ thống giám sát 24/7 phát hiện và cảnh báo các hoạt động bất thường trên tài khoản, bao gồm đăng nhập từ thiết bị lạ, giao dịch bất thường hoặc thay đổi thông tin quan trọng.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Bảo vệ tài sản */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold text-lg">3</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">BẢO VỆ TÀI SẢN</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1. Bảo vệ vốn đầu tư</h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>Mọi khoản vốn của người dùng đều được bảo vệ:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Đa dạng hóa đầu tư:</strong> Phân tán rủi ro qua nhiều dự án</li>
                    <li><strong>Quản lý vốn chặt chẽ:</strong> Giới hạn tỷ lệ đầu tư tối đa</li>
                    <li><strong>Bảo hiểm tài sản:</strong> Bảo hiểm cho các khoản đầu tư lớn</li>
                    <li><strong>Quỹ dự phòng:</strong> Duy trì quỹ để bảo vệ người dùng</li>
                    <li><strong>Kiểm toán định kỳ:</strong> Kiểm tra tính minh bạch của tài sản</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2. Bảo vệ giao dịch</h3>
                <p className="text-gray-700 leading-relaxed">
                  Mọi giao dịch đều được mã hóa và bảo vệ bằng công nghệ SSL/TLS. Hệ thống xác thực đa tầng đảm bảo chỉ người dùng hợp pháp mới có thể thực hiện giao dịch.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3. Bồi thường thiệt hại</h3>
                <p className="text-gray-700 leading-relaxed">
                  Trong trường hợp xảy ra sự cố do lỗi hệ thống hoặc vi phạm bảo mật từ phía JSB, chúng tôi cam kết bồi thường 100% thiệt hại cho người dùng theo quy định pháp luật.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Phòng chống gian lận */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold text-lg">4</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">PHÒNG CHỐNG GIAN LẬN</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-600" />
                  4.1. Hệ thống phát hiện gian lận
                </h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>JSB sử dụng công nghệ AI tiên tiến để phát hiện gian lận:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Phân tích hành vi:</strong> Phát hiện hoạt động bất thường</li>
                    <li><strong>Kiểm tra danh tính:</strong> Xác minh thông tin người dùng</li>
                    <li><strong>Giám sát giao dịch:</strong> Phát hiện giao dịch đáng ngờ</li>
                    <li><strong>Báo cáo tự động:</strong> Cảnh báo khi phát hiện gian lận</li>
                    <li><strong>Hợp tác cơ quan:</strong> Phối hợp với cơ quan chức năng</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2. Xử lý vi phạm</h3>
                <p className="text-gray-700 leading-relaxed">
                  Mọi hành vi gian lận, lừa đảo hoặc vi phạm quy định sẽ bị xử lý nghiêm minh, bao gồm khóa tài khoản, báo cáo cơ quan chức năng và thực hiện các biện pháp pháp lý cần thiết.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3. Bảo vệ người dùng</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB cam kết bảo vệ người dùng khỏi các hành vi gian lận và lừa đảo. Chúng tôi cung cấp hướng dẫn nhận biết và báo cáo các hoạt động đáng ngờ.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Hỗ trợ khiếu nại */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-purple-600 font-bold text-lg">5</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">HỖ TRỢ KHIẾU NẠI</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-purple-600" />
                  5.1. Quyền khiếu nại
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Người dùng có quyền khiếu nại về bất kỳ vấn đề nào liên quan đến dịch vụ, giao dịch hoặc bảo mật. JSB cam kết xử lý mọi khiếu nại một cách công bằng và minh bạch.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2. Quy trình xử lý</h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>Quy trình xử lý khiếu nại:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Tiếp nhận:</strong> Nhận khiếu nại qua các kênh chính thức</li>
                    <li><strong>Phân loại:</strong> Phân loại và ưu tiên xử lý</li>
                    <li><strong>Điều tra:</strong> Thu thập thông tin và điều tra</li>
                    <li><strong>Giải quyết:</strong> Đưa ra giải pháp phù hợp</li>
                    <li><strong>Phản hồi:</strong> Thông báo kết quả cho người dùng</li>
                    <li><strong>Theo dõi:</strong> Đảm bảo giải pháp được thực hiện</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3. Thời gian phản hồi</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB cam kết phản hồi mọi khiếu nại trong vòng 24-72 giờ làm việc. Các vấn đề khẩn cấp sẽ được xử lý ngay lập tức để đảm bảo quyền lợi của người dùng.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Môi trường giao dịch lành mạnh */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-indigo-600 font-bold text-lg">6</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">MÔI TRƯỜNG GIAO DỊCH LÀNH MẠNH</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1. Quy tắc cộng đồng</h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>JSB xây dựng môi trường giao dịch văn minh:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Tôn trọng lẫn nhau:</strong> Không có hành vi xúc phạm hoặc quấy rối</li>
                    <li><strong>Minh bạch:</strong> Công khai thông tin và quy định</li>
                    <li><strong>Công bằng:</strong> Đối xử bình đẳng với mọi người dùng</li>
                    <li><strong>Hợp tác:</strong> Khuyến khích chia sẻ kinh nghiệm tích cực</li>
                    <li><strong>Tuân thủ pháp luật:</strong> Hoạt động theo quy định hiện hành</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2. Xử lý vi phạm</h3>
                <p className="text-gray-700 leading-relaxed">
                  Mọi hành vi vi phạm quy tắc cộng đồng sẽ bị xử lý nghiêm minh, từ cảnh cáo đến khóa tài khoản vĩnh viễn tùy theo mức độ vi phạm.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3. Khuyến khích tích cực</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB khuyến khích và tôn vinh những người dùng có đóng góp tích cực cho cộng đồng, bao gồm chia sẻ kinh nghiệm, hỗ trợ người khác và tuân thủ quy định.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Liên hệ hỗ trợ */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-yellow-600 font-bold text-lg">7</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">LIÊN HỆ HỖ TRỢ</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1. Kênh liên hệ</h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>JSB cung cấp nhiều kênh hỗ trợ:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Hotline bảo vệ:</strong> +1 (800) 555-0199 (24/7)</li>
                    <li><strong>Email khiếu nại:</strong>invest@jbssa.com</li>
                    <li><strong>Chat trực tuyến:</strong> Hỗ trợ realtime</li>
                    <li><strong>Văn phòng:</strong> Tư vấn trực tiếp</li>
                    <li><strong>Mạng xã hội:</strong> Facebook, Zalo</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2. Thông tin cần cung cấp</h3>
                <p className="text-gray-700 leading-relaxed">
                  Khi liên hệ hỗ trợ, vui lòng cung cấp đầy đủ thông tin: mã tài khoản, thời gian xảy ra sự việc, mô tả chi tiết và bằng chứng liên quan để chúng tôi có thể hỗ trợ hiệu quả nhất.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">7.3. Cam kết bảo mật</h3>
                <p className="text-gray-700 leading-relaxed">
                  Mọi thông tin bạn cung cấp khi liên hệ hỗ trợ đều được bảo mật tuyệt đối. JSB cam kết không chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ ba nào.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <div className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Liên Hệ Bảo Vệ Người Dùng</h3>
              <p className="text-gray-700 mb-4">
                Nếu bạn cần hỗ trợ về bảo vệ tài khoản, khiếu nại hoặc báo cáo vi phạm, vui lòng liên hệ:
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center">
                  <span className="text-orange-600 font-semibold">Email:</span>
                  <span className="ml-2 text-gray-700">invest@jbssa.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-orange-600 font-semibold">Hotline:</span>
                  <span className="ml-2 text-gray-700">+1 (800) 555-0199</span>
                </div>
                <div className="flex items-center">
                  <span className="text-orange-600 font-semibold">Phone:</span>
                  <span className="ml-2 text-gray-700">+55 (11) 3144-4000 </span>
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

export default Protection; 