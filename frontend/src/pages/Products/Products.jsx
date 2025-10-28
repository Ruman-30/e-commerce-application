import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaFilter, FaTimes } from "react-icons/fa";
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
  const [openSection, setOpenSection] = useState("categories");

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [orderDropdownOpen, setOrderDropdownOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const sortRef = useRef(null);
  const orderRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";
  const category = queryParams.get("category") || "";

  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  const handleCategoryClick = (cat) =>
    navigate(`/products?category=${encodeURIComponent(cat)}`);

  // Close dropdowns when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
      if (orderRef.current && !orderRef.current.contains(event.target)) {
        setOrderDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset products on filter/search/category change
  useEffect(() => {
    setPage(1);
    dispatch(resetProducts());
    dispatch(
      fetchProducts({
        search,
        category,
        minPrice,
        maxPrice,
        sort,
        order,
        page: 1,
      })
    );
  }, [search, category, minPrice, maxPrice, sort, order]);

  // Load more products
  useEffect(() => {
    if (page > 1) {
      dispatch(
        fetchProducts({
          search,
          category,
          minPrice,
          maxPrice,
          sort,
          order,
          page,
        })
      );
    }
  }, [page]);

  const handleProductClick = (id) => navigate(`/products/${id}`);

  const trimName = (name, maxLength = 35) => {
    if (!name) return "";
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  };
  return (
    <>
      <Navbar />
      <section className="pt-24 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-6">
          {/* 🔹 Mobile Filter Button */}
          <div className="lg:hidden flex justify-end mb-2">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition font-medium text-gray-700"
            >
              <FaFilter className="text-indigo-500" /> Filters
            </button>
          </div>

          {/* 🔹 Sidebar (desktop) */}
          <motion.aside
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block w-72 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-5 h-fit sticky top-28 border border-gray-100"
          >
            <FilterContent
              openSection={openSection}
              toggleSection={toggleSection}
              sortRef={sortRef}
              orderRef={orderRef}
              sortDropdownOpen={sortDropdownOpen}
              orderDropdownOpen={orderDropdownOpen}
              setSortDropdownOpen={setSortDropdownOpen}
              setOrderDropdownOpen={setOrderDropdownOpen}
              handleCategoryClick={handleCategoryClick}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              sort={sort}
              setSort={setSort}
              order={order}
              setOrder={setOrder}
            />
          </motion.aside>

          {/* 🔹 Mobile Filter Drawer */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 right-0 h-full w-4/5 sm:w-1/2 bg-white shadow-2xl z-50 p-5 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <FilterContent
                  openSection={openSection}
                  toggleSection={toggleSection}
                  sortRef={sortRef}
                  orderRef={orderRef}
                  sortDropdownOpen={sortDropdownOpen}
                  orderDropdownOpen={orderDropdownOpen}
                  setSortDropdownOpen={setSortDropdownOpen}
                  setOrderDropdownOpen={setOrderDropdownOpen}
                  handleCategoryClick={handleCategoryClick}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  setMinPrice={setMinPrice}
                  setMaxPrice={setMaxPrice}
                  sort={sort}
                  setSort={setSort}
                  order={order}
                  setOrder={setOrder}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🔹 Product List */}
          <div className="flex-1 flex flex-col space-y-4 pb-8">
            {loading && page === 1 ? (
              <LoadingModal show text="Loading products..." />
            ) : products.length === 0 ? (
              <p className="text-gray-600 text-center mt-6">
                No related products found.
              </p>
            ) : (
              <>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                  className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      variants={{
                        hidden: { opacity: 0, y: 40 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.5 },
                        },
                      }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      }}
                      onClick={() => handleProductClick(product._id)}
                      className="flex flex-col bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
                    >
                      <motion.div className="w-full h-40 sm:h-48">
                        <motion.img
                          src={product.images?.[0]?.url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>

                      <div className="p-3 flex flex-col justify-between flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                          {trimName(product.name)}
                        </h3>
                        <p className="text-gray-700 text-xs mt-1 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-blue-600 font-bold text-sm sm:text-base">
                            ₹{product.price}
                          </p>
                          <div className="flex flex-col items-end text-xs text-gray-600">
                            <span className="text-yellow-500 font-semibold">
                              ⭐ {product.averageRating?.toFixed(1) || 0}
                            </span>
                            <span>{product.numOfReviews || 0} Reviews</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {hasMore && !loading && (
                  <motion.button
                    onClick={() => setPage((prev) => prev + 1)}
                    whileHover={{ scale: 1.03 }}
                    className="mt-6 px-4 py-2 border border-blue-600 bg-white text-blue-600 rounded-xl font-medium hover:text-white hover:bg-blue-700 shadow-sm hover:shadow-lg self-center w-full sm:w-1/2"
                  >
                    Load More
                  </motion.button>
                )}

                {loading && page > 1 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-600 mt-4"
                  >
                    Loading more...
                  </motion.p>
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

/* 🔹 Extracted filter section into a subcomponent for reuse (desktop + mobile) */
function FilterContent({
  openSection,
  toggleSection,
  sortRef,
  orderRef,
  sortDropdownOpen,
  orderDropdownOpen,
  setSortDropdownOpen,
  setOrderDropdownOpen,
  handleCategoryClick,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  sort,
  setSort,
  order,
  setOrder,
}) {
  return (
    <div>
      {/* Categories */}
      <div className="mb-3">
        <button
          onClick={() => toggleSection("categories")}
          className="w-full flex justify-between items-center font-semibold text-gray-800"
        >
          Categories
          {openSection === "categories" ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <AnimatePresence>
          {openSection === "categories" && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-2 space-y-1 text-gray-700 text-sm"
            >
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
                  onClick={() => handleCategoryClick(cat)}
                  className="cursor-pointer px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors"
                >
                  {cat}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range */}
      <div className="mt-4">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex justify-between items-center font-semibold text-gray-800"
        >
          Price Range
          {openSection === "price" ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <AnimatePresence>
          {openSection === "price" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3"
            >
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-indigo-400"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-indigo-400"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sorting */}
      <div className="mt-4 relative">
        <button
          onClick={() => toggleSection("sort")}
          className="w-full flex justify-between items-center font-semibold text-gray-800"
        >
          Sort By
          {openSection === "sort" ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <AnimatePresence>
          {openSection === "sort" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-visible mt-3"
            >
              <div ref={sortRef} className="relative mb-3">
                <div
                  onClick={() => {
                    setSortDropdownOpen((prev) => !prev);
                    setOrderDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex justify-between items-center hover:shadow-md transition"
                >
                  <span className="text-gray-700 text-sm">
                    {sort
                      ? sort === "createdAt"
                        ? "Newest"
                        : "Price"
                      : "Select Option"}
                  </span>
                  <FaChevronDown
                    className={`transition-transform ${
                      sortDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {sortDropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50"
                    >
                      <li
                        onClick={() => {
                          setSort("createdAt");
                          setSortDropdownOpen(false);
                          setOrder("");
                        }}
                        className="px-3 py-2 hover:bg-indigo-50 text-gray-700 text-sm cursor-pointer"
                      >
                        Newest
                      </li>
                      <li
                        onClick={() => {
                          setSort("price");
                          setSortDropdownOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-indigo-50 text-gray-700 text-sm cursor-pointer"
                      >
                        Price
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {sort === "price" && (
                <div ref={orderRef} className="relative">
                  <div
                    onClick={() => {
                      setOrderDropdownOpen((prev) => !prev);
                      setSortDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex justify-between items-center hover:shadow-md transition"
                  >
                    <span className="text-gray-700 text-sm">
                      {order === "asc" ? "Low to High" : "High to Low"}
                    </span>
                    <FaChevronDown
                      className={`transition-transform ${
                        orderDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <AnimatePresence>
                    {orderDropdownOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50"
                      >
                        <li
                          onClick={() => {
                            setOrder("asc");
                            setOrderDropdownOpen(false);
                          }}
                          className="px-3 py-2 hover:bg-indigo-50 text-gray-700 text-sm cursor-pointer"
                        >
                          Low to High
                        </li>
                        <li
                          onClick={() => {
                            setOrder("desc");
                            setOrderDropdownOpen(false);
                          }}
                          className="px-3 py-2 hover:bg-indigo-50 text-gray-700 text-sm cursor-pointer"
                        >
                          High to Low
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
