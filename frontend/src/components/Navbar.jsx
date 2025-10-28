import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaSearch,
  FaUserCircle,
  FaUserShield,
  FaBars,
  FaTimes,
} from "react-icons/fa";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search")?.trim();
    if (query) {
      navigate(`/products?search=${query}`);
      e.target.reset();
      setIsMenuOpen(false);
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
        <div className="flex items-center justify-between px-4 md:px-8 py-4">
          {/* Left: Logo */}
          <div className="text-2xl font-bold">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              UrbanCart
            </Link>
          </div>

          {/* Middle: Search (centered on desktop) */}
          <div className="hidden md:flex flex-1 mx-4 lg:mx-6 relative">
            <form onSubmit={handleSearch} className="w-full">
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                className="w-full p-1.5 md:p-2 border-b-1 lg:p-2.5 pr-10 md:pr-12 pl-3 md:pl-4 rounded-full text-white placeholder-white outline-none border-0 focus:ring-2 focus:ring-yellow-400 bg-blue-700/30 text-sm md:text-base lg:text-base"
              />
              <button
                type="submit"
                className="absolute right-1 md:right-1.5 lg:right-1 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-black px-2 md:px-4 py-1.5 md:py-2 rounded-full flex items-center justify-center transition cursor-pointer"
              >
                <FaSearch className="text-sm md:text-base" />
              </button>
            </form>
          </div>

          {/* Right: Links */}
          <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 flex-wrap">
            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-2 md:space-x-3 lg:space-x-4 flex-wrap">
              <Link
                to="/login"
                className="flex items-center gap-1 text-sm md:text-base lg:text-base whitespace-nowrap"
              >
                <FaUserCircle /> {user ? `Hello, ${user.name}` : "Sign In"}
              </Link>

              <Link
                to="/orders"
                className="text-sm md:text-base lg:text-base hover:underline whitespace-nowrap"
              >
                Orders
              </Link>

              {user?.role === "admin" && (
                <>
                  <button
                    onClick={() => navigate("/admin/register")}
                    className="flex items-center text-sm md:text-base lg:text-base bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-2 md:px-3 lg:px-3 py-1 md:py-1.5 lg:py-1.5 rounded-full transition duration-300 whitespace-nowrap"
                  >
                    <FaUserShield className="mr-1" /> Add Admin
                  </button>

                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="flex items-center text-sm md:text-base lg:text-base bg-green-400 hover:bg-green-500 text-black font-semibold px-2 md:px-3 lg:px-3 py-1 md:py-1.5 lg:py-1.5 rounded-full transition duration-300 whitespace-nowrap"
                  >
                    <FaUserShield className="mr-1" /> Admin Dashboard
                  </button>
                </>
              )}
            </div>

            {/* Cart */}
            <button
              className="relative flex items-center hover:underline"
              onClick={handleCartClick}
            >
              <FaShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {totalItems || 0}
              </span>
            </button>

            {/* Hamburger for mobile */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-700/90 backdrop-blur-md border-t border-blue-500 px-6 py-4 space-y-4 animate-slideDown">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                className="w-full p-2 pr-12 pl-4 border-b-1 rounded-full text-white placeholder-white outline-none focus:ring-2 focus:ring-yellow-400 bg-blue-800/40"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-full flex items-center justify-center transition cursor-pointer"
              >
                <FaSearch />
              </button>
            </form>

            <div className="flex flex-col space-y-3 text-center">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex justify-center items-center gap-2 hover:underline"
              >
                <FaUserCircle />
                <span>{user ? `Hello, ${user.name}` : "Sign In"}</span>
              </Link>

              <Link
                to="/orders"
                onClick={() => setIsMenuOpen(false)}
                className="hover:underline"
              >
                Orders
              </Link>

              {user?.role === "admin" && (
                <>
                  <button
                    onClick={() => {
                      navigate("/admin/register");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-3 py-2 rounded-full transition duration-300"
                  >
                    <FaUserShield /> Add Admin
                  </button>

                  <button
                    onClick={() => {
                      navigate("/admin/dashboard");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 bg-green-400 hover:bg-green-500 text-black font-semibold px-3 py-2 rounded-full transition duration-300"
                  >
                    <FaUserShield /> Admin Dashboard
                  </button>
                </>
              )}
            </div>
          </div>
        )}
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
