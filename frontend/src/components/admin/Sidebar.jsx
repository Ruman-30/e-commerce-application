import { FaChartLine, FaBoxOpen, FaPlus, FaUsers } from "react-icons/fa";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
    >
      <div className="w-64 bg-white h-full shadow-lg border-r flex flex-col">
        {/* ----- Logo Header ----- */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
              E
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">
                UrbanCart
              </div>
              <div className="text-xs text-slate-500">Admin Panel</div>
            </div>
          </div>

          {/* Close button for mobile only */}
          <button
            className="p-2 rounded-md hover:bg-slate-100 md:hidden text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* ----- Navigation Links ----- */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {[
            { id: "dashboard", label: "Overview", icon: <FaChartLine /> },
            { id: "orders", label: "Orders", icon: <FaBoxOpen /> },
            { id: "products", label: "Products", icon: <FaPlus /> },
            { id: "users", label: "Users", icon: <FaUsers /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-colors duration-200 ${
                activeTab === item.id
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-700 hover:bg-slate-50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* ----- Footer Info ----- */}
        <div className="p-4 border-t text-xs text-slate-500 bg-slate-50">
          Logged in as <span className="font-medium text-indigo-600">Admin</span>
        </div>
      </div>
    </aside>
  );
}
