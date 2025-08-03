import React, { useState } from 'react';
import { QuestionMarkCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      question: "JSB là gì và hoạt động như thế nào?",
      answer: "JSB là nền tảng đầu tư trực tuyến, kết nối nhà đầu tư với các dự án có tiềm năng cao. Chúng tôi sử dụng công nghệ hiện đại và mô hình quản lý tài chính chuyên nghiệp để đảm bảo lợi nhuận an toàn cho mọi nhà đầu tư."
    },
    {
      question: "Làm thế nào để bắt đầu đầu tư với JSB?",
      answer: "Để bắt đầu đầu tư, bạn cần: 1) Đăng ký tài khoản trên nền tảng JSB, 2) Xác minh danh tính, 3) Nạp tiền vào tài khoản, 4) Chọn gói đầu tư phù hợp và bắt đầu đầu tư."
    },
    {
      question: "Các gói đầu tư có lợi nhuận như thế nào?",
      answer: "JSB cung cấp các gói đầu tư đa dạng với lợi nhuận từ 15-80% năm tùy theo gói. Tất cả gói đều được đảm bảo an toàn và minh bạch về lợi nhuận."
    },
    {
      question: "Có rủi ro khi đầu tư với JSB không?",
      answer: "JSB cam kết 100% bảo vệ vốn đầu tư và lợi nhuận. Chúng tôi sử dụng hệ thống quản lý rủi ro đa tầng và đa dạng hóa đầu tư để đảm bảo an toàn cho nhà đầu tư."
    },
    {
      question: "Làm thế nào để rút tiền?",
      answer: "Bạn có thể rút tiền bất cứ lúc nào thông qua tài khoản ngân hàng đã đăng ký. Quá trình rút tiền được xử lý nhanh chóng trong vòng 24-48 giờ làm việc."
    },
    {
      question: "JSB có đảm bảo bảo mật thông tin không?",
      answer: "Có, JSB cam kết bảo vệ tuyệt đối thông tin cá nhân của người dùng. Chúng tôi sử dụng công nghệ mã hóa SSL/TLS và tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu."
    },
    {
      question: "Có phí giao dịch nào không?",
      answer: "JSB không thu phí nạp tiền. Phí rút tiền chỉ 0.5% (tối thiểu 10,000đ). Các giao dịch khác đều miễn phí."
    },
    {
      question: "Làm thế nào để liên hệ hỗ trợ?",
      answer: "Bạn có thể liên hệ hỗ trợ qua: Hotline +1 (800) 555-0199 (24/7), Email invest@jbssa.com, hoặc chat trực tuyến trên nền tảng."
    },
    {
      question: "JSB có giấy phép hoạt động không?",
      answer: "Có, JSB hoạt động theo đúng quy định pháp luật Việt Nam và có đầy đủ giấy phép cần thiết. Chúng tôi tuân thủ nghiêm ngặt các quy định về tài chính và đầu tư."
    },
    {
      question: "Có thể đầu tư với số tiền nhỏ không?",
      answer: "Có, JSB cung cấp các gói đầu tư linh hoạt từ 1 triệu đồng trở lên, phù hợp với mọi khả năng tài chính của nhà đầu tư."
    },
    {
      question: "Làm thế nào để theo dõi khoản đầu tư?",
      answer: "Bạn có thể theo dõi khoản đầu tư 24/7 thông qua dashboard trực tuyến, bao gồm lợi nhuận, tiến độ đầu tư và lịch sử giao dịch."
    },
    {
      question: "JSB có chương trình khuyến mãi không?",
      answer: "Có, JSB thường xuyên tổ chức các chương trình khuyến mãi, thưởng và sự kiện đặc biệt cho người dùng. Bạn có thể theo dõi trên nền tảng hoặc qua email."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <QuestionMarkCircleIcon className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Câu Hỏi Thường Gặp</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tìm hiểu thêm về JSB và các dịch vụ đầu tư của chúng tôi
          </p>
        </div>

        {/* FAQ Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  onClick={() => toggleItem(index)}
                >
                  <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                  {openItems.has(index) ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openItems.has(index) && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Không tìm thấy câu trả lời?</h3>
              <p className="text-gray-700 mb-6">
                Nếu bạn có câu hỏi khác hoặc cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng tôi:
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center">
                  <span className="text-indigo-600 font-semibold">Hotline:</span>
                  <span className="ml-2 text-gray-700">+1 (800) 555-0199</span>
                </div>
                <div className="flex items-center">
                  <span className="text-indigo-600 font-semibold">Email:</span>
                  <span className="ml-2 text-gray-700">invest@jbssa.com</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Thời gian hỗ trợ: 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 