import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import api from "../api/axios";
import { addItemToCart } from "../features/cartSlice";
import { toast } from "react-toastify";

const FeaturedProducts = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await api.get("/products?sort=createdAt&order=desc&limit=4");
        setFeatured(res.data.products || []);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = async (product) => {
    const item = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || product.images?.[0],
      quantity: 1,
    };

    try {
      await dispatch(addItemToCart(item)).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
      console.error(error);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6 md:mb-8 text-gray-800 text-center md:text-left">
        Featured Products
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md h-60 sm:h-72 md:h-80 animate-pulse"
              ></div>
            ))}
        </div>
      ) : (
        <>
          {/* Mobile & Desktop Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8 md:hidden xl:grid">
            {featured.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={product.images?.[0]?.url || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-64 sm:h-72 object-cover object-top transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-blue-600 font-bold mt-1 text-base sm:text-lg">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 sm:py-2.5 rounded-lg text-base sm:text-lg transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tablet Swiper (no pagination) */}
          <div className="hidden md:block xl:hidden">
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={20}
              slidesPerView={2.2}
              loop
              className="pb-4"
            >
              {featured.map((product) => (
                <SwiperSlide key={product._id}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300"
                  >
                    <div className="relative">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.png"}
                        alt={product.name}
                        className="w-full h-52 md:h-56 object-cover object-top transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="p-3 md:p-4">
                      <h3 className="font-semibold text-sm md:text-base text-gray-800 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-blue-600 font-bold mt-1 text-sm md:text-base">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg text-sm md:text-base transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedProducts;
