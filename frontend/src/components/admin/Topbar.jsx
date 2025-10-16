import { FaBars, FaBell, FaSearch } from "react-icons/fa";

export default function Topbar({ setSidebarOpen }) {
  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 z-5 bg-white border-b shadow-sm flex items-center justify-between px-4 h-[11.4vh]">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-slate-600"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars size={20} />
        </button>
        <h1 className="font-semibold text-slate-700 text-lg hidden sm:block">
          Admin Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center bg-slate-100 rounded-md px-2">
          <FaSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none px-2 py-1 text-sm"
          />
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-md relative">
          <FaBell className="text-slate-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
