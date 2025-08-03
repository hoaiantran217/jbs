import React from 'react'
import { Link } from 'react-router-dom';
import FacebookPagePlugin from "../components/FacebookPagePlugin";
import { images } from "../assets/images";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-green-500 text-white pt-6 pb-12 p-6"
      style={{
        background: 'url(https://triluat.com/public/uploads/d43a827389d4ea36ff943a9f0af9a496/images/cac-hinh-thuc-dau-tu-1.jpg) no-repeat center center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: 'overlay',
        backgroundOpacity: '0.5',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        
      }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Giới thiệu về JBS */}
            <div className="flex md:flex-col flex-row items-center justify-center md:items-start gap-4">
              <div className="w-20 h-20 p-2 bg-white rounded-full flex items-center justify-center">
                <img src={images.logo} alt="JBS" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-2 text-lg">JBS S.A.</h4>
                <p className="text-white text-sm">
                  Tập đoàn thực phẩm hàng đầu thế giới, chuyên sản xuất và chế biến thịt bò, thịt gà và thịt heo, với hoạt động tại hơn 20 quốc gia và sản phẩm phân phối tới hơn 150 quốc gia.
                </p>
                <p className="text-white text-sm mt-2">
                  Chúng tôi cam kết minh bạch, hiệu quả và an toàn trong mọi hoạt động đầu tư, hướng đến mục tiêu tăng trưởng lâu dài và chia sẻ giá trị bền vững với cộng đồng nhà đầu tư.
                </p>
              </div>
            </div>

            {/* Thông tin liên hệ */}
            <div className="md:text-lg text-sm flex flex-col gap-2">
              <h4 className="font-semibold text-white mb-4 text-lg underline underline-offset-4">Thông tin liên hệ</h4>
              <p className="text-white text-sm font-bold">JBS USA Headquarters</p>
              <p className="text-white text-sm">
                <span className="font-bold">Địa chỉ:</span><br />
                1770 Promontory Circle, Greeley, Colorado 80634, United States
              </p>
              <p className="text-white text-sm">
                <span className="font-bold">Hotline:</span> +1 (800) 555-0199
              </p>
              <p className="text-white text-sm">
                <span className="font-bold">Email:</span> invest@jbssa.com
              </p>
              <p className="text-white text-sm">
                <span className="font-bold">Website:</span> www.Jbsinv.com
              </p>
            </div>

            {/* Chính sách & Hỗ trợ */}
            <div className="md:text-lg text-sm flex flex-col gap-2">
              <h4 className="font-semibold text-white mb-4 text-lg underline underline-offset-4">Chính sách & Hỗ trợ đầu tư</h4>
              <div className="grid grid-cols-1 md:flex md:flex-col gap-2">
                <Link to="/faq" className="text-white text-sm hover:text-yellow-200 transition-colors">
                  • Câu hỏi thường gặp (FAQs)
                </Link>
                <Link to="/terms" className="text-white text-sm hover:text-yellow-200 transition-colors">
                  • Điều khoản & điều kiện đầu tư
                </Link>
                <Link to="/privacy" className="text-white text-sm hover:text-yellow-200 transition-colors">
                  • Chính sách bảo mật và tuân thủ pháp lý
                </Link>
                <Link to="/investment-guide" className="text-white text-sm hover:text-yellow-200 transition-colors">
                  • Hướng dẫn tham gia gói đầu tư
                </Link>
                <Link to="/protection" className="text-white text-sm hover:text-yellow-200 transition-colors">
                  • Cam kết bảo vệ nhà đầu tư
                </Link>
              </div>
            </div>

            {/* Chứng nhận & Tuân thủ pháp lý */}
            <div className="md:text-lg text-sm flex flex-col gap-2">
              <h4 className="font-semibold text-white mb-4 text-lg underline underline-offset-4">Chứng nhận & Tuân thủ pháp lý</h4>
              <div className="space-y-2">
                <p className="text-white text-sm">• Niêm yết trên sàn chứng khoán B3 – Brasil Bolsa Balcão (JBS.SA)</p>
                <p className="text-white text-sm">• Tuân thủ quy định của SEC (U.S. Securities and Exchange Commission)</p>
                <p className="text-white text-sm">• Bảo vệ nội dung bởi DMCA</p>
                <p className="text-white text-sm">• Được kiểm toán định kỳ bởi các đơn vị tài chính độc lập</p>
              </div>
              
              {/* Chứng nhận */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="md:w-[200px] w-[120px] flex items-center justify-center">
                  <img src="http://dangkywebvoibocongthuong.com/wp-content/uploads/2021/11/logo-da-thong-bao-bo-cong-thuong.png" alt="JBS" className="w-full h-full object-contain" />
                </div>
                <div className="md:w-[200px] w-[100px] flex items-center justify-center">
                  <img src='https://images.dmca.com/Badges/dmca-badge-w250-2x1-04.png' alt="DMCS" className="w-full h-full object-contain" /> 
                </div>
                <div className="md:w-[200px] w-[120px] flex items-center justify-center">
                  <img src='https://www.matbao.net/uploads/news/trilm/images/vnnic-la-gi-tong-quan-ve-vnnic-1.jpg' alt="VNNIC" className="w-full h-full object-contain" /> 
                </div>
              </div>
            </div>
          </div>

          {/* Cam kết bảo vệ nhà đầu tư */}
          <div className="border-t border-white mt-6 pt-6">
            <h4 className="font-semibold text-white mb-4 text-lg text-center">Cam Kết & Bảo Vệ Nhà Đầu Tư</h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="font-semibold text-yellow-200 mb-2">Tuân thủ pháp lý quốc tế</h5>
                <p className="text-white text-sm mb-2">
                  JBS hoạt động minh bạch và được giám sát bởi các cơ quan quản lý tài chính tại Mỹ và quốc tế, bao gồm U.S. Securities and Exchange Commission (SEC) và Ủy ban chứng khoán Brazil (CVM).
                </p>
              </div>
              <div>
                <h5 className="font-semibold text-yellow-200 mb-2">Bảo mật tài khoản & thông tin đầu tư</h5>
                <p className="text-white text-sm mb-2">
                  Toàn bộ hệ thống được bảo vệ bởi công nghệ mã hóa dữ liệu SSL 256-bit, hệ thống xác thực đa lớp (2FA) và giám sát giao dịch 24/7.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white mt-6 pt-6 text-center">
            <p className="text-sm text-white">© {new Date().getFullYear()} JBS S.A. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer