import {
  FaChartLine,
  FaBoxOpen,
  FaPlus,
  FaUsers,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
}) {
  const navigate = useNavigate();

  const handleGoToWebsite = () => {
    navigate("/");
  };

  return (
    <>
      {/* ===== Overlay for Mobile (click to close sidebar) ===== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed top-[10vh] md:top-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="w-64 bg-white h-[calc(100vh-10vh)] md:h-screen shadow-lg border-r flex flex-col">
          {/* ----- Logo Header ----- */}
          <div className="p-4 md:py-7 lg:p-4 border-b flex items-center justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="h-10 md:h-15 w-10 md:w-15 lg:h-10 lg:w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                U
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800 md:text-xl lg:text-sm">
                  UrbanCart
                </div>
                <div className="text-xs text-slate-500 md:text-sm lg:text-xs">Admin Panel</div>
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

          {/* ----- Go to Website Button ----- */}
          <div className="p-4 border-t flex justify-center bg-white">
            <button
              onClick={handleGoToWebsite}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-all text-sm sm:text-base whitespace-nowrap"
            >
              <FaExternalLinkAlt size={14} />
              <span>Go to Website</span>
            </button>
          </div>

          {/* ----- Footer Info ----- */}
          <div className="p-4 border-t text-xs text-slate-500 bg-slate-50 text-center">
            Logged in as{" "}
            <span className="font-medium text-indigo-600">Admin</span>
          </div>
        </div>
      </aside>
    </>
  );
}
