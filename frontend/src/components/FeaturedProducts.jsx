import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6 text-gray-800 text-center sm:text-left">
        Featured Products
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md h-64 sm:h-72 animate-pulse"
              ></div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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
                  className="w-full h-52 sm:h-60 object-cover object-top transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-blue-600 font-bold mt-1 text-sm sm:text-base">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg text-sm sm:text-base transition"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
