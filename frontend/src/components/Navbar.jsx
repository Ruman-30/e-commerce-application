import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast, Bounce } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const totalItems = useSelector((state) => state.cart.totalQuantity);
  const user = useSelector((state) => state.user.user);

  // Optional: handle search
  // Optional: handle search
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

  // Optional: handle cart click
// Inside Navbar component
const handleCartClick = (e) => {
  if (!totalItems) {
    e.preventDefault(); // stop navigation
    toast.info("Your cart is empty!", {
      transition: Bounce,
    });
  }
};


  return (
    <nav className="bg-blue-800 text-white fixed top-0 w-full z-50 shadow">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/">UrbanCart</Link>
        </div>

        {/* Search Bar */}
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

        {/* Right Menu */}
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
      <div className="bg-blue-700 px-6 py-4 flex space-x-4 text-sm overflow-x-auto">
      </div>
    </nav>
  );
};

export default Navbar;
