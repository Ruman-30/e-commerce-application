import { useNavigate } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

const bestDealsSmartphones = [
  {
    id: 1,
    name: "iPhone 14 Pro Max",
    price: "₹1,39,900",
    rating: 4.8,
    image: "https://iplanet.one/cdn/shop/files/r1598_Gold_PDP_Image_Position-1a_Avail__en-IN_e040d6b2-c1cb-4720-9684-87c58f76ce34.jpg?v=1691141697"
  },
  {
    id: 2,
    name: "Samsung Galaxy S23 Ultra",
    price: "₹1,24,999",
    rating: 4.7,
    image: "https://m.media-amazon.com/images/I/71JnINnJe6L._UF1000,1000_QL80_.jpg"
  },
  {
    id: 3,
    name: "Google Pixel 7 Pro",
    price: "₹84,999",
    rating: 4.6,
    image: "https://revendo.ch/cdn/shop/files/google-pixel-7-pro-hazel-guenstig-gebraucht-kaufen.png?v=1738155798"
  },
  {
    id: 4,
    name: "OnePlus 11 5G",
    price: "₹61,999",
    rating: 4.5,
    image: "https://oasis.opstatics.com/content/dam/oasis/page/2023/na/oneplus-11/specs/green-img.png"
  },
  {
    id: 5,
    name: "Xiaomi 13 Pro",
    price: "₹74,999",
    rating: 4.4,
    image: "https://i02.appmifile.com/324_operator_in/03/03/2023/de94b40a14b8e329c491e7a4b752635f.jpg"
  },
  {
    id: 6,
    name: "Vivo T4 5G",
    price: "₹36,999",
    rating: 4.3,
    image: "https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/j/f/0/-original-imahbgqyz5sqhwq9.jpeg"
  },
  {
    id: 7,
    name: "iQOO 11 5G",
    price: "₹59,999",
    rating: 4.4,
    image: "https://asia-exstatic-vivofs.vivo.com/PSee2l50xoirPK7y/1678958962824/49f7a9708baef450a1d251e718b2967c.png"
  },
  {
    id: 8,
    name: "Vivo X90 Pro",
    price: "₹84,999",
    rating: 4.5,
    image: "https://fdn2.gsmarena.com/vv/pics/vivo/vivo-x90-pro-1.jpg"
  },
  {
    id: 9,
    name: "Nothing Phone (2)",
    price: "₹44,999",
    rating: 4.2,
    image: "https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone2-1.jpg"
  },
  {
    id: 10,
    name: "Motorola Edge 40",
    price: "₹29,999",
    rating: 4.1,
    image: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge40-1.jpg"
  }
];


export default function BestDeals() {
    const navigate = useNavigate();
    const handleBestDealsClick = (id) => {
    // Redirect user to products page with search query
    navigate(`/products/${id}`);
  };
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
                  onClick={() => handleBestDealsClick(cat.id)}
                  className="flex flex-col items-center bg-white p-4 rounded-lg hover:shadow-lg transition"
                >
                  <img src={cat.image} alt={cat.name} className="h-[25vh] mb-2" />
                  <p className="font-medium">{cat.name}</p>
                  <p className="font-medium">{cat.price}</p>
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
                  className="flex flex-col items-center bg-white p-4 rounded-lg hover:shadow-lg transition"
                >
                  <img src={cat.image} alt={cat.name} className="h-[25vh] mb-2" />
                  <p className="font-medium">{cat.name}</p>
                  <p className="font-medium">{cat.price}</p>
                </div>
              ))}
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}
