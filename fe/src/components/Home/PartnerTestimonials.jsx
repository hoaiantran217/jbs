import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { images } from "../../assets/images";
const partners = [
  {
    id: 1,
    name: "Shark Phạm Thanh Hưng",
    position: "Phó Chủ tịch HĐQT Cen Group, Nhà đầu tư tại Shark Tank Việt Nam",
    testimonial: "JBS đang làm điều mà nhiều doanh nghiệp tài chính mơ ước – đó là biến đầu tư thành một hành trình minh bạch, có định hướng và có chiều sâu chiến lược. Tôi đánh giá cao sự bài bản và tầm nhìn của đội ngũ JBS.",
    avatar: images.partners[0]
  },
  {
    id: 2,
    name: "Nguyễn Khánh Trình",
    position: "Founder & CEO CleverGroup – Tập đoàn Digital Marketing hàng đầu Việt Nam",
    testimonial: "Cách JBS triển khai các gói đầu tư không chỉ dựa vào con số, mà dựa trên niềm tin và sự hiểu biết thị trường rất sắc bén. Tôi đánh giá cao việc họ kết hợp công nghệ với tư duy tài chính hiện đại.",
    avatar: images.partners[1]
  },
  {
    id: 3,
    name: "Lê Diệp Kiều Trang (Christy Lê)",
    position: "Cựu CEO Facebook Việt Nam – Nhà đầu tư và cố vấn khởi nghiệp",
    testimonial: "Tôi nhìn thấy ở JBS sự kết hợp thú vị giữa tài chính truyền thống và đổi mới sáng tạo. Đây là hướng đi cần thiết trong thời đại tài chính số. Họ không chỉ thu hút vốn mà còn tạo dựng niềm tin.",
    avatar: images.partners[2]
  },
  {
    id: 4,
    name: "Nguyễn Hồng Trường",
    position: "Managing Partner tại IDG Ventures Vietnam – Quỹ đầu tư mạo hiểm hàng đầu",
    testimonial: "JBS sở hữu một đội ngũ hiểu rõ cách phát triển danh mục đầu tư một cách cân bằng giữa tăng trưởng và kiểm soát rủi ro. Đây là điểm mạnh hiếm có ở các mô hình đầu tư hiện nay.",
    avatar: images.partners[3]
  },
  {
    id: 5,
    name: "Đỗ Hữu Hưng",
    position: "CEO Accesstrade Việt Nam – Nền tảng tiếp thị liên kết hàng đầu",
    testimonial: "Tôi từng làm việc cùng nhiều tổ chức tài chính, nhưng JBS là một trong số ít đơn vị khiến tôi yên tâm khi đồng hành dài hạn. Họ rất hiểu thị trường và luôn giữ cam kết với nhà đầu tư.",
    avatar: images.partners[4]
  }
];

export default function PartnerTestimonials() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-0 md:px-4">
        {/* Header */}
        <div className="text-center mb-4 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ĐỐI TÁC NÓI GÌ VỀ CHÚNG TÔI
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            "Chúng tôi tin vào JBS vì sự minh bạch, chiến lược và cam kết lâu dài"
          </p>
        </div>

        {/* Testimonials Swiper */}
        <div className="max-w-6xl mx-auto">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="partner-testimonials-swiper"
          >
            {partners.map((partner) => (
              <SwiperSlide key={partner.id}>
                <div className="bg-white rounded-2xl md:p-4 p-4 h-full flex flex-col">
                    <div className="w-full h-[300px] rounded flex justify-center items-center overflow-hidden">
                      <img
                        src={partner.avatar}
                        alt={partner.name}
                        className="w-full h-full rounded object-cover"
                      />
                    </div>
                  {/* Partner Info */}
                  <div className="flex items-center mt-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {partner.name}
                      </h4>
                      <p className="text-sm text-gray-600 leading-tight">
                        {partner.position}
                      </p>
                      {/* Testimonial Text */}
                        <div className="flex-1 mb-6 mt-4">
                            <p className="text-gray-700 leading-relaxed text-sm italic">
                            "{partner.testimonial}"
                            </p>
                        </div>
                    </div>
                  </div>
                  
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom CSS for Swiper */}
        <style jsx>{`
          .partner-testimonials-swiper .swiper-pagination-bullet {
                    background: #000;
                    opacity: 0.3;
          }
          .partner-testimonials-swiper .swiper-pagination-bullet-active {
            opacity: 1;
            background: #000;
          }
        `}</style>
      </div>
    </section>
  );
} 