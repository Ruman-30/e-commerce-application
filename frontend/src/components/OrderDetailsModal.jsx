import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaBox, FaMapMarkerAlt, FaPhoneAlt, FaUser } from "react-icons/fa";

const OrderDetailsModal = ({ order, onClose, onCancel }) => {
  if (!order) return null;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const shipping = order.shippingAddress || {};

  return (
    <AnimatePresence>
      {order && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-5 relative overflow-y-auto max-h-[85vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
            >
              <FaTimes size={20} />
            </button>

            {/* Header */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaBox className="text-blue-600" /> Order Summary
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-gray-700 text-sm">
                <strong>Order ID:</strong> {order._id?.slice(-8)?.toUpperCase()}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    order.status === "Pending"
                      ? "text-yellow-600"
                      : order.status === "Confirmed"
                      ? "text-blue-600"
                      : order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Cancelled"
                      ? "text-red-600"
                      : order.status === "Shipped"
                      ? "text-purple-600"
                      : "text-gray-600"   
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Total Amount:</strong> ₹{order.totalAmount}
              </p>
            </div>

            {/* Shipping Info */}
            <div className="border rounded-lg p-3 mb-4">
              <h3 className="font-semibold text-base mb-2 flex items-center gap-2 text-gray-800">
                <FaMapMarkerAlt className="text-blue-600" /> Shipping Details
              </h3>
              <div className="space-y-1 text-gray-700 text-sm">
                <p>
                  <FaUser className="inline-block mr-2 text-gray-500" />
                  <strong>{shipping.fullName}</strong>
                </p>
                <p>{shipping.street}</p>
                <p>
                  {shipping.city}, {shipping.state} - {shipping.postalCode}
                </p>
                <p>{shipping.country}</p>
                <p className="flex items-center gap-2 mt-1">
                  <FaPhoneAlt className="text-gray-500" />
                  {shipping.phone}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="border rounded-lg p-3 mb-4">
              <h3 className="font-semibold text-base mb-3 text-gray-800">
                Ordered Items
              </h3>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">
                      ₹{item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel Button */}
            {order.status === "Pending" && (
              <button
                onClick={() => onCancel(order._id)}
                className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition text-sm"
              >
                Cancel Order
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailsModal;
