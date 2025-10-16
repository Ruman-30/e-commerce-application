import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaUserCircle, FaUserShield } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toast, Bounce } from "react-toastify";
import {
  removeItemFromCart,
  fetchCart,
  clearCartBackend,
  updateItemQuantity,
} from "../features/cartSlice";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch cart on mount
  useEffect(() => {
    dispatch(fetchCart()).catch(() => {
      toast.error("Failed to load cart");
    });
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen]);

  const displayCart = cartItems || [];
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const displayTotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search")?.trim();
    if (query) {
      navigate(`/products?search=${query}`);
      e.target.reset();
    } else {
      toast.warning("Please enter a search term");
    }
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!displayCart.length) {
      toast.info("Your cart is empty!", { transition: Bounce });
      return;
    }
    setIsCartOpen(true);
  };

  const handleQuantityChange = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    try {
      await dispatch(
        updateItemQuantity({ productId: item.productId, quantity: newQty })
      ).unwrap();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeItemFromCart(productId)).unwrap();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCartBackend()).unwrap();
      toast.success("Cart cleared!");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white fixed top-0 w-full z-50 shadow">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="text-2xl font-bold">
            <Link to="/">UrbanCart</Link>
          </div>

          {/* Search */}
          <div className="flex-1 mx-6 relative">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                className="w-full p-2 pr-12 pl-4 rounded-full text-white placeholder-white outline-none border-0 border-b focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full flex items-center justify-center transition cursor-pointer"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/login"
              className="flex items-center space-x-1 hover:underline"
            >
              <FaUserCircle />
              <span>{user ? `Hello, ${user.name}` : "Sign In"}</span>
            </Link>

            <Link to="/orders" className="hover:underline">
              Orders
            </Link>

            {/* Admin-only button */}
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin/register")}
                className="text-sm cursor-pointer flex items-center bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-3 py-1 rounded-full transition duration-300"
              >
                <FaUserShield className="mr-2" /> Add Admin
              </button>
            )}
            {/* Admin-only button */}
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="text-sm cursor-pointer flex items-center bg-green-400 hover:bg-green-500 text-black font-semibold px-3 py-1 rounded-full transition duration-300"
              >
                <FaUserShield className="mr-2" /> Admin Dashboard
              </button>
            )}

            <Link
              to="/cart"
              className="relative flex items-center hover:underline"
              onClick={handleCartClick}
            >
              <FaShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {totalItems || 0}
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={displayCart}
        totalItems={totalItems}
        displayTotal={displayTotal}
        handleQuantityChange={handleQuantityChange}
        handleRemoveItem={handleRemoveItem}
        handleClearCart={handleClearCart}
      />
    </>
  );
};

export default Navbar;
