import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "JBS có uy tín không? Có thật sự là công ty lớn không?",
      answer: "JBS là tập đoàn chế biến thịt lớn nhất thế giới, hoạt động tại hơn 190 quốc gia, sở hữu hơn 70 thương hiệu toàn cầu như Swift, Friboi, Pilgrim's, Seara... Đây là doanh nghiệp có doanh thu hàng chục tỷ USD mỗi năm và đã niêm yết trên sàn chứng khoán Brazil."
    },
    {
      question: "Tiền của tôi được sử dụng làm gì khi đầu tư vào JBS?",
      answer: "Tiền của bạn được đưa vào hệ sinh thái sản xuất – phân phối – xuất khẩu thịt và thực phẩm toàn cầu của JBS. Đây là chuỗi hoạt động thật, tạo dòng tiền ổn định nên việc chi trả lãi cho nhà đầu tư là hoàn toàn bền vững."
    },
    {
      question: "Tôi có rút gốc được không? Có bị khoá vốn lâu không?",
      answer: "Có. Tuỳ gói đầu tư, bạn có thể chọn gói ngắn hạn (1–30 ngày) hoặc dài hạn (60–210 ngày). Đặc biệt, JBS có chính sách rút gốc trước hạn trong một số gói linh hoạt, giúp bạn an tâm xoay vòng vốn."
    },
    {
      question: "Đầu tư vào JBS có rủi ro không? Ai đảm bảo?",
      answer: "JBS là công ty thật, hoạt động thật, doanh thu thật. Hệ sinh thái của JBS liên tục vận hành, lợi nhuận đến từ sản xuất thực phẩm – một nhu cầu thiết yếu. Không có rủi ro, nhờ tính minh bạch và lịch sử phát triển lâu dài."
    },
    {
      question: "Lãi nhận khi nào? Có rút về tài khoản được không?",
      answer: "Bạn nhận lãi hằng ngày hoặc theo chu kỳ tuỳ gói, có thể rút về ví hoặc tài khoản ngân hàng ngay sau khi đến hạn. Mọi giao dịch đều minh bạch và hiển thị rõ ràng trong hệ thống."
    },
    {
      question: "Tối thiểu cần bao nhiêu tiền để bắt đầu?",
      answer: "Chỉ từ 5.000.000 VND, bạn đã có thể đầu tư thử với gói 'Gold'n Plump Starter'. Đây là cách tốt để trải nghiệm trước khi quyết định tăng vốn."
    },
    {
      question: "Nếu tôi giới thiệu người khác đầu tư thì có được thưởng không?",
      answer: "Có. JBS có chính sách hoa hồng giới thiệu rõ ràng, minh bạch. Bạn vừa được nhận lãi từ khoản đầu tư, vừa được thưởng khi giới thiệu người mới – tạo ra dòng thu nhập kép."
    },
    {
      question: "Làm sao tôi biết đây không phải là mô hình lừa đảo?",
      answer: "JBS có lịch sử phát triển hơn 60 năm, có mặt tại hơn 190 quốc gia. Đây là công ty thật, sản phẩm thật, thương hiệu thật. Mọi khoản chi trả lãi đều từ hệ thống kinh doanh thực phẩm toàn cầu, không dựa vào tiền người sau trả cho người trước."
    },
    {
      question: "Tôi có hợp đồng hoặc cam kết gì không?",
      answer: "Có. Mỗi gói đầu tư đều có hợp đồng điện tử kèm mã ID riêng, bạn có thể theo dõi chi tiết trạng thái vốn, lãi, thời gian rút tiền. Tất cả đều lưu trữ và hiển thị công khai trong tài khoản cá nhân."
    },
    {
      question: "Tôi nên bắt đầu từ gói nào?",
      answer: "Nếu bạn mới, nên bắt đầu từ gói thấp để trải nghiệm hệ thống, ví dụ gói 1 ngày hoặc 30 ngày. Sau khi nhận đủ lãi và gốc, bạn có thể tự tin đầu tư các gói cao hơn với mức lãi suất ấn tượng hơn."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 opacity-0 animate-fade-in">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="text-gray-600 text-lg opacity-0 animate-fade-in-delay">
            Giải đáp những thắc mắc phổ biến về đầu tư JBS
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transform transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] opacity-0 animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 ease-in-out group"
              >
                <span className="font-semibold text-gray-800 text-sm md:text-base group-hover:text-blue-600 transition-colors duration-300">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 transform transition-all duration-300 ease-in-out">
                  {openIndex === index ? (
                    <ChevronUpIcon className="w-5 h-5 text-blue-600 rotate-180 transition-transform duration-300" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
                  )}
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-4 border-t border-gray-100">
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }
          
          .animate-fade-in-delay {
            animation: fade-in 0.8s ease-out 0.2s forwards;
          }
          
          .animate-slide-up {
            animation: slide-up 0.6s ease-out forwards;
          }
        `}</style>
      </div>
    </section>
  );
};

export default FAQ;