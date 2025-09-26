import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function HeroBanner() {
  return (
    <section className="w-full p-6">  
           <Swiper
             modules={[Autoplay, Pagination, Navigation]}
             autoplay={{ delay:2000, disableOnInteraction: false }}
             pagination={{ clickable: true }}
             navigation={true}
             loop={true}
             speed={800}
             className="w-full h-[200px] md:h-[200px]"
           >
             <SwiperSlide>
               <img
                 src="/public/images/hero/hero-banner-1.webp"
                 alt="Slide 1"
                 className="w-full h-full object-cover"
               />
             </SwiperSlide>
             <SwiperSlide>
               <img
                 src="/public/images/hero/hero-banner-2.webp"
                 alt="Slide 2"
                 className="w-full h-full object-cover"
               />
             </SwiperSlide>
             <SwiperSlide>
               <img
                 src="/public/images/hero/hero-banner-3.webp"
                 alt="Slide 3"
                 className="w-full h-full object-cover"
               />
             </SwiperSlide>
             <SwiperSlide>
               <img
                 src="/public/images/hero/hero-banner-4.webp"
                 alt="Slide 4"
                 className="w-full h-full object-cover"
               />
             </SwiperSlide>
             <SwiperSlide>
               <img
                 src="/public/images/hero/hero-banner-5.webp"
                 alt="Slide 5"
                 className="w-full h-full object-cover"
               />
             </SwiperSlide>
           </Swiper>
         </section>
  );
}
