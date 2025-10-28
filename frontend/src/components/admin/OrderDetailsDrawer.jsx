// src/components/admin/OrderDetailsDrawer.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCheckCircle, FaTruck, FaMoneyBillWave } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";
import api from "../../api/axios"; // adjust path if needed

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const statusOptions = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const OrderDetailsDrawer = ({ isOpen, onClose, order, onOrderUpdated }) => {
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async () => {
    if (!selectedStatus || !order?._id) return;
    try {
      setLoading(true);
      const response = await api.patch(`/order/${order._id}/status`, { status: selectedStatus });
      toast.success(`Order status updated to ${selectedStatus}`);
      setShowConfirmPopup(false);
      setShowStatusPopup(false);
      if (onOrderUpdated) onOrderUpdated();

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-white shadow-xl z-50 p-6 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-700">Order Details</h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-indigo-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {!order ? (
              <p className="text-gray-500">No order selected.</p>
            ) : (
              <div className="space-y-5">
                {/* Customer Info */}
                <section className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Customer Info</h3>
                  <p><strong>Name:</strong> {order.user?.name}</p>
                  <p><strong>Email:</strong> {order.user?.email}</p>
                </section>

                {/* Shipping Address */}
                <section className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Shipping Address</h3>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>
                    {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}
                  </p>
                  <p>
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </p>
                  <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
                </section>

                {/* Shipping Method */}
                <section className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Shipping Method</h3>
                  <div className="flex justify-between items-center">
                    <span>{order.shippingMethod.label}</span>
                    <span className="font-medium">₹{order.shippingMethod.price}</span>
                  </div>
                </section>

                {/* Payment Info */}
                <section className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-600" /> Payment Info
                  </h3>
                  <p><strong>Method:</strong> {order.paymentMethod}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {order.isPaid ? (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <FaCheckCircle /> Paid
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">Unpaid</span>
                    )}
                  </p>
                  {order.isPaid && (
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p><strong>Payment ID:</strong> {order.payment?.razorpay_payment_id}</p>
                      <p><strong>Order ID:</strong> {order.payment?.razorpay_order_id}</p>
                      <p><strong>Paid At:</strong> {new Date(order.paidAt).toLocaleString()}</p>
                    </div>
                  )}
                </section>

                {/* Items */}
                <section className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 border-b pb-2 last:border-b-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Summary */}
                <section className="p-4 bg-gray-50 rounded-lg shadow-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Items Total:</span>
                    <span>₹{order.totalAmount - order.taxAmount - order.shippingMethod.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{order.taxAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{order.shippingMethod.price}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Amount:</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Ordered At:</span>
                    <span className="text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                </section>

                {/* Admin Actions */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setShowStatusPopup(true)}
                    className="flex-1 mr-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Update Order
                  </button>
                  {/* <button className="flex-1 ml-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                    Delete Order
                  </button> */}
                </div>
              </div>
            )}
          </motion.div>

          {/* Status Selection Popup */}
          <AnimatePresence>
            {showStatusPopup && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex justify-center items-center bg-black/50 z-50"
              >
                <div className="bg-white rounded-lg p-4 w-80 shadow-lg">
                  <h3 className="font-semibold text-lg mb-3 text-center">
                    Select Order Status
                  </h3>
                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setShowConfirmPopup(true);
                        }}
                        className={`block w-full text-center py-2 rounded-md border hover:bg-indigo-50 transition ${
                          status === order.status ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
                        }`}
                        disabled={status === order.status}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowStatusPopup(false)}
                    className="w-full mt-3 text-gray-600 hover:text-indigo-600 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirmation Popup */}
          <AnimatePresence>
            {showConfirmPopup && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex justify-center items-center bg-black/50 z-50"
              >
                <div className="bg-white rounded-lg p-4 w-80 shadow-lg">
                  <h3 className="font-semibold text-lg mb-3 text-center">
                    Confirm Update
                  </h3>
                  <p className="text-center mb-4">
                    Are you sure you want to change status to{" "}
                    <span className="font-semibold">{selectedStatus}</span>?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleStatusChange}
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                    >
                      {loading ? "Updating..." : "Yes"}
                    </button>
                    <button
                      onClick={() => setShowConfirmPopup(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailsDrawer;
