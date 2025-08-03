import { useState } from "react";
import { GiftIcon, CurrencyDollarIcon, TrophyIcon, StarIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Rewards() {
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const milestones = [
    {
      id: 1,
      amount: "200 triệu",
      amountValue: 200000000,
      gift: "iPhone 15 Pro Max 256GB (mới 100%)",
      cashValue: "15.000.000đ",
      cashValueNumber: 15000000,
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
      gradientColor: "from-blue-500 to-blue-600",
      details: {
        description: "iPhone 15 Pro Max phiên bản cao cấp nhất với chip A17 Pro, camera 48MP, màn hình 6.7 inch Super Retina XDR OLED",
        features: [
          "Chip A17 Pro mạnh mẽ",
          "Camera 48MP với 5x zoom quang học",
          "Màn hình 6.7 inch Super Retina XDR OLED",
          "Titanium design cao cấp",
          "iOS 17 với nhiều tính năng mới"
        ],
        delivery: "Giao hàng tận nơi trong 7-10 ngày làm việc",
        warranty: "Bảo hành chính hãng 12 tháng"
      }
    },
    {
      id: 2,
      amount: "400 triệu",
      amountValue: 400000000,
      gift: "Xe máy Honda SH 150i ABS đời 2024",
      cashValue: "35.000.000đ",
      cashValueNumber: 35000000,
      color: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      iconColor: "text-green-600",
      gradientColor: "from-green-500 to-green-600",
      details: {
        description: "Honda SH 150i ABS phiên bản 2024 với thiết kế hiện đại, động cơ mạnh mẽ và hệ thống an toàn tiên tiến",
        features: [
          "Động cơ 150cc mạnh mẽ",
          "Hệ thống phanh ABS tiên tiến",
          "Thiết kế LED hiện đại",
          "Khoang chứa đồ rộng rãi",
          "Tiết kiệm nhiên liệu"
        ],
        delivery: "Giao xe tận nơi trong 15-20 ngày làm việc",
        warranty: "Bảo hành chính hãng 24 tháng"
      }
    },
    {
      id: 3,
      amount: "600 triệu",
      amountValue: 600000000,
      gift: "Apple MacBook Pro M3 14-inch hoặc combo iPhone 15 Pro + iPad Air",
      cashValue: "50.000.000đ",
      cashValueNumber: 50000000,
      color: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
      gradientColor: "from-yellow-500 to-yellow-600",
      details: {
        description: "Lựa chọn giữa MacBook Pro M3 14-inch hoặc combo iPhone 15 Pro + iPad Air cho trải nghiệm Apple hoàn hảo",
        features: [
          "MacBook Pro M3: Chip M3 mạnh mẽ, màn hình 14 inch Liquid Retina XDR",
          "iPhone 15 Pro: Camera 48MP, chip A17 Pro, thiết kế Titanium",
          "iPad Air: Màn hình 10.9 inch, chip M1, hỗ trợ Apple Pencil",
          "Tích hợp hoàn hảo giữa các thiết bị",
          "iCloud sync và AirDrop"
        ],
        delivery: "Giao hàng tận nơi trong 7-10 ngày làm việc",
        warranty: "Bảo hành chính hãng 12 tháng"
      }
    },
    {
      id: 4,
      amount: "1 tỷ",
      amountValue: 1000000000,
      gift: "Xe Honda SH Mode 125 CBS đời 2024",
      cashValue: "45.000.000đ",
      cashValueNumber: 45000000,
      color: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
      iconColor: "text-orange-600",
      gradientColor: "from-orange-500 to-orange-600",
      details: {
        description: "Honda SH Mode 125 CBS phiên bản 2024 với thiết kế thời trang, động cơ tiết kiệm nhiên liệu",
        features: [
          "Động cơ 125cc tiết kiệm nhiên liệu",
          "Hệ thống phanh CBS an toàn",
          "Thiết kế LED hiện đại",
          "Khoang chứa đồ tiện lợi",
          "Giá trị bán lại cao"
        ],
        delivery: "Giao xe tận nơi trong 15-20 ngày làm việc",
        warranty: "Bảo hành chính hãng 24 tháng"
      }
    },
    {
      id: 5,
      amount: "1,5 tỷ",
      amountValue: 1500000000,
      gift: "Chuyến du lịch 5 sao châu Á 2 người (Singapore, Nhật Bản, Hàn Quốc - 7 ngày 6 đêm)",
      cashValue: "70.000.000đ",
      cashValueNumber: 70000000,
      color: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      iconColor: "text-red-600",
      gradientColor: "from-red-500 to-red-600",
      details: {
        description: "Chuyến du lịch cao cấp 7 ngày 6 đêm khám phá 3 quốc gia châu Á với dịch vụ 5 sao",
        features: [
          "Vé máy bay khứ hồi hạng thương gia",
          "Khách sạn 5 sao tại mỗi điểm đến",
          "Hướng dẫn viên chuyên nghiệp",
          "Bữa ăn cao cấp tại nhà hàng Michelin",
          "Bảo hiểm du lịch toàn diện"
        ],
        delivery: "Lên lịch và đặt chỗ trong 30-45 ngày",
        warranty: "Bảo hiểm du lịch toàn diện"
      }
    },
    {
      id: 6,
      amount: "2 tỷ",
      amountValue: 2000000000,
      gift: "Xe ô tô Kia Seltos Premium 2025",
      cashValue: "350.000.000đ",
      cashValueNumber: 350000000,
      color: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
      iconColor: "text-purple-600",
      gradientColor: "from-purple-500 to-purple-600",
      details: {
        description: "Kia Seltos Premium 2025 với thiết kế hiện đại, công nghệ tiên tiến và an toàn vượt trội",
        features: [
          "Động cơ 1.6L Turbo mạnh mẽ",
          "Hệ thống an toàn ADAS tiên tiến",
          "Màn hình 10.25 inch với Apple CarPlay/Android Auto",
          "Thiết kế LED hiện đại",
          "Khoang nội thất rộng rãi"
        ],
        delivery: "Giao xe tận nơi trong 30-45 ngày làm việc",
        warranty: "Bảo hành chính hãng 60 tháng"
      }
    },
    {
      id: 7,
      amount: "3,5 tỷ",
      amountValue: 3500000000,
      gift: "Chuyến du lịch châu Âu cao cấp 2 người (Pháp, Ý, Thụy Sĩ – 10 ngày 9 đêm)",
      cashValue: "500.000.000đ",
      cashValueNumber: 500000000,
      color: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-800",
      iconColor: "text-indigo-600",
      gradientColor: "from-indigo-500 to-indigo-600",
      details: {
        description: "Chuyến du lịch châu Âu cao cấp 10 ngày 9 đêm khám phá 3 quốc gia với dịch vụ VIP",
        features: [
          "Vé máy bay khứ hồi hạng nhất",
          "Khách sạn 5 sao tại Paris, Rome, Zurich",
          "Hướng dẫn viên riêng chuyên nghiệp",
          "Bữa ăn tại nhà hàng Michelin 3 sao",
          "Bảo hiểm du lịch cao cấp"
        ],
        delivery: "Lên lịch và đặt chỗ trong 60-90 ngày",
        warranty: "Bảo hiểm du lịch toàn diện"
      }
    },
    {
      id: 8,
      amount: "5 tỷ",
      amountValue: 5000000000,
      gift: "Xe ô tô VinFast VF8 Plus bản cao cấp",
      cashValue: "750.000.000đ",
      cashValueNumber: 750000000,
      color: "from-pink-50 to-pink-100",
      borderColor: "border-pink-200",
      bgColor: "bg-pink-50",
      textColor: "text-pink-800",
      iconColor: "text-pink-600",
      gradientColor: "from-pink-500 to-pink-600",
      details: {
        description: "VinFast VF8 Plus phiên bản cao cấp nhất với công nghệ điện hiện đại và thiết kế sang trọng",
        features: [
          "Động cơ điện mạnh mẽ 402 mã lực",
          "Pin 87.7 kWh với quãng đường 471km",
          "Hệ thống ADAS tiên tiến",
          "Màn hình 15.4 inch với VinAI",
          "Thiết kế LED hiện đại"
        ],
        delivery: "Giao xe tận nơi trong 45-60 ngày làm việc",
        warranty: "Bảo hành chính hãng 84 tháng"
      }
    }
  ];

  const handleMilestoneClick = (milestone) => {
    setSelectedMilestone(milestone);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMilestone(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-blue-900">
            Phần thưởng dành cho thành viên
          </h1>
        </div>

        {/* Program Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <TrophyIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">📌 Áp dụng cho thành viên</h3>
                  <p className="text-gray-600">Có tổng số tiền đầu tư từ 200.000.000đ đến 5.000.000.000đ</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">📆 Điều kiện nhận thưởng</h3>
                  <p className="text-gray-600">Khi người dùng đạt mốc đầu tư và giữ vốn trong 30 ngày liên tục</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">💰 Quy đổi tiền mặt</h3>
                  <p className="text-gray-600">Có thể quy đổi sang tiền mặt tương ứng theo giá trị phần thưởng</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <StarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">🎯 8 MỐC PHẦN THƯỞNG</h3>
                  <p className="text-gray-600">Quà tặng cao cấp cho từng mốc đầu tư</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Swiper */}
        <div className="mb-8">
          <div className="relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              className="milestones-swiper"
            >
              {milestones.map((milestone) => (
                <SwiperSlide key={milestone.id}>
                  <div
                    className={`bg-gradient-to-br ${milestone.color} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${milestone.borderColor} h-full`}
                    onClick={() => handleMilestoneClick(milestone)}
                  >
                    <div className="text-center mb-4">
                      <div className={`bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-lg font-bold`}>
                        {milestone.id}
                      </div>
                      <h3 className={`text-xl font-bold ${milestone.textColor} mb-2`}>
                        Đầu tư: {milestone.amount}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div className={`bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-white/50`}>
                        <div className="flex items-center gap-2 mb-2">
                          <GiftIcon className={`w-5 h-5 ${milestone.iconColor}`} />
                          <span className={`font-semibold ${milestone.textColor}`}>🎁 Quà tặng</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {milestone.gift}
                        </p>
                      </div>

                      <div className={`bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-white/50`}>
                        <div className="flex items-center gap-2 mb-2">
                          <CurrencyDollarIcon className={`w-5 h-5 ${milestone.iconColor}`} />
                          <span className={`font-semibold ${milestone.textColor}`}>💵 Hoặc quy đổi</span>
                        </div>
                        <p className={`text-lg font-bold ${milestone.textColor}`}>
                          {milestone.cashValue}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <div className="swiper-button-prev !text-purple-600 !bg-white/80 !backdrop-blur-sm !w-10 !h-10 !rounded-full !shadow-lg hover:!bg-white transition-all duration-200"></div>
            <div className="swiper-button-next !text-purple-600 !bg-white/80 !backdrop-blur-sm !w-10 !h-10 !rounded-full !shadow-lg hover:!bg-white transition-all duration-200"></div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-6">
            <div className="swiper-pagination !relative !bottom-0 !w-auto"></div>
          </div>
        </div>

        {/* Program Rules */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📌 QUY ĐỊNH CHƯƠNG TRÌNH
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-gray-700">
                  Mỗi tài khoản chỉ nhận 1 phần thưởng tương ứng với mốc cao nhất đã đạt được
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-700">
                  Phần thưởng được giao tận nơi hoặc chuyển khoản theo yêu cầu
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                  <CheckCircleIcon className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-gray-700">
                  Người dùng có quyền chọn giữ quà hoặc nhận tiền mặt tương ứng
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
                  <CheckCircleIcon className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-gray-700">
                  Quyết định cuối cùng thuộc về hệ thống trong trường hợp có tranh chấp
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            🚀 Đầu tư càng nhiều – phần thưởng càng xịn!
          </h2>
          <p className="text-xl mb-6 opacity-90">
            🎉 Ưu đãi đặc biệt cho nhà đầu tư cam kết lâu dài và nghiêm túc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Xem gói đầu tư
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedMilestone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-gradient-to-br ${selectedMilestone.color} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${selectedMilestone.gradientColor} text-white p-6 rounded-t-2xl relative`}>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <GiftIcon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Mốc {selectedMilestone.id}</h2>
                <p className="text-xl opacity-90">{selectedMilestone.amount}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Gift Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <h3 className={`text-2xl font-bold ${selectedMilestone.textColor} mb-4 flex items-center gap-3`}>
                  <GiftIcon className={`w-8 h-8 ${selectedMilestone.iconColor}`} />
                  🎁 Quà tặng chính
                </h3>
                <p className="text-lg font-semibold text-gray-800 mb-3">
                  {selectedMilestone.gift}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {selectedMilestone.details.description}
                </p>
              </div>

              {/* Cash Value */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <h3 className={`text-2xl font-bold ${selectedMilestone.textColor} mb-4 flex items-center gap-3`}>
                  <CurrencyDollarIcon className={`w-8 h-8 ${selectedMilestone.iconColor}`} />
                  💵 Giá trị quy đổi
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  {selectedMilestone.cashValue}
                </p>
                <p className="text-gray-600 mt-2">
                  Có thể nhận tiền mặt thay vì quà tặng
                </p>
              </div>

              {/* Features */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <h3 className={`text-2xl font-bold ${selectedMilestone.textColor} mb-4`}>
                  ✨ Tính năng nổi bật
                </h3>
                <ul className="space-y-3">
                  {selectedMilestone.details.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full ${selectedMilestone.bgColor} mt-2 flex-shrink-0`}></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quy định và Cách thức tham gia */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <h3 className={`text-2xl font-bold ${selectedMilestone.textColor} mb-4 flex items-center gap-3`}>
                  <CheckCircleIcon className={`w-8 h-8 ${selectedMilestone.iconColor}`} />
                  📋 Quy định & Cách thức tham gia
                </h3>
                
                <div className="space-y-4">
                  {/* Điều kiện tham gia */}
                  <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-200/50">
                    <h4 className={`font-semibold ${selectedMilestone.textColor} mb-2 flex items-center gap-2`}>
                      <TrophyIcon className={`w-5 h-5 ${selectedMilestone.iconColor}`} />
                      🎯 Điều kiện tham gia
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedMilestone.bgColor} mt-2 flex-shrink-0`}></div>
                        <span>Đạt mốc đầu tư {selectedMilestone.amount} trong tổng danh mục</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedMilestone.bgColor} mt-2 flex-shrink-0`}></div>
                        <span>Giữ vốn trong 30 ngày liên tục không rút</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedMilestone.bgColor} mt-2 flex-shrink-0`}></div>
                        <span>Tài khoản đã xác thực và hoạt động bình thường</span>
                      </li>
                    </ul>
                  </div>

                  {/* Cách thức nhận thưởng */}
                  <div className="bg-green-50/50 rounded-lg p-4 border border-green-200/50">
                    <h4 className={`font-semibold ${selectedMilestone.textColor} mb-2 flex items-center gap-2`}>
                      <GiftIcon className={`w-5 h-5 ${selectedMilestone.iconColor}`} />
                      🎁 Cách thức nhận thưởng
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedMilestone.bgColor} mt-2 flex-shrink-0`}></div>
                        <span>Hệ thống tự động kiểm tra và thông báo khi đủ điều kiện</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedMilestone.bgColor} mt-2 flex-shrink-0`}></div>
                        <span>Liên hệ với đội ngũ hỗ trợ để xác nhận lựa chọn quà/tiền</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedMilestone.bgColor} mt-2 flex-shrink-0`}></div>
                        <span>Giao hàng tận nơi hoặc chuyển khoản trong 7-15 ngày</span>
                      </li>
                    </ul>
                  </div>

                  {/* Lưu ý quan trọng */}
                  <div className="bg-orange-50/50 rounded-lg p-4 border border-orange-200/50">
                    <h4 className={`font-semibold ${selectedMilestone.textColor} mb-2 flex items-center gap-2`}>
                      <StarIcon className={`w-5 h-5 ${selectedMilestone.iconColor}`} />
                      ⚠️ Lưu ý quan trọng
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedMilestone.bgColor} mt-2 flex-shrink-0`}></div>
                        <span>Mỗi tài khoản chỉ nhận 1 phần thưởng cao nhất đã đạt được</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedMilestone.bgColor} mt-2 flex-shrink-0`}></div>
                        <span>Không thể tích lũy hoặc chuyển nhượng phần thưởng</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedMilestone.bgColor} mt-2 flex-shrink-0`}></div>
                        <span>Quyết định cuối cùng thuộc về hệ thống trong trường hợp tranh chấp</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`bg-gradient-to-r ${selectedMilestone.gradientColor} text-white p-6 rounded-b-2xl`}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Chọn quà tặng này
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors">
                  Nhận tiền mặt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .milestones-swiper .swiper-slide {
          height: auto;
        }
        
        .milestones-swiper .swiper-button-next,
        .milestones-swiper .swiper-button-prev {
          color: #000 !important;
        }
      `}</style>
    </div>
  );
} 