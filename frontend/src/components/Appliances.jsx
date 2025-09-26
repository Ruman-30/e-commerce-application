import { useNavigate } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

const bestDealsSmartphones = [
  {
    id: 1,
    name: "65 / 75 inch Tv's",
    price: "₹30,999",
    rating: 4.8,
    image: "https://rukminim2.flixcart.com/image/240/240/xif0q/television/n/j/0/-original-imahcsfhhbnpzt5z.jpeg?q=60"
  },
  {
    id: 2,
    name: "Washing Machines",
    price: "₹25,999",
    rating: 4.7,
    image: "https://rukminim2.flixcart.com/image/240/240/xif0q/washing-machine-new/q/w/x/-original-imagx7qhyuxgsmfy.jpeg?q=60"
  },
  {
    id: 3,
    name: "Best selling Refrigerators",
    price: "₹9,999",
    rating: 4.6,
    image: "https://rukminim2.flixcart.com/image/240/240/xif0q/refrigerator-new/q/5/g/-original-imahg65j3ryrsfyt.jpeg?q=60"
  },
  {
    id: 4,
    name: "Microwaves & Ovens",
    price: "₹6,999",
    rating: 4.5,
    image: "https://rukminim2.flixcart.com/image/240/240/xif0q/microwave-new/s/x/b/-original-imahd82ez72afreh.jpeg?q=60"
  },
  {
    id: 5,
    name: "Lowest Price Ever",
    price: "₹19,990",
    rating: 4.4,
    image: "https://rukminim2.flixcart.com/image/240/240/xif0q/air-conditioner-new/d/7/f/-original-imahdr4apzpuydyq.jpeg?q=60"
  },
  {
    id: 6,
    name: "Kitchen Essentials",
    price: "₹1,250",
    rating: 4.3,
    image: "https://rukminim2.flixcart.com/image/240/240/xif0q/mixer-grinder-juicer/i/0/m/-original-imaghy69gbrjwkvz.jpeg?q=60"
  },
  {
    id: 7,
    name: "Home Essentials",
    price: "₹5,890",
    rating: 4.4,
    image: "https://rukminim2.flixcart.com/image/240/240/xif0q/water-purifier/q/d/w/m2-needs-no-service-for-2-years-10-stage-filtration-native-by-original-imah2usukstmh2ru.jpeg?q=60"
  },
  {
    id: 8,
    name: "Fans & Geysers",
    price: "₹780",
    rating: 4.5,
    image: "https://rukminim2.flixcart.com/image/240/240/xif0q/water-geyser/j/x/y/-original-imagrty2vtc9gruj.jpeg?q=60"
  }
];

export default function Appliances() {
  const navigate = useNavigate();

  const handleBestDealsClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Best deals on appliances</h2>

        <Swiper
          spaceBetween={20}
          slidesPerView={5}
          slidesPerGroup={3}
          speed={600} // smoother swipe
          navigation
          modules={[Navigation]}
        >
          {bestDealsSmartphones.map((cat) => (
            <SwiperSlide key={cat.id}>
              <div
                onClick={() => handleBestDealsClick(cat.id)}
                className="flex flex-col items-center bg-white p-4 rounded-lg hover:shadow-lg transition cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-[25vh] mb-2 object-contain"
                />
                <p className="font-medium">{cat.name}</p>
                <p className="font-medium">{cat.price}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
