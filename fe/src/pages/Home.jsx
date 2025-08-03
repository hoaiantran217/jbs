import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import QuickActions from "./QuickActions";
import { useUser } from "../contexts/UserContext";
import { HotTitle, MarketInsight, RealTime, SocialProof, VipMember, PartnerTestimonials, BrandPartners, VideoSection } from "../components/Home";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import CountUpAnimation from "../components/CountUpAnimation";
import SecurityTest from "../components/SecurityTest";
import TeamMember from "../components/Home/TeamMember";

const heroImages = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1920&q=80",
    title: "Đầu tư thông minh, Tương lai vững chắc"
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1920&q=80",
    title: "Lợi nhuận cao, Rủi ro thấp"
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80",
    title: "Bảo mật tuyệt đối, Hỗ trợ 24/7"
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1920&q=80",
    title: "Nền tảng đầu tư hàng đầu Việt Nam"
  }
];


export default function Home() {
  const { user, refreshUser } = useUser();
  // Đảm bảo user data được cập nhật khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      refreshUser();
    }
  }, [user, refreshUser]);

  // Lắng nghe event khi user đăng nhập thành công
  useEffect(() => {
    const handleUserLoggedIn = () => {
      // Refresh user data khi user đăng nhập
      refreshUser();
    };

    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
    };
  }, [refreshUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-[100vh]">
        {/* Background Swiper */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="absolute inset-0 h-full"
        >
          {heroImages.map((hero) => (
            <SwiperSlide key={hero.id}>
              <div className="relative w-full max-h-screen h-full">
                <img
                  style={{ filter: 'brightness(0.8)'}}
                  src={hero.img}
                  alt={hero.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/60 to-indigo-900/70"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <VideoSection />

        {/* Static Content Overlay */}
        <div className="absolute top-0 left-0 w-full z-10 h-full flex items-center justify-center p-2">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="flex flex-col gap-4 items-center justify-center">
              <h1 className="text-center flex flex-col gap-1 items-center justify-center text-4xl sm:text-5xl md:text-6xl font-bold mb-4 ">JBS</h1>
              <p className="text-md md:text-2xl mb-8 text-blue-100">
                Nền tảng đầu tư thông minh vào ngành thực phẩm thiết yếu, giúp bạn tối ưu lợi nhuận, bảo toàn vốn và kiến tạo tương lai tài chính vững chắc.
              </p>
            </div>
            {/* Investment Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <CountUpAnimation 
                  end={10000} 
                  suffix="+" 
                  className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2 block"
                  duration={2500}
                  delay={200}
                />
                <div className="text-blue-100">Nhà đầu tư tin tưởng</div>
              </div>
              <div className="text-center">
                <CountUpAnimation 
                  end={500} 
                  suffix="+" 
                  className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2 block"
                  duration={2500}
                  delay={400}
                />
                <div className="text-blue-100">Tỷ đồng quản lý</div>
              </div>
              <div className="text-center">
                <CountUpAnimation 
                  end={32} 
                  suffix="%" 
                  className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2 block"
                  duration={2000}
                  delay={600}
                />
                <div className="text-blue-100">Lãi suất cao nhất</div>
              </div>
              <div className="text-center">
                <CountUpAnimation 
                  end={99} 
                  suffix="%" 
                  className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2 block"
                  duration={2000}
                  delay={800}
                />
                <div className="text-blue-100">Tỷ lệ hài lòng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <HotTitle />
      {/* Banner Section */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Thương hiệu của chúng tôi */}
        <BrandPartners />
        <QuickActions userBalance={user?.balance || 0} />
        {/* Bằng chứng uy tín (Social Proof) */}
        <SocialProof />

        

        {/* Đối tác nói gì về chúng tôi */}
        <PartnerTestimonials />

        {/* Realtime (Simulated-Virtual) Display */}
        <RealTime />
        {/* Market Insights */}
        <MarketInsight />
        {/* Team Member */}
        <TeamMember />
        {/* Danh sách thành viên vip */}
        <VipMember />
        {/* FAQ Section */}
        <FAQ />
        {/* Security Test (Development Only) */}
        {/* {process.env.NODE_ENV === 'development' && <SecurityTest />} */}
      </div>
       <Footer />
    </div>
  );
} 