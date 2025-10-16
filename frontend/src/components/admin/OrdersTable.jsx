// src/components/admin/OrdersTable.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import { FaBox, FaClock, FaUser, FaArrowRight } from "react-icons/fa";

const mockOrders = [
  {
    _id: "68ac580335c5d3bf4ecd6db3",
    user: { _id: "689c6ebcaded42b334aa755d", name: "ruman", email: "ruman@gmail.com" },
    shippingAddress: {
      fullName: "test Khan",
      street: "123 New market Road",
      city: "MP",
      postalCode: "110001",
      state: "bhopal",
      country: "India",
      phone: "9765456798",
    },
    items: [
      {
        product: "68a375a0f9f1dc757ca46655",
        quantity: 2,
        price: 350,
        image: "https://res.cloudinary.com/do7x5udgg/image/upload/v1755542943/ecommerce/products/i56kr6wi2ckxfvyuhtmc.jpg",
        name: "Samsung Z fold",
      },
    ],
    totalAmount: 700,
    status: "Delivered",
    createdAt: "2025-08-25T12:33:07.470Z",
  },
  {
    _id: "68ac580335c5d3bf4ecd6dc4",
    user: { _id: "689c6ebcaded42b334aa755e", name: "Alice Johnson", email: "alice@gmail.com" },
    shippingAddress: {
      fullName: "Alice Johnson",
      street: "456 Elm Street",
      city: "Delhi",
      postalCode: "110002",
      state: "Delhi",
      country: "India",
      phone: "9876543210",
    },
    items: [
      {
        product: "68a375a0f9f1dc757ca46656",
        quantity: 1,
        price: 799,
        image: "https://via.placeholder.com/150",
        name: "Apple AirPods",
      },
    ],
    totalAmount: 799,
    status: "Pending",
    createdAt: "2025-08-26T09:15:00.000Z",
  },
  {
    _id: "68ac580335c5d3bf4ecd6dc5",
    user: { _id: "689c6ebcaded42b334aa755f", name: "Bob Williams", email: "bob@gmail.com" },
    shippingAddress: {
      fullName: "Bob Williams",
      street: "789 Maple Avenue",
      city: "Mumbai",
      postalCode: "400001",
      state: "Maharashtra",
      country: "India",
      phone: "9123456780",
    },
    items: [
      {
        product: "68a375a0f9f1dc757ca46657",
        quantity: 3,
        price: 533,
        image: "https://via.placeholder.com/150",
        name: "Sony Headphones",
      },
    ],
    totalAmount: 1599,
    status: "Cancelled",
    createdAt: "2025-08-27T14:42:00.000Z",
  },
];

export default function OrdersTable() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
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
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 rounded-2xl shadow-md border border-slate-100"
      >
        <h2 className="text-xl font-semibold mb-5 flex items-center gap-2 text-slate-800">
          <FaBox className="text-slate-500" /> All Orders
        </h2>

        <div className="grid gap-4">
          {mockOrders.map((order) => (
            <motion.div
              key={order._id}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleViewOrder(order)}
              className="p-4 bg-slate-50 rounded-xl cursor-pointer hover:shadow-md transition-all border border-slate-100 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={order.items[0].image}
                  alt={order.items[0].name}
                  className="w-14 h-14 object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-800">
                    {order.items[0].name}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <FaUser className="text-xs" /> {order.user.name}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <FaClock className="text-xs" />{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="text-right flex gap-2 items-center">
                <p className="font-semibold text-slate-700">
                  ₹{order.totalAmount.toLocaleString()}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

              <FaArrowRight className="text-slate-400 ml-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Drawer for order details */}
      <OrderDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        order={selectedOrder}
      />
    </>
  );
}
