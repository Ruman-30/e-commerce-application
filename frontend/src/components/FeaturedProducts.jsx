import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import api from "../api/axios"; // ✅ your axios instance
import { addItemToCart } from "../features/cartSlice"; // ✅ adjust path if needed
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
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md h-72 animate-pulse"
              ></div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <img
                src={product.images?.[0]?.url || "/placeholder.png"}
                alt={product.name}
                className=" h-60 object-top object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="p-4">
                <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                <p className="text-blue-600 font-bold mt-1">
                  <span className="text-black">₹</span>{product.price.toLocaleString("en-IN")}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
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
