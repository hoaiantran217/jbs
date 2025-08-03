import React from 'react';
import { LockClosedIcon, ShieldCheckIcon, EyeIcon, KeyIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <LockClosedIcon className="w-12 h-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Chính Sách Bảo Mật</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            JSB cam kết bảo vệ thông tin cá nhân của bạn với các tiêu chuẩn bảo mật cao nhất.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          
          {/* Section 1: Tổng quan */}
          <section className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold text-lg">1</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">TỔNG QUAN VỀ BẢO MẬT</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-600" />
                  1.1. Cam kết bảo mật
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB cam kết bảo vệ quyền riêng tư và thông tin cá nhân của người dùng. Chúng tôi tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu cá nhân theo pháp luật Việt Nam và các tiêu chuẩn quốc tế.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2. Phạm vi áp dụng</h3>
                <p className="text-gray-700 leading-relaxed">
                  Chính sách bảo mật này áp dụng cho tất cả thông tin mà chúng tôi thu thập từ người dùng khi sử dụng nền tảng JSB, bao gồm website, ứng dụng di động và các dịch vụ liên quan.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3. Cập nhật chính sách</h3>
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Mọi thay đổi sẽ được thông báo qua email hoặc thông báo trên nền tảng trước khi có hiệu lực.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Thông tin thu thập */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">THÔNG TIN CHÚNG TÔI THU THẬP</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-600" />
                  2.1. Thông tin cá nhân
                </h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>Chúng tôi thu thập các thông tin sau:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Thông tin định danh:</strong> Họ tên, ngày sinh, giới tính, CMND/CCCD</li>
                    <li><strong>Thông tin liên lạc:</strong> Email, số điện thoại, địa chỉ</li>
                    <li><strong>Thông tin tài chính:</strong> Số tài khoản ngân hàng, thông tin thẻ</li>
                    <li><strong>Thông tin giao dịch:</strong> Lịch sử đầu tư, nạp/rút tiền</li>
                    <li><strong>Thông tin kỹ thuật:</strong> IP, thiết bị, trình duyệt, hệ điều hành</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2. Thông tin tự động</h3>
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi sử dụng cookies và công nghệ tương tự để thu thập thông tin về cách bạn sử dụng nền tảng, bao gồm thời gian truy cập, trang được xem và các tương tác khác.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3. Thông tin từ bên thứ ba</h3>
                <p className="text-gray-700 leading-relaxed">
                  Trong một số trường hợp, chúng tôi có thể nhận thông tin từ các đối tác, cơ quan chính phủ hoặc các nguồn công khai khác để xác minh danh tính và tuân thủ quy định pháp luật.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Sử dụng thông tin */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">CÁCH CHÚNG TÔI SỬ DỤNG THÔNG TIN</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1. Mục đích sử dụng</h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>Thông tin của bạn được sử dụng để:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Xác minh danh tính và tạo tài khoản</li>
                    <li>Xử lý giao dịch đầu tư và thanh toán</li>
                    <li>Cung cấp dịch vụ khách hàng và hỗ trợ</li>
                    <li>Gửi thông báo quan trọng về tài khoản</li>
                    <li>Cải thiện nền tảng và trải nghiệm người dùng</li>
                    <li>Tuân thủ quy định pháp luật và báo cáo</li>
                    <li>Phòng chống gian lận và rửa tiền</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2. Cơ sở pháp lý</h3>
                <p className="text-gray-700 leading-relaxed">
                  Việc xử lý thông tin cá nhân của bạn dựa trên các cơ sở pháp lý sau: thực hiện hợp đồng, tuân thủ nghĩa vụ pháp lý, lợi ích hợp pháp và sự đồng ý của bạn.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3. Thời gian lưu trữ</h3>
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi lưu trữ thông tin cá nhân trong thời gian cần thiết để thực hiện các mục đích đã nêu hoặc theo yêu cầu pháp luật. Thông tin sẽ được xóa hoặc ẩn danh hóa khi không còn cần thiết.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Chia sẻ thông tin */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-orange-600 font-bold text-lg">4</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">CHIA SẺ THÔNG TIN</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1. Cam kết không chia sẻ</h3>
                <p className="text-gray-700 leading-relaxed">
                  JSB cam kết không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ ba nào vì mục đích thương mại mà không có sự đồng ý rõ ràng của bạn.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2. Chia sẻ có điều kiện</h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>Chúng tôi có thể chia sẻ thông tin trong các trường hợp sau:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Với sự đồng ý của bạn:</strong> Khi bạn cho phép chia sẻ thông tin cụ thể</li>
                    <li><strong>Đối tác dịch vụ:</strong> Các công ty cung cấp dịch vụ hỗ trợ cho JSB</li>
                    <li><strong>Tuân thủ pháp luật:</strong> Khi có yêu cầu từ cơ quan chính phủ</li>
                    <li><strong>Bảo vệ quyền lợi:</strong> Để bảo vệ quyền lợi của JSB và người dùng khác</li>
                    <li><strong>Giao dịch kinh doanh:</strong> Trong trường hợp sáp nhập hoặc mua lại</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3. Bảo mật đối tác</h3>
                <p className="text-gray-700 leading-relaxed">
                  Tất cả đối tác của chúng tôi đều được yêu cầu ký thỏa thuận bảo mật và chỉ được phép sử dụng thông tin theo mục đích đã được thỏa thuận.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Quyền của người dùng */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold text-lg">5</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">QUYỀN CỦA NGƯỜI DÙNG</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <KeyIcon className="w-5 h-5 mr-2 text-red-600" />
                  5.1. Quyền truy cập và kiểm soát
                </h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>Bạn có các quyền sau đối với thông tin cá nhân của mình:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Quyền truy cập:</strong> Xem thông tin cá nhân mà chúng tôi đang lưu trữ</li>
                    <li><strong>Quyền chỉnh sửa:</strong> Cập nhật thông tin cá nhân không chính xác</li>
                    <li><strong>Quyền xóa:</strong> Yêu cầu xóa thông tin cá nhân trong một số trường hợp</li>
                    <li><strong>Quyền hạn chế:</strong> Yêu cầu hạn chế xử lý thông tin</li>
                    <li><strong>Quyền di chuyển:</strong> Nhận thông tin cá nhân ở định dạng có thể đọc</li>
                    <li><strong>Quyền phản đối:</strong> Phản đối việc xử lý thông tin trong một số trường hợp</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2. Cách thực hiện quyền</h3>
                <p className="text-gray-700 leading-relaxed">
                  Để thực hiện các quyền trên, bạn có thể liên hệ với chúng tôi qua email hoặc hotline. Chúng tôi sẽ phản hồi trong vòng 30 ngày kể từ khi nhận được yêu cầu.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3. Từ chối quyền</h3>
                <p className="text-gray-700 leading-relaxed">
                  Trong một số trường hợp, chúng tôi có thể từ chối yêu cầu của bạn, ví dụ như khi cần thiết để tuân thủ nghĩa vụ pháp lý hoặc bảo vệ quyền lợi hợp pháp của JSB.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Bảo mật dữ liệu */}
          <section className="space-y-6 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-indigo-600 font-bold text-lg">6</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">BẢO MẬT DỮ LIỆU</h2>
            </div>

            <div className="space-y-6 ml-14">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <EyeIcon className="w-5 h-5 mr-2 text-indigo-600" />
                  6.1. Biện pháp bảo mật
                </h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>Chúng tôi áp dụng các biện pháp bảo mật sau:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Mã hóa dữ liệu:</strong> Sử dụng mã hóa SSL/TLS cho tất cả giao dịch</li>
                    <li><strong>Bảo mật vật lý:</strong> Kiểm soát truy cập vào trung tâm dữ liệu</li>
                    <li><strong>Kiểm soát truy cập:</strong> Hạn chế quyền truy cập thông tin nhạy cảm</li>
                    <li><strong>Giám sát liên tục:</strong> Theo dõi và phát hiện hoạt động bất thường</li>
                    <li><strong>Đào tạo nhân viên:</strong> Nâng cao nhận thức về bảo mật</li>
                    <li><strong>Sao lưu định kỳ:</strong> Đảm bảo dữ liệu không bị mất</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2. Xử lý sự cố bảo mật</h3>
                <p className="text-gray-700 leading-relaxed">
                  Trong trường hợp xảy ra sự cố bảo mật, chúng tôi sẽ thông báo cho bạn và cơ quan chức năng trong vòng 72 giờ, đồng thời thực hiện các biện pháp khắc phục ngay lập tức.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3. Bảo mật của bạn</h3>
                <p className="text-gray-700 leading-relaxed">
                  Bạn cũng có trách nhiệm bảo vệ thông tin của mình bằng cách: không chia sẻ mật khẩu, đăng xuất sau khi sử dụng, cập nhật phần mềm thường xuyên và báo cáo hoạt động đáng ngờ.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Liên Hệ Về Bảo Mật</h3>
              <p className="text-gray-700 mb-4">
                Nếu bạn có câu hỏi về chính sách bảo mật hoặc muốn thực hiện quyền của mình, vui lòng liên hệ:
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center">
                  <span className="text-green-600 font-semibold">Email:</span>
                  <span className="ml-2 text-gray-700">invest@jbssa.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 font-semibold">Hotline:</span>
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

export default Privacy; 