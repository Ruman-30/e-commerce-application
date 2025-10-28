import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroBanner() {
  return (
    <section className="w-full px-5 mt-4">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        speed={800}
        className="w-full"
      >
        {[
          "/images/hero/hero-banner-1.webp",
          "/images/hero/hero-banner-2.webp",
          "/images/hero/hero-banner-3.webp",
          "/images/hero/hero-banner-4.webp",
          "/images/hero/hero-banner-5.webp",
        ].map((src, i) => (
          <SwiperSlide key={i}>
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="
                w-full
                h-[160px]
                sm:h-[220px]
                md:h-[220px]
                lg:h-[220px]
                xl:h-[220px]
                object-cover
              "
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
