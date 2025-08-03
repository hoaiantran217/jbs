import React from 'react';
import { ShieldCheckIcon, UserGroupIcon, LockClosedIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <DocumentTextIcon className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Điều Kiện & Điều Khoản</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chào mừng quý khách đến với nền tảng đầu tư JSB. Vui lòng đọc kỹ các điều khoản sử dụng dưới đây.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          
          {/* Section 1: Điều kiện và điều khoản */}
          <section className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">ĐIỀU KIỆN VÀ ĐIỀU KHOẢN</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2 text-blue-600" />
                  1.1. Giới thiệu
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Chào mừng quý khách đến với nền tảng đầu tư JSB. Khi truy cập và sử dụng website, quý khách đồng ý với các điều khoản sử dụng dưới đây. JSB cam kết mang đến trải nghiệm an toàn, minh bạch và hiệu quả cho mọi người dùng.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2. Quyền sở hữu</h3>
                <p className="text-gray-700 leading-relaxed">
                  Tất cả nội dung, giao diện và tài sản kỹ thuật số trên nền tảng JSB đều thuộc quyền sở hữu trí tuệ của chúng tôi. Mọi hành vi sao chép hoặc sử dụng trái phép đều bị nghiêm cấm.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3. Trách nhiệm người dùng</h3>
                <p className="text-gray-700 leading-relaxed">
                  Người dùng cần cung cấp thông tin chính xác khi đăng ký và có trách nhiệm bảo mật thông tin tài khoản. JSB không chịu trách nhiệm nếu thiệt hại xảy ra do lỗi bảo mật từ phía người dùng.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1.4. Thay đổi và cập nhật</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB có quyền cập nhật nội dung, sản phẩm và điều khoản bất kỳ lúc nào để phù hợp với quy định và lợi ích người dùng. Các thay đổi sẽ được công bố công khai.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Chính sách và bảo mật */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">CHÍNH SÁCH VÀ BẢO MẬT</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <LockClosedIcon className="w-5 h-5 mr-2 text-green-600" />
                  2.1. Bảo vệ thông tin người dùng
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi thu thập các thông tin cần thiết để phục vụ giao dịch và chăm sóc khách hàng. Mọi dữ liệu đều được lưu trữ bảo mật bằng công nghệ hiện đại nhất.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2. Cam kết không chia sẻ</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB cam kết không chia sẻ, không bán hoặc tiết lộ thông tin cá nhân cho bất kỳ bên thứ ba nào mà không có sự đồng ý của người dùng, trừ khi có yêu cầu từ cơ quan pháp luật.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3. Quyền truy cập và chỉnh sửa</h3>
                <p className="text-gray-700 leading-relaxed">
                  Người dùng có quyền yêu cầu truy cập, cập nhật hoặc xóa thông tin cá nhân bất cứ lúc nào qua hệ thống hỗ trợ của JSB.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Chính sách đầu tư */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">CHÍNH SÁCH ĐẦU TƯ</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1. Cam kết lợi nhuận tuyệt đối</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB cam kết 100% mỗi khoản đầu tư sẽ mang lại lợi nhuận tuyệt đối. Chúng tôi vận hành trên nền tảng công nghệ và mô hình quản lý tài chính an toàn, không có rủi ro thua lỗ cho nhà đầu tư.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2. Không rủi ro – không lo lắng</h3>
                <p className="text-gray-700 leading-relaxed">
                  Tất cả giao dịch đều được đảm bảo an toàn bằng các cơ chế bảo mật đa tầng và chính sách quản lý vốn chặt chẽ. Người dùng không cần lo ngại biến động thị trường hay rủi ro tài chính.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3. Linh hoạt và minh bạch</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB cung cấp các gói đầu tư linh hoạt theo nhu cầu từng người dùng, đồng thời công khai tỷ suất lợi nhuận rõ ràng và có cập nhật định kỳ.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.4. Hỗ trợ toàn diện</h3>
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi có đội ngũ chuyên viên tư vấn đầu tư 1-1, sẵn sàng đồng hành và hỗ trợ mọi thắc mắc trong suốt quá trình đầu tư.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Chính sách bảo vệ người dùng */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-orange-600 font-bold text-lg">4</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">CHÍNH SÁCH BẢO VỆ NGƯỜI DÙNG</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1. An toàn tài khoản</h3>
                <p className="text-gray-700 leading-relaxed">
                  Người dùng cần giữ bí mật thông tin đăng nhập và không chia sẻ cho người khác. JSB luôn hỗ trợ khôi phục tài khoản nếu phát sinh sự cố.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2. Phòng chống lừa đảo</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB sử dụng hệ thống kiểm duyệt tự động và thủ công để phát hiện các hành vi lừa đảo hoặc giả mạo trên nền tảng. Mọi vi phạm sẽ bị xử lý nghiêm.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3. Hỗ trợ khiếu nại</h3>
                <p className="text-gray-700 leading-relaxed">
                  Người dùng có quyền gửi phản hồi hoặc khiếu nại về dịch vụ qua các kênh chính thức. Chúng tôi cam kết phản hồi trong vòng 24–72 giờ làm việc.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.4. Môi trường giao dịch lành mạnh</h3>
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi tạo ra một không gian đầu tư an toàn, minh bạch và văn minh. Mọi hành vi phá hoại cộng đồng sẽ bị loại trừ vĩnh viễn khỏi hệ thống.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Liên Hệ Hỗ Trợ</h3>
              <p className="text-gray-700 mb-4">
                Nếu bạn có bất kỳ câu hỏi nào về điều khoản sử dụng, vui lòng liên hệ với chúng tôi:
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center">
                  <span className="text-blue-600 font-semibold">Email:</span>
                  <span className="ml-2 text-gray-700">invest@jbssa.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 font-semibold">Hotline:</span>
                  <span className="ml-2 text-gray-700">+1 (800) 555-0199</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 