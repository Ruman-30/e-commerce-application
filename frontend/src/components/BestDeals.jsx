import { useNavigate } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import api from "../api/axios";

export default function BestDeals() {
  const navigate = useNavigate();
  const [bestDealsSmartphones, setBestDealsSmartphones] = useState([]);

  const handleBestDealsClick = (name) => {
    navigate(`/products?search=${name}`);
  };

  useEffect(() => {
    const fetchBestDeals = async () => {
      try {
        const res = await api.get(
          "/products?category=Electronics&subCategory=Mobiles"
        );
        setBestDealsSmartphones(res.data.products);
      } catch (err) {
        console.error("Error fetching best deals:", err);
      }
    };

    fetchBestDeals();
  }, []);

  if (!bestDealsSmartphones.length) return null;
    const trimName = (name, maxLength = 35) => {
    if (!name) return "";
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  };
  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-6  pl-2 sm:pl-4 md:pl-1">Best deals on smartphones</h2>

        <Swiper
          navigation={true}
          modules={[Navigation]}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 12 },   // Mobile
            640: { slidesPerView: 2, spaceBetween: 14 }, // Mobile larger
            768: { slidesPerView: 3, spaceBetween: 16 }, // Tablet
            1024: { slidesPerView: 5, spaceBetween: 20 }, // Desktop
          }}
        >
          {bestDealsSmartphones.map((cat, i) => (
            <SwiperSlide key={i}>
              <div
                onClick={() => handleBestDealsClick(cat.name)}
                className="flex flex-col items-center text-center justify-start bg-white p-2 sm:p-3 rounded-lg hover:shadow-lg transition cursor-pointer"
              >
                <img
                  src={cat.images?.[0]?.url}
                  alt={cat.name}
                  className="h-[18vh] sm:h-[22vh] md:h-[25vh] object-contain mb-1 sm:mb-2"
                />
                <p className="text-sm sm:text-base font-medium mb-1">{trimName(cat.name)}</p>
                <p className="text-sm sm:text-base font-semibold text-green-600">
                  <span>₹</span>{cat.price}
                </p>
              </div>  
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
