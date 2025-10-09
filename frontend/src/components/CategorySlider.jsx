import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import { Navigation } from "swiper/modules";

const categories = [
  { name: "Electronics", img: "/images/category/electronics.webp" },
  { name: "Clothing", img: "/images/category/clothing.webp" },
  { name: "Home Appliances", img: "/images/category/appliances.jpg" },
  { name: "Shoes", img: "/images/category/shoes.webp" },
  { name: "Accessories", img: "/images/category/accessories.webp" },

  { name: "Books", img: "/images/category/books.jpg" },
  { name: "Beauty", img: "/images/category/beauty_.jpg" },
  { name: "Toys", img: "/images/category/toys.webp" },
  { name: "Sports", img: "/images/category/sports.webp" },
  { name: "Furniture", img: "/images/category/furniture.jpg" },
];

export default function CategorySlider() {
  const navigate = useNavigate();
   const handleCategoryClick = (category) => {
     // Redirect user to products page with category filter
     
     navigate(`/products?category=${encodeURIComponent(category)}`);
   };
  return (
     <section className="py-10 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
    
            <Swiper
              slidesPerView={1}
              navigation={true}
              modules={[Navigation]}
              className="category-swiper"
            >
              {/* Slide 1 */}
              <SwiperSlide>
                <div className="grid grid-cols-5 gap-6">
                  {categories.slice(0, 5).map((cat, i) => (
                    <div
                      key={i}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="flex flex-col items-center bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                    >
                      <img src={cat.img} alt={cat.name} className="h-40 mb-2" />
                      <p className="font-medium">{cat.name}</p>
                    </div>
                  ))}
                </div>
              </SwiperSlide>
    
              {/* Slide 2 */}
              <SwiperSlide>
                <div className="grid grid-cols-5 gap-6">
                  {categories.slice(5, 10).map((cat, i) => (
                    <div
                      key={i}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="flex flex-col items-center bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                    >
                      <img src={cat.img} alt={cat.name} className="h-40 mb-2" />
                      <p className="font-medium">{cat.name}</p>
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>
  );
}
