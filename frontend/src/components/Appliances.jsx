import { useNavigate } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import api from "../api/axios";

export default function Appliances() {
  const navigate = useNavigate();
  const [appliances, setAppliances] = useState([]);

  const handleBestDealsClick = (name) => {
    navigate(`/products?search=${name}`);
  };

  useEffect(() => {
    const fetchAppliances = async () => {
      try {
        const res = await api.get("/products?category=Home Appliances");
        setAppliances(res.data.products || []);
      } catch (err) {
        console.error("Error fetching appliances:", err);
      }
    };

    fetchAppliances();
  }, []);

  if (!appliances.length) return null;

  // Helper to trim product name
  const trimName = (name, maxLength = 35) => {
    if (!name) return "";
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 px-2 sm:px-0">
          Best deals on appliances
        </h2>

        <Swiper
          spaceBetween={15}
          slidesPerView={5}
          slidesPerGroup={3}
          speed={600}
          navigation
          modules={[Navigation]}
          breakpoints={{
            0: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 3,
              slidesPerGroup: 2,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 5,
              slidesPerGroup: 3,
              spaceBetween: 20,
            },
          }}
        >
          {appliances.map((cat) => (
            <SwiperSlide key={cat._id}>
              <div
                onClick={() => handleBestDealsClick(cat.name)}
                className="flex flex-col items-center text-center bg-white p-3 sm:p-4 rounded-lg hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex flex-col items-center mb-3 sm:mb-5">
                  <img
                    src={cat.images?.[0]?.url}
                    alt={cat.name}
                    className="h-[18vh] sm:h-[22vh] md:h-[25vh] object-contain mb-2"
                  />
                  <p className="font-medium text-sm sm:text-base md:text-lg">
                    {trimName(cat.name)}
                  </p>
                </div>
                <p className="font-semibold text-green-600 text-sm sm:text-base md:text-lg">
                  <span>₹</span>
                  {cat.price}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
