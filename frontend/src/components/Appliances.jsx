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
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Best deals on appliances</h2>

        <Swiper
          spaceBetween={20}
          slidesPerView={5}
          slidesPerGroup={3}
          speed={600}
          navigation
          modules={[Navigation]}
        >
          {appliances.map((cat) => (
            <SwiperSlide key={cat._id}>
              <div
                onClick={() => handleBestDealsClick(cat.name)}
                className="flex flex-col items-center text-center bg-white p-4 rounded-lg hover:shadow-lg transition cursor-pointer"
              >
               <div className="flex flex-col items-center mb-5"> 
                 <img
                  src={cat.images?.[0]?.url}
                  alt={cat.name}
                  className="h-[25vh] mb-2 object-contain"
                />
                <p className="font-medium">{trimName(cat.name)}</p>
               </div>
                 <p className="font-semibold text-blue-600 mb-4">
                    ₹{cat.price}
                  </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
