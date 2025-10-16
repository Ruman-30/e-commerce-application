import { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import KPISection from "../../components/admin/KPISection";
import RevenueChart from "../../components/admin/RevenueChart";
import OrdersTable from "../../components/admin/OrdersTable";
import UsersTable from "../../components/admin/UsersTable";
import ProductGrid from "../../components/admin/ProductGrid";
import ProductModal from "../../components/admin/ProductModal";
import ProductDrawer from "../../components/admin/ProductDrawer";

// Mock API
const api = {
  fetchProducts: async () => [
    { _id: "prod_1", name: "Sneakers X", price: 4999, stock: 15, description: "Comfortable sneakers", category: "Shoes", subCategory: "Sports", images: [] },
    { _id: "prod_2", name: "T-Shirt Classic", price: 799, stock: 80, description: "Cotton T-Shirt", category: "Clothing", subCategory: "Tops", images: [] },
  ],
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalData, setProductModalData] = useState(null);

  useEffect(() => {
    (async () => {
      const p = await api.fetchProducts();
      setProducts(p);
    })();
  }, []);

  const filteredProducts = useMemo(() => products, [products]);

  const handleAddProduct = () => { setProductModalData(null); setIsProductModalOpen(true); };
  const handleEditProduct = (p) => { setProductModalData(p); setIsProductModalOpen(true); };
  const handleDeleteProduct = (id) => {
    if (!confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p._id !== id));
    if (selectedProduct?._id === id) setSelectedProduct(null);
  };
  const handleSubmitProduct = (data) => {
    if (productModalData) {
      setProducts((prev) => prev.map((p) => (p._id === productModalData._id ? { ...p, ...data } : p)));
    } else {
      const newProduct = { ...data, _id: `prod_${Date.now()}` };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setIsProductModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 mt-15">
        <Topbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6 mt-16 md:mt-0">
          {activeTab === "dashboard" && <div className="space-y-6"><KPISection /><RevenueChart /></div>}
          {activeTab === "orders" && <OrdersTable />}
          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={handleAddProduct} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add Product</button>
              </div>
              <ProductGrid
                products={filteredProducts}
                onSelect={setSelectedProduct}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            </div>
          )}
          {activeTab === "users" && <UsersTable />}
        </main>
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        product={productModalData}
        onSubmit={handleSubmitProduct}
        onCancel={() => setIsProductModalOpen(false)}
      />

      <ProductDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
}
