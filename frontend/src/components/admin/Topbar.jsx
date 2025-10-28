import { FaBars, FaBell, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Topbar({ setSidebarOpen }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 z-40 bg-white border-b shadow-sm flex items-center justify-between px-3 sm:px-4 md:px-4 h-[10vh] sm:h-[11.4vh]">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Sidebar toggle (only on mobile) */}
        <button
          className="md:hidden text-slate-600 hover:text-slate-800 transition"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars size={22} />
        </button>

        {/* Dashboard Title */}
        <h1 className="font-semibold text-slate-700 text-base sm:text-lg md:text-xl">
          Admin Dashboard
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Go to Website Button */}
        {/* Notifications */}
        <button className="relative p-2 hover:bg-slate-100 rounded-md">
          <FaBell className="text-slate-500 text-lg" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Avatar */}
        <div className="h-8 w-8 sm:h-9 sm:w-9 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base cursor-pointer hover:opacity-90">
          A
        </div>
      </div>
    </header>
  );
}
