import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/OrdersPage";
import Checkout from "./pages/Checkout/Checkout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import PlaceOrder from "./pages/Cart/PlaceOrder";
import AuthWrapper from "./components/AuthWrapper";
import AdminRoute from "./components/AdminRoute";
import AdminRegister from "./pages/Auth/AdminRegister";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import AuthSuccess from "./components/AuthSuccess";
const App = () => {
 
   const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("login") === "success") {
      toast.success("Login successful!");
      // Optionally, clear the query param
      window.history.replaceState({}, document.title, "/");
    }
  }, [location]);

  return (
    <AuthWrapper>
      <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/register" element={<AdminRoute><AdminRegister /></AdminRoute>} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      {/* <Route path="/auth/success" element={<AuthSuccess />} /> */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
    </AuthWrapper>
  );
};

export default App;
