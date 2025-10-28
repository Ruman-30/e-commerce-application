import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import { FaBox, FaClock, FaUser, FaArrowRight } from "react-icons/fa";
import api from "../../api/axios";
import LoadingModal from "../LoadingModal";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/order/admin/orders", {
        params: { page, limit: 10, status: status || undefined },
      });
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, status]);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoadingOrder(true);
      const { data } = await api.get(`/order/${orderId}`);
      setSelectedOrder(data.order);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleOrderUpdated = async () => {
    await fetchOrders();
    setIsDrawerOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Confirmed":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-md border border-slate-100 relative"
      >
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6 gap-3">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-slate-800">
            <FaBox className="text-slate-500" /> All Orders
          </h2>

          {/* ✅ Modern Status Filter */}
          <div className="relative w-full sm:w-auto">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowDropdown((prev) => !prev)}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 bg-white shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-indigo-500"
            >
              <span className="font-medium">
                {status ? status : "All Status"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[160px] sm:min-w-[180px] bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden"
                >
                  {[
                    "",
                    "Pending",
                    "Confirmed",
                    "Shipped",
                    "Delivered",
                    "Cancelled",
                  ].map((opt) => (
                    <li
                      key={opt || "All"}
                      onClick={() => {
                        setShowDropdown(false);
                        setStatus(opt);
                        setPage(1);
                      }}
                      className={`px-4 py-2 cursor-pointer text-sm hover:bg-indigo-50 transition-all ${
                        status === opt
                          ? "bg-indigo-100 text-indigo-600 font-medium"
                          : "text-slate-700"
                      }`}
                    >
                      {opt || "All Status"}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <p className="text-center text-gray-400 py-6 text-sm sm:text-base">
            No orders found.
          </p>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                whileHover={{ scale: 1.01 }}
                onClick={() => fetchOrderDetails(order._id)}
                className="p-3 sm:p-4 bg-slate-50 rounded-xl cursor-pointer hover:shadow-md transition-all border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
              >
                {/* Left Section */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={order.items?.[0]?.image}
                    alt={order.items?.[0]?.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm sm:text-base">
                      {order.items?.[0]?.name}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1 sm:gap-2 flex-wrap">
                      <FaUser className="text-[10px] sm:text-xs" />{" "}
                      {order.user?.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1">
                      <FaClock className="text-[10px]" />{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-wrap justify-between sm:justify-end items-center gap-2 sm:gap-3 text-right">
                  <p className="font-semibold text-slate-700 text-sm sm:text-base">
                    ₹{order.totalAmount?.toLocaleString()}
                  </p>
                  <span
                    className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <FaArrowRight className="text-slate-400 text-xs sm:text-sm" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-wrap gap-2 items-center justify-center pt-5">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-3 py-1 text-xs sm:text-sm rounded-md border ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
            }`}
          >
            Prev
          </button>

          <span className="text-xs sm:text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-3 py-1 text-xs sm:text-sm rounded-md border ${
              page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
            }`}
          >
            Next
          </button>
        </div>
      </motion.div>

      {/* ✅ Reusable Loader */}
      <LoadingModal
        show={loading}
        text="Fetching orders, please wait..."
        fullscreen={true}
      />

      {/* Drawer */}
      <OrderDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        order={selectedOrder}
        loading={loadingOrder}
        onOrderUpdated={handleOrderUpdated}
      />
    </>
  );
}
