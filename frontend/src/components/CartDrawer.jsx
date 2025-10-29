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

  const truncateName = (name, maxLength = 35) =>
    name.length > maxLength ? name.slice(0, maxLength) + "..." : name;

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
            className="relative w-full sm:w-[90%] md:w-[400px] lg:w-[380px] h-full bg-white shadow-2xl flex flex-col overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1 5h12l-1-5H7zM10 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
                  <p className="text-xs text-gray-500">Review your selected items</p>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <img
                    src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-illustration-svg-download-png-6024626.png"
                    alt="Empty Cart"
                    className="w-28 h-28 object-contain mb-3"
                  />
                  <p className="text-gray-500 text-sm font-medium">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between border-b pb-3 gap-3"
                    >
                      <div className="flex items-center space-x-3 w-2/3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded"
                        />
                        <div className="text-sm">
                          <h3 className="font-semibold text-gray-800">
                            {truncateName(item.name, 20)}
                          </h3>
                          <p className="text-gray-600 text-xs">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item, -1)}
                            className="px-2 py-1 bg-gray-200 rounded text-sm"
                          >
                            -
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item, 1)}
                            className="px-2 py-1 bg-gray-200 rounded text-sm"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-500 text-xs hover:underline mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Cart Summary */}
                  <div className="mt-6 border-t pt-4 text-sm">
                    <p className="flex justify-between font-semibold">
                      <span>Total Items:</span>
                      <span>{totalItems}</span>
                    </p>
                    <p className="flex justify-between font-semibold mt-1">
                      <span>Total Amount:</span>
                      <span>₹{displayTotal}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 mt-5">
                    <button
                      onClick={() => {
                        navigate("/checkout");
                        onClose();
                      }}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={handleClearCart}
                      className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm"
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
