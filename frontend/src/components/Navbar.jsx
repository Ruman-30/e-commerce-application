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
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4">
          {/* Left: Logo */}
          <div className="text-xl sm:text-2xl font-bold whitespace-nowrap">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              UrbanCart
            </Link>
          </div>

          {/* Middle: Search */}
          <div className="hidden lg:flex flex-1 mx-4 xl:mx-6 relative">
            <form onSubmit={handleSearch} className="w-full">
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                className="w-full p-2 lg:p-2.5 pr-12 pl-4 rounded-full text-white placeholder-white outline-none focus:ring-2 focus:ring-yellow-400 bg-blue-700/30 border-b-1 text-sm md:text-base"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-full flex items-center justify-center transition"
              >
                <FaSearch className="text-sm md:text-base" />
              </button>
            </form>
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-nowrap">
            {/* Links — hide on tablet */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                to="/login"
                className="flex items-center gap-1 text-sm md:text-base whitespace-nowrap"
              >
                <FaUserCircle /> {user ? `Hello, ${user.name}` : "Sign In"}
              </Link>

              <Link
                to="/orders"
                className="text-sm md:text-base hover:underline whitespace-nowrap"
              >
                Orders
              </Link>

              {user?.role === "admin" && (
                <>
                  <button
                    onClick={() => navigate("/admin/register")}
                    className="flex items-center text-sm bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-3 py-1.5 rounded-full transition duration-300 whitespace-nowrap"
                  >
                    <FaUserShield className="mr-1" /> Add Admin
                  </button>

                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="flex items-center text-sm bg-green-400 hover:bg-green-500 text-black font-semibold px-3 py-1.5 rounded-full transition duration-300 whitespace-nowrap"
                  >
                    <FaUserShield className="mr-1" /> Dashboard
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

            {/* Hamburger — visible on tablet + mobile */}
            <button
              className="lg:hidden text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Tablet/Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-blue-700/90 backdrop-blur-md border-t border-blue-500 px-6 py-4 space-y-4 animate-slideDown">
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
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-full flex items-center justify-center transition"
              >
                <FaSearch />
              </button>
            </form>

            {/* Links */}
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
                    <FaUserShield /> Dashboard
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
