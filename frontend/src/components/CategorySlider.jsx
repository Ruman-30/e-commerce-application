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
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Shop by Category</h2>

        <Swiper
          modules={[Navigation]}
          navigation
          loop={false}
          spaceBetween={16}
          slidesPerView={2} // default for very small screens
          breakpoints={{
            // when window width >= 640px
            640: {
              slidesPerView: 3,
              spaceBetween: 18,
            },
            // when window width >= 1024px (laptop/desktop)
            1024: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
          }}
          className="category-swiper"
        >
          {categories.map((cat, i) => (
            <SwiperSlide key={i}>
              <div
                onClick={() => handleCategoryClick(cat.name)}
                className="flex flex-col items-center bg-white p-3 sm:p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer h-full"
              >
                <div className="w-full flex items-center justify-center">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="h-28 sm:h-32 md:h-36 lg:h-40 w-full object-contain mb-2 rounded-md"
                  />
                </div>
                <p className="text-sm sm:text-base font-medium text-center">
                  {cat.name}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
