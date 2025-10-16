// src/components/admin/OrderDetailsDrawer.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const OrderDetailsDrawer = ({ isOpen, onClose, order }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Overlay */}
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-40 z-40"
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
          className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl z-50 p-6 overflow-y-auto"
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
            <div className="space-y-4">
              {/* User Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Customer Info</h3>
                <p><strong>Name:</strong> {order.user?.name}</p>
                <p><strong>Email:</strong> {order.user?.email}</p>
              </div>

              {/* Shipping Address */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Shipping Address</h3>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
              </div>

              {/* Items */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 border-b pb-2 last:border-b-0">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold">₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Ordered At:</span>
                  <span className="text-gray-600 text-sm">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex justify-between mt-4">
                <button className="flex-1 mr-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                  Update Order
                </button>
                <button className="flex-1 ml-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                  Delete Order
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default OrderDetailsDrawer;
