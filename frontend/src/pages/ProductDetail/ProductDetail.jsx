import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useRef, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../features/cartSlice";
import LoadingModal from "../../components/LoadingModal";
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const dispatch = useDispatch();

  const [activeIndex, setActiveIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        const prod = res.data.product;
        setProduct(prod);
        setHasPurchased(res.data.hasPurchased);

        // Reviews
        try {
          const reviewRes = await api.get(`/review/product/${id}/reviews`);
          setReviews(reviewRes.data.review || []);
        } catch {
          setReviews([]);
        }

        // Related Products
        if (prod.category) {
          try {
            const relatedRes = await api.get(
              `/products?subCategory=${prod.subCategory}&category=${prod.category}`
            );
            setRelatedProducts(
              relatedRes.data.products.filter((p) => p._id !== id)
            );
          } catch {}
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Quantity handlers
  const handleIncrease = () => {
    if (product.stock && quantity < product.stock) setQuantity((q) => q + 1);
    else toast.info("No more stock available!");
  };
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  // Add to Cart (Redux + backend)
 const handleAddToCart = async () => {
  if (!product) return;

  try {
    await dispatch(addItemToCart({ productId: product._id, quantity })).unwrap();
    toast.success(`${product.name} added to cart!`);
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to add to cart");
  }
};


  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/checkout");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment || !newReview.rating) {
      toast.error("Please add a rating and comment");
      return;
    }
    try {
      await api.post(
        `/review/product/${id}`,
        { rating: newReview.rating, comment: newReview.comment },
        { withCredentials: true }
      );
      const reviewRes = await api.get(`/review/product/${id}/reviews`);
      setReviews(reviewRes.data.review || []);
      setNewReview({ rating: 0, comment: "" });
    } catch (err) {
      if (err.response?.status === 403)
        toast.error("You can only review purchased products");
      else toast.error("Failed to submit review");
    }
  };

  const handleProductClick = (prodId) => navigate(`/products/${prodId}`);

  if (loading || !product) {
    return (
      <>
        <Navbar />
        <LoadingModal show={loading} text="Loading product details..." />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pt-30">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Images */}
          <div>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              loop
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className="mb-4"
            >
              {product.images?.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="w-full h-[40vh] md:h-[60vh] flex items-center justify-center">
                    <img
                      src={img.url || img}
                      alt={product.name}
                      className="max-w-[60%] max-h-full object-contain rounded-lg"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnails */}
            <div className="flex gap-3 justify-center md:justify-start flex-wrap">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img.url || img}
                  alt="thumbnail"
                  onMouseEnter={() => swiperRef.current?.slideToLoop(i)}
                  onClick={() => swiperRef.current?.slideToLoop(i)}
                  className={`w-16 h-16 md:w-20 md:h-20 object-cover border rounded-md cursor-pointer transition ${
                    activeIndex === i ? "border-blue-500" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {product.name}
            </h1>
            <div className="flex items-center mb-3">
              <span className="text-yellow-500 text-lg">
                ★ {product.averageRating?.toFixed(1) || 0}
              </span>
              <span className="ml-2 text-gray-500">
                ({product.numOfReviews || 0} reviews)
              </span>
            </div>
            <p className="text-xl md:text-2xl font-semibold text-blue-600 mb-4">
              ₹{product.price}
            </p>
            <p className="text-gray-700 mb-4 line-clamp-4">
              {product.description}
            </p>
            <p
              className={`mb-4 font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `In stock (${product.stock} left)`
                : "Out of stock"}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleDecrease}
                className="px-3 py-1 border rounded-md"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={handleIncrease}
                className="px-3 py-1 border rounded-md"
              >
                +
              </button>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Product Details</h2>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          {reviews.length > 0 && (
            <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          )}
          <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">
                    {review.user.name}
                  </span>
                  <span className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.488 6.91l6.562-.955L10 0l2.95 5.955 6.562.955-4.757 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
                <span className="text-gray-400 text-xs mt-1 block">
                  {new Date(review.date || Date.now()).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          {hasPurchased && (
            <div className="mt-6 p-6 bg-gray-100 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-gray-700 font-medium">
                    Your Rating:
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() =>
                          setNewReview({ ...newReview, rating: i + 1 })
                        }
                        className="transition"
                      >
                        <svg
                          className={`w-6 h-6 md:w-7 md:h-7 ${
                            newReview.rating > i
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.488 6.91l6.562-.955L10 0l2.95 5.955 6.562.955-4.757 4.635 1.123 6.545z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Write your review..."
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                ></textarea>
                <button
                  type="submit"
                  className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          {relatedProducts.length === 0 ? (
            <p className="text-gray-600">No related products found.</p>
          ) : (
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
            >
              {relatedProducts.map((prod) => (
                <SwiperSlide key={prod._id}>
                  <div
                    onClick={() => handleProductClick(prod._id)}
                    className="p-4 rounded-lg text-center shadow-blue-400 hover:scale-102 hover:shadow-lg transition cursor-pointer flex flex-col items-center h-[41vh]"
                  >
                    <img
                      src={prod.images?.[0]?.url}
                      alt={prod.name}
                      className="h-40 object-contain mb-2"
                    />
                    <p className="font-medium">{prod.name}</p>
                    <p className="text-blue-600 font-semibold">₹{prod.price}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
