import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

useEffect(() => {
  (async () => {
    try {
      const res = await api.get("/auth/me", { withCredentials: true });
      dispatch(setUser({ user: res.data.user }));
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to load user data");
      navigate("/login");
    }
  })();
}, []);

  return <div>Loading...</div>;
};

export default AuthSuccess;
