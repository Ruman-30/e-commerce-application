import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { fetchProducts, resetProducts } from "../../features/productSlice";
import LoadingModal from "../../components/LoadingModal";

export default function ProductPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, loading, hasMore } = useSelector((state) => state.products);

  const [page, setPage] = useState(1);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("asc");
  const [modalLoading, setModalLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";
  const category = queryParams.get("category") || "";

  // Refetch when filters/search/category change → reset
  useEffect(() => {
    setPage(1);
    dispatch(resetProducts());
    dispatch(
      fetchProducts({ search, category, minPrice, maxPrice, sort, order, page: 1 })
    );
  }, [search, category, minPrice, maxPrice, sort, order]);

  // Fetch next page when page changes
  useEffect(() => {
    if (page > 1) {
      dispatch(fetchProducts({ search, category, minPrice, maxPrice, sort, order, page }));
    }
  }, [page]);

  const handleProductClick = (id) => navigate(`/products/${id}`);
  const handleCategoryClick = (cat) =>
    navigate(`/products?category=${encodeURIComponent(cat)}`);

  return (
    <>
      <Navbar />
      <section className="pt-25 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 flex gap-6">
          {/* Left Sidebar */}
          <aside className="w-64 mb-8 bg-white rounded-lg shadow p-4 h-[calc(110vh-8rem)] sticky top-25">
            <h2 className="font-bold text-lg mb-4">Filters</h2>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-2">Categories</h3>
              <ul className="space-y-1 text-gray-700 text-sm">
                {[
                  "Electronics",
                  "Clothing",
                  "Home Appliances",
                  "Shoes",
                  "Accessories",
                  "Books",
                  "Beauty",
                  "Toys",
                  "Sports",
                  "Furniture",
                ].map((cat, idx) => (
                  <li
                    key={idx}
                    className="hover:underline cursor-pointer"
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 border px-2 py-1 rounded"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 border px-2 py-1 rounded"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Sorting */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Sort By</h3>
              <select
                className="w-full border px-2 py-1 rounded"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Select</option>
                <option value="createdAt">Newest</option>
                <option value="price">Price</option>
              </select>

              {sort === "price" && (
                <select
                  className="w-full mt-2 border px-2 py-1 rounded"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                >
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </select>
              )}
            </div>
          </aside>

          {/* Product List */}
          <div className="flex-1 flex flex-col space-y-4 pb-8">
            {loading && page === 1 ? (
              <LoadingModal show={loading && page === 1} text="Loading products..." />
            ) : products.length === 0 ? (
              <p className="text-gray-600">No related products found.</p>
            ) : (
              <>
                {products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="flex bg-white rounded-lg shadow hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.name}
                      className="w-40 h-40 object-cover"
                    />
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-blue-600 font-bold">
                          ₹{product.price}
                        </p>
                        <div className="flex flex-col items-end">
                          <span className="text-yellow-400 font-semibold">
                            ⭐ {product.averageRating?.toFixed(1) || 0}
                          </span>
                          <span className="text-gray-800 text-xs ">
                            {product.numOfReviews || 0} Reviews
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {hasMore && !loading && (
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    className="mt-6 px-4 py-2 border-1 border-blue-600 bg-white text-blue-600 rounded-lg hover:text-white hover:bg-blue-700 self-center w-full"
                  >
                    Load More
                  </button>
                )}
                {loading && page > 1 && (
                  <p className="text-center text-gray-600">Loading more...</p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
