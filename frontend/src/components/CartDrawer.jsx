import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  totalItems,
  displayTotal,
  handleQuantityChange,
  handleRemoveItem,
  handleClearCart,
}) => {
  const navigate = useNavigate();

  // Helper function to shorten long names
  const truncateName = (name, maxLength = 35) => {
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full sm:w-1/2 max-w-lg h-full bg-white shadow-2xl flex flex-col overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1 5h12l-1-5H7zM10 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Your Cart
                  </h2>
                  <p className="text-sm text-gray-500">
                    Review your selected items
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-black transition-colors cursor-pointer"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <img
                    src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-illustration-svg-download-png-6024626.png"
                    alt="Empty Cart"
                    className="w-40 h-40 object-contain mb-4"
                  />
                  <p className="text-gray-500 text-lg font-medium">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <>
                  {cartItems.map((item) => (
                    console.log(item),
                    
                    <div
                      key={item.productId}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold">
                            {truncateName(item.name)}
                          </h3>
                          <p className="text-gray-600">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item, -1)}
                          className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, 1)}
                          className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="px-2 py-1 bg-red-400 text-white rounded ml-2 cursor-pointer hover:bg-red-500 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Cart Summary */}
                  <div className="mt-6 border-t pt-4">
                    <p className="flex justify-between text-lg font-semibold">
                      <span>Total Items:</span>
                      <span>{totalItems}</span>
                    </p>
                    <p className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span>₹{displayTotal}</span>
                    </p>
                  </div>

                  {/* Cart Actions */}
                  <div className="flex flex-col gap-3 mt-6">
                    <button
                      onClick={() => {
                        navigate("/checkout");
                        onClose();
                      }}
                      className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-900 transition cursor-pointer"
                    >
                      Place Order
                    </button>
                    <button
                      onClick={handleClearCart}
                      className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition cursor-pointer"
                    >
                      Clear Cart
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
