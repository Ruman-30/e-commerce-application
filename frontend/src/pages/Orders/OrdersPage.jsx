// src/pages/orders/OrdersPage.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBox,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import OrderDetailsModal from "../../components/OrderDetailsModal";
import api from "../../api/axios"; // axios instance
import { toast } from "react-toastify";
import LoadingModal from "../../components/LoadingModal";
import ConfirmModal from "../../components/ConfirmModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // selectedOrder holds the full order details returned by the single-order endpoint
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/order/all-orders?page=${page}`);
      setOrders(res.data.order || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  // Fetch full order details and open modal
  const openOrderModal = async (orderId) => {
    try {
      setModalLoading(true);
      setSelectedOrder(null); // clear previous
      // adjust endpoint if your backend uses a different path
      const res = await api.get(`/order/${orderId}`);
      // backend response shape: { message: "...", order: { ... } }
      const orderData = res?.data?.order ?? res?.data;
      if (!orderData) throw new Error("Invalid order response");
      setSelectedOrder(orderData);
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      toast.error("Unable to load order details");
    } finally {
      setModalLoading(false);
    }
  };

  // Cancel an order (only allowed when backend permits). Refresh list after success.
   const handleCancelOrderClick = (orderId) => {
    setOrderToCancel(orderId);
    setConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await api.patch(`/order/${orderToCancel}/cancel`);
      toast.success("Order cancelled successfully");
      setSelectedOrder(null);
      setConfirmOpen(false);
      fetchOrders();
    } catch (err) {
      console.error("Cancel order error:", err);
      toast.error("Failed to cancel order");
    }
  };
  
  const handleCancelOrder = async (orderId) => {
    try {
      if (!window.confirm("Are you sure you want to cancel this order?"))
        return;
      await api.patch(`/order/${orderId}/cancel`);
      toast.success("Order cancelled successfully");
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      console.error("Cancel order error:", err);
      toast.error("Failed to cancel order");
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gray-50 py-16 px-6 mt-10">
        <div className="max-w-5xl mx-auto">
          {/* Loading skeleton */}
          {loading ? (
            <div className="flex flex-col gap-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white h-32 rounded-xl shadow-md"
                  ></div>
                ))}
            </div>
          ) : // Empty state: show only image
          orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <img
                className="h-70"
                src="https://cdni.iconscout.com/illustration/premium/thumb/online-empty-shopping-cart-illustration-svg-download-png-10018098.png"
                alt="No Orders"
              />
            </div>
          ) : (
            // Orders list
            <>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">
                Your Shopping Story
              </h1>
              <p className="text-gray-500 text-center -mt-3 mb-8">
                A timeline of everything you've loved and ordered.
              </p>

              <div className="space-y-6">
                <AnimatePresence>
                  {orders.map((order) => (
                    <motion.div
                      key={order.orderId || order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.28 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
                    >
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gray-100 text-gray-800">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <FaBox /> Order #
                            {(order.orderId || order._id)
                              ?.slice(-6)
                              ?.toUpperCase()}
                          </h3>
                          <p className="text-sm flex items-center gap-1">
                            <FaCalendarAlt /> {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <div className="mt-3 sm:mt-0 text-right">
                          <p className="text-lg font-bold">
                            ₹{order.totalAmount}
                          </p>
                          <span
                            className={`px-3 py-1 text-sm rounded-full ${
                              order.paymentMethod === "COD"
                                ? "bg-yellow-400 text-gray-900"
                                : "bg-green-500 text-white"
                            }`}
                          >
                            {order.paymentMethod === "COD"
                              ? "Cash on Delivery"
                              : "Paid"}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5 text-gray-700 space-y-3">
                        <p className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-blue-600" />
                          <span>
                            {order.shippingAddress?.fullName},{" "}
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.country}
                          </span>
                        </p>

                        <button
                          onClick={() =>
                            toggleExpand(order.orderId || order._id)
                          }
                          className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline mt-2"
                        >
                          {expandedOrder === (order.orderId || order._id) ? (
                            <>
                              <FaChevronUp /> Hide Order Items
                            </>
                          ) : (
                            <>
                              <FaChevronDown /> View Order Items
                            </>
                          )}
                        </button>

                        {/* Expandable Items */}
                        <AnimatePresence initial={false} mode="wait">
                          {expandedOrder === (order.orderId || order._id) && (
                            <motion.div
                              key={"items-" + (order.orderId || order._id)}
                              initial={{
                                opacity: 0,
                                clipPath: "inset(0 0 100% 0)",
                              }}
                              animate={{
                                opacity: 1,
                                clipPath: "inset(0 0 0% 0)",
                              }}
                              exit={{
                                opacity: 0,
                                clipPath: "inset(0 0 100% 0)",
                              }}
                              transition={{
                                duration: 0.45,
                                ease: [0.33, 1, 0.68, 1],
                              }}
                              className="mt-4 pl-2 border-t pt-3 space-y-2"
                            >
                              {order.items && order.items.length > 0 ? (
                                order.items.map((item, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{
                                      opacity: 1,
                                      y: 0,
                                      transition: { delay: idx * 0.04 },
                                    }}
                                    exit={{
                                      opacity: 0,
                                      y: -8,
                                      transition: { duration: 0.18 },
                                    }}
                                    onClick={() =>
                                      openOrderModal(order.orderId || order._id)
                                    }
                                    className="flex justify-between items-center bg-gray-50 rounded-lg p-3 hover:bg-blue-50 cursor-pointer transition"
                                  >
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={item.image || "/placeholder.png"}
                                        alt={item.name}
                                        className="w-14 h-14 object-cover rounded-md"
                                      />
                                      <div>
                                        <p className="font-medium">
                                          {item.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          Qty: {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="font-semibold text-gray-800">
                                      ₹{item.price}
                                    </p>
                                  </motion.div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No items found in this order.
                                </p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className={`px-4 py-2 rounded-lg border ${
                      page === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    Prev
                  </button>
                  <span className="text-gray-700 font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className={`px-4 py-2 rounded-lg border ${
                      page === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modal loading overlay */}
      <LoadingModal show={modalLoading} text="Loading order details..." />
      {/* Order details modal (shows when selectedOrder is present) */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onCancel={handleCancelOrderClick}
      />

      <ConfirmModal
      isOpen={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      onConfirm={handleConfirmCancel}
      title="Cancel Order?"
      message="Are you sure you want to cancel this order? This action cannot be undone."
    />
      <Footer />
    </>
  );
}
