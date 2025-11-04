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
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      // ✅ Save tokens in cookies (Google login)
      Cookies.set("accessToken", accessToken, {
        secure: true,
        sameSite: "None",
        path: "/",
      });
      Cookies.set("refreshToken", refreshToken, {
        secure: true,
        sameSite: "None",
        path: "/",
      });

      // ✅ Clean URL
      window.history.replaceState({}, document.title, "/");

      // ✅ Fetch user
      (async () => {
        try {
          const res = await api.get("/auth/me", { withCredentials: true });
          dispatch(setUser({ user: res.data.user }));
          toast.success("Login successful!");
          navigate("/");
        } catch (error) {
          console.error("Error fetching user:", error);
          toast.error("Failed to load user data");
          navigate("/login");
        }
      })();
    } else {
      navigate("/login");
    }
  }, [location, navigate, dispatch]);

  return <div>Loading...</div>;
};

export default AuthSuccess;
