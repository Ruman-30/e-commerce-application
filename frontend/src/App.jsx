import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";
import Checkout from "./pages/Checkout/Checkout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import { useDispatch } from "react-redux";
import  api  from "./api/axios";
import { setUser } from "./features/userSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import { useNavigate } from "react-router-dom";
import { initLenis, destroyLenis } from "./utils/lenis";
const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    initLenis();
    return () => {
      destroyLenis();
    };
  }, []);

  useEffect(() => {
    const fetchCurrrentUser = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        dispatch(setUser({ user: res.data.user }));
        // console.log(res.data);
        navigate("/"); 
      } catch (error) {
        console.log("Not logged in yet");
      }
    };
    fetchCurrrentUser();
  }, []);
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;
