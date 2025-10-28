import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import ProductGrid from "./ProductGrid";
import ProductModal from "./ProductModal";
import { ChevronDown, Filter, Search } from "lucide-react";
import LoadingModal from "../../components/LoadingModal";

// ✅ Responsive Dropdown component
function Dropdown({ label, value, setValue, options }) {
  return (
    <div className="relative w-full sm:w-48">
      <button
        onClick={(e) => {
          e.stopPropagation();
          const dropdown = e.currentTarget.nextSibling;
          dropdown.classList.toggle("hidden");
        }}
        className="flex items-center justify-between gap-2 border border-gray-300 px-3 py-2 sm:px-4 rounded-xl hover:ring-1 hover:ring-indigo-500 transition-all w-full text-sm sm:text-base"
      >
        {value || label}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
      <div className="absolute top-full left-0 mt-1 hidden bg-white border border-gray-300 rounded-xl shadow-lg z-50 w-full max-h-48 overflow-auto">
        {(options || []).map((opt) => {
          const val = opt.value || opt;
          const labelText = opt.label || opt;
          return (
            <div
              key={val}
              onClick={() => setValue(val)}
              className="px-4 py-2 cursor-pointer hover:bg-indigo-50 text-sm sm:text-base"
            >
              {labelText}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("");
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Delete Confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products", {
        params: { page, limit, category, sort, order, search },
      });
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, category, sort, order, search]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    setDeleteId(productId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/products/product/${deleteId}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const handleSubmitProduct = async (formData) => {
    try {
      if (selectedProduct) {
        await api.patch(`/products/product/${selectedProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 relative">
      {/* ✅ Topbar */}
      <div
        className="
    flex flex-col xl:flex-row 
    xl:items-center xl:justify-between 
    gap-4 mb-6 relative z-20
  "
      >
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Products
        </h1>

        {/* Right Section */}
        <div
          className="
      flex flex-col sm:flex-row xl:flex-row 
      w-full xl:w-auto 
      gap-3 sm:gap-4
    "
        >
          {/* Search bar on top in mobile/ipad */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
          pl-10 pr-4 py-2 
          border border-gray-300 
          rounded-xl 
          focus:ring-2 focus:ring-indigo-500 
          outline-none 
          w-full 
          text-sm sm:text-base
        "
            />
          </div>

          {/* Buttons Row (below search for mobile/ipad) */}
          <div
            className="
        flex 
        flex-row 
        justify-start sm:justify-end 
        gap-3 
        w-full
      "
          >
            {/* Filters */}
            <button
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="
          flex items-center justify-center gap-2 
          bg-indigo-600 text-white 
          px-4 py-2 
          rounded-xl 
          shadow-md 
          hover:bg-indigo-700 
          transition-all 
          text-sm sm:text-base 
          w-1/2 sm:w-auto
        "
            >
              <Filter size={18} />
              Filters
            </button>

            {/* Add Product */}
            <button
              onClick={handleAddProduct}
              className="
          bg-green-600 text-white 
          px-4 py-2 
          rounded-xl 
          shadow-md 
          hover:bg-green-700 
          transition-all 
          text-sm sm:text-base 
          w-1/2 sm:w-auto
        "
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Filter Panel */}
      {filtersOpen && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 sm:p-5 mb-6 flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center backdrop-blur-sm relative z-30">
          <Dropdown
            label="Category"
            value={category}
            setValue={setCategory}
            options={["Electronics", "Clothing", "Home Appliances", "Sports", "Shoes", "Books", "Toys", "Beauty", "Accessories", "Furniture"]}
          />
          <Dropdown
            label="Sort By"
            value={sort}
            setValue={setSort}
            options={[
              { value: "price", label: "Price" },
              { value: "createdAt", label: "Created At" },
            ]}
          />
          <Dropdown
            label="Order"
            value={order}
            setValue={setOrder}
            options={[
              { value: "asc", label: "Ascending" },
              { value: "desc", label: "Descending" },
            ]}
          />
          <button
            onClick={() => {
              setCategory("");
              setSort("");
              setOrder("");
              setSearch("");
            }}
            className="mt-2 sm:mt-0 sm:ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-all text-sm sm:text-base"
          >
            Reset
          </button>
        </div>
      )}

      {/* ✅ Product Grid */}
      <ProductGrid
        products={products}
        onSelect={handleEditProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* ✅ Pagination */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-sm sm:text-base">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1 text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={modalOpen}
        product={selectedProduct}
        onSubmit={handleSubmitProduct}
        onCancel={() => setModalOpen(false)}
      />

      {/* ✅ Reusable Loader */}
      <LoadingModal show={loading} text="Fetching products, please wait..." />

      {/* ✅ Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 px-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
                <h2 className="text-lg font-semibold text-slate-800 mb-3">
                  Confirm Deletion
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 text-sm rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
