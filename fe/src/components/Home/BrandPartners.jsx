import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

// Dữ liệu thương hiệu mẫu - bạn có thể thay thế bằng ảnh thực tế
const brands = [
  {
    id: 1,
    name: "Thương hiệu 1",
    logo: "https://jbs-foods.imgix.net/e4bfcda5-105d-4736-952f-87b169201a58/swiftmeats.png?auto=compress%2Cformat&fill=solid&fill-color=white&fit=fill&fm=jpg&h=224&q=80&w=224",
    description: "Đối tác chiến lược"
  },
  {
    id: 2,
    name: "Thương hiệu 2", 
    logo: "https://jbs-foods.imgix.net/d24c6d33-cef3-41a9-8782-6d860b798fd7/AspenRidge2019.png?auto=compress%2Cformat&fill=solid&fill-color=white&fit=fill&fm=jpg&h=224&q=80&w=224",
    description: "Đối tác uy tín"
  },
  {
    id: 3,
    name: "Thương hiệu 3",
    logo: "https://jbs-foods.imgix.net/0ea3d854-e73c-45aa-91b4-2a5a64d134fb/justbare.png?auto=compress%2Cformat&fill=solid&fill-color=white&fit=fill&fm=jpg&h=224&q=80&w=224", 
    description: "Đối tác hàng đầu"
  },
  {
    id: 4,
    name: "Thương hiệu 4",
    logo: "https://jbs-foods.imgix.net/70cb1ac1-6538-4c16-a83f-657a79ae3f7f/Pilgrims2024Logo.png?auto=compress%2Cformat&fill=solid&fill-color=white&fit=fill&fm=jpg&h=224&q=80&w=224",
    description: "Đối tác toàn cầu"
  },
  {
    id: 5,
    name: "Thương hiệu 5",
    logo: "https://jbs-foods.imgix.net/f438a11b-5b5e-4ad8-830e-312a5c3fda06/GreatSouthern.png?auto=compress%2Cformat&fill=solid&fill-color=white&fit=fill&fm=jpg&h=224&q=80&w=224",
    description: "Đối tác chiến lược"
  },
  {
    id: 6,
    name: "Thương hiệu 6",
    logo: "https://jbs-foods.imgix.net/ee271f7a-aeef-4d33-bd04-32b63530c10a/Primo_Master_Logo_CMYK.png?auto=compress%2Cformat&fill=solid&fill-color=white&fit=fill&fm=jpg&h=224&q=80&w=224",
    description: "Đối tác uy tín"
  },
  {
    id: 7,
    name: "Thương hiệu 7",
    logo: "https://jbs-foods.imgix.net/e22ceaaf-6b93-46e9-a1f8-3fa5a7370699/1855logowithblackangusbeeftagline_blackbackground.jpg?auto=compress%2Cformat&fill=solid&fill-color=white&fit=fill&fm=jpg&h=160&q=80&w=160",
    description: "Đối tác hàng đầu"
  },
  {
    id: 8,
    name: "Thương hiệu 8",
    logo: "https://jbs-foods.imgix.net/af20ed86-c5dd-49d4-aa48-709a199f504f/AdaptableLogo_RGB_Registered.png?auto=compress%2Cformat&fill=solid&fill-color=white&fit=fill&fm=jpg&h=160&q=80&w=160",
    description: "Đối tác toàn cầu"
  },
  {
    id: 9,
    name: "Thương hiệu 9",
    logo: "https://jbs-foods.imgix.net/64fadb0d-0371-405b-9d58-692b04193bb8/AberdeenBlacknoBackgroundblackwriting.png?auto=compress%2Cformat&fill=solid&fill-color=white&fit=fill&fm=jpg&h=160&q=80&w=160",
    description: "Đối tác hàng đầu"
  },
];

export default function BrandPartners() {
  return (
    <section className="py-4 mb-4 md:py-16 bg-white rounded-lg px-2 shadow-md">
      <div className="max-w-6xl mx-auto px-2 md:px-4">
        {/* Header */}
        <div className="text-center mb-4 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thương hiệu chúng tôi
          </h2>
          <p className="text-sm md:text-lg text-justify text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Với danh mục thương hiệu đa dạng và đẳng cấp quốc tế, chúng tôi hiện diện tại hơn 180 quốc gia, 
            mang đến các sản phẩm uy tín cùng giải pháp đột phá cho người tiêu dùng toàn cầu
          </p>
        </div>

       

        {/* Brands Swiper */}
        <div className="relative">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
            loop={true}
            slidesPerView={2}
            spaceBetween={30}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 50,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 60,
              },
            }}
            className="brands-swiper"
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <div className="bg-transparent rounded-lg p-6 h-48 flex flex-col items-center justify-center transition-all duration-300">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-full w-auto object-contain"
                  />
                  {/* <p className="text-xs text-gray-500 text-center">{brand.name}</p> */}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>


      {/* Custom CSS for swiper */}
      <style jsx>{`
        .brands-swiper .swiper-slide {
          height: auto;
        }
        .brands-swiper .swiper-slide img {
          
          transition: filter 0.3s ease;
        }
       
      `}</style>
    </section>
  );
} 