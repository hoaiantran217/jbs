import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import 'swiper/css';




const Doitacdautu = () => {
  
  const banks = [
    {
      name: "TPBank",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL9Cpp1nDLbzIrK_-ljQsqJOGbytIiiDAgmQ&s"
    },
    {
      name: "Vietcombank",
      img: "https://www.inlogo.vn/vnt_upload/File/Image/logo_VCB_828891.jpg"
    },
    {
      name: "BIDV",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2gAJj0_QOmJi9Jo_s0EFE9LCORfwFRLiSOg&s"
    },
    {
      name: "VietinBank",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBUlIVX-o9DEN6spNeph3SJ0giiQap9v6IUQ&s"
    },
    {
      name: "MB Bank",
      img: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/12/cach-xoa-tai-khoan-mb-bank-1.jpg"
    },
    {
      name: "ACB",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTahOP_Mj1jezkbsOgT2ioLyLjYtpe36g-lng&s"
    },
    
  ];

  const payments = [
    {
      name: "Momo",
      img: "data:image/png;base64,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"
    },
    {
      name: "ZaloPay",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTlp4qW2M8xPofmuZHwEfGi9mNMWUG0zs53A&s"
    },
    {
      name: "ShopeePay",
      img: "data:image/png;base64,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"
    },
    {
      name: "VNPay",  
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s"
    },
    {
      name: "Payoo",
      img: "data:image/jpeg;base64,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"
    },
    {
      name: "Napas",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP0fBWbrle2_eVC9GMhRaIIruCOFYrgCWtpA&s"
    },
    
  ];
  
  return (
    <section className="my-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Đối tác tài chính</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Hợp tác với các ngân hàng và cổng thanh toán uy tín hàng đầu Việt Nam
        </p>
      </div>

      {/* Ngân hàng liên kết */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">Ngân hàng liên kết</h3>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 }
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="max-w-6xl mx-auto"
        >
          {
            banks.map((bank) => (
              <SwiperSlide key={bank.name}>
                <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex flex-col justify-center items-center">
                  <div className="h-20 w-20 rounded flex items-center justify-center overflow-hidden">
                    <img src={bank.img} alt={bank.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-sm font-medium text-gray-700">{bank.name}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        
      </div>

      {/* Cổng thanh toán – Ví điện tử */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">Cổng thanh toán – Ví điện tử</h3>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          grabCursor
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 }
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          className="max-w-6xl mx-auto"
        >
          {payments.map((payment) => (
            <SwiperSlide key={payment.name}>
              <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex flex-col justify-center items-center">
                <div className="h-20 w-20 rounded flex items-center justify-center overflow-hidden">
                  <img src={payment.img} alt={payment.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm font-medium text-gray-700">{payment.name}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thông tin bổ sung */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Bảo mật & An toàn</h4>
          <p className="text-gray-600 mb-4">
            Tất cả giao dịch đều được mã hóa SSL và tuân thủ các tiêu chuẩn bảo mật quốc tế
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 max-w-4xl mx-auto justify-center gap-4 text-sm">
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              <span>Mã hóa SSL 256-bit</span>
            </div>
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              <span>PCI DSS Compliant</span>
            </div>
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              <span>24/7 Hỗ trợ</span>
            </div>
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              <span>Bảo mật 100%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doitacdautu;