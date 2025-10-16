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
        ); // Adjust endpoint
        setBestDealsSmartphones(res.data.products);
        // console.log(res.data.products);
      } catch (err) {
        console.error("Error fetching best deals:", err);
      }
    };

    fetchBestDeals();
  }, []);

  if (!bestDealsSmartphones.length) return null; // Or show a loader

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Best deals on smartphones</h2>

        <Swiper
          slidesPerView={1}
          navigation={true}
          modules={[Navigation]}
          className="category-swiper"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="grid grid-cols-5 gap-6">
              {bestDealsSmartphones.slice(0, 5).map((cat, i) => (
                <div
                  key={i}
                  onClick={() => handleBestDealsClick(cat.name)}
                  className="flex flex-col items-center text-center justify-between bg-white p-4 rounded-lg hover:shadow-lg transition"
                >
                 <div className="flex flex-col items-center">
                   <img
                    src={cat.images?.[0]?.url}
                    alt={cat.name}
                    className="h-[25vh]"
                  />
                  <p className="font-medium">{cat.name}</p>
                 </div>
                  <p className="font-semibold text-blue-600 mb-4">
                    <span className="text-black">₹</span>{cat.price}
                  </p>
                </div>
              ))}
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div className="grid grid-cols-5 gap-6">
              {bestDealsSmartphones.slice(5, 10).map((cat, i) => (
              <div
                  key={i}
                  onClick={() => handleBestDealsClick(cat.name)}
                  className="flex flex-col items-center text-center justify-between bg-white p-4 rounded-lg hover:shadow-lg transition"
                >
                 <div className="flex flex-col items-center">
                   <img
                    src={cat.images?.[0]?.url}
                    alt={cat.name}
                    className="h-[25vh]"
                  />
                  <p className="font-medium">{cat.name}</p>
                 </div>
                  <p className="font-semibold text-blue-600 mb-4">
                    <span className="text-black">₹</span>{cat.price}
                  </p>
                </div>
              ))}
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}
