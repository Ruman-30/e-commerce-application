import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Dummy brand images (replace with real brand logos)
const brands = [
  { id: 1, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/05eb1220d6a55242.jpeg?q=60" },
  { id: 2, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/2f1232f58f267456.jpeg?q=60" },
  { id: 3, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/1346aa5e2179b255.jpeg?q=60" },
  { id: 4, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/2a6c66a585d43eb9.jpeg?q=60" },
  { id: 5, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/989c4391955072a9.jpeg?q=60" },
  { id: 6, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/c1627f4ff0e6ed7c.jpeg?q=60" },
  { id: 7, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/a3156436b9c22971.jpeg?q=60" },
  { id: 8, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/33045b8e5f88d994.jpeg?q=60" },
  { id: 9, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/f730bdaaf423ee51.jpeg?q=60" },
  { id: 10, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/5107eb54fb2d58fa.jpeg?q=60" },
  { id: 11, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/9c717697773f16f7.jpeg?q=60" },
  { id: 12, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/104c0a6f6cbb9667.jpeg?q=60" },
  { id: 13, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/035cbe35fa41a8f9.jpeg?q=60" },
  { id: 14, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/b84c9ffc274883d5.jpeg?q=60" },
  { id: 15, image: "https://rukminim2.flixcart.com/fk-p-flap/900/560/image/06f6b26cfb57ef3c.jpeg?q=60" },
];

const FeaturedBrands = () => {
  return (
    <section className="py-10 px-6">
      <h2 className="text-2xl font-bold mb-6">Featured Brands</h2>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={10}
        slidesPerView={3}
        slidesPerGroup={2} 
        speed={800}
      >
        {brands.map((brand) => (
          <SwiperSlide key={brand.id}>
            <div className="bg-white shadow-md rounded-xl cursor-pointer hover:shadow-lg transition">
              <img
                src={brand.image}
                alt={`Brand ${brand.id}`}
                className="w-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FeaturedBrands;
