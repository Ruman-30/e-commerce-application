import { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import KPISection from "../../components/admin/KPISection";
import RevenueChart from "../../components/admin/RevenueChart";
import OrdersTable from "../../components/admin/OrdersTable";
import UsersTable from "../../components/admin/UsersTable";
import AdminProductsPage from "../../components/admin/AdminProductsPage"; // 👈 import your product logic page

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden py-6 sm:py-6 md:py-17 lg:py-6">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 mt-15">
        <Topbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-2 mt-5 md:mt-0">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <KPISection />
              <RevenueChart />
            </div>
          )}

          {activeTab === "orders" && <OrdersTable />}

          {activeTab === "products" && (
            <AdminProductsPage /> // 👈 use the new component here
          )}

          {activeTab === "users" && <UsersTable />}
        </main>
      </div>
    </div>
  );
}
