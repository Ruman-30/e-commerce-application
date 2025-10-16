// src/components/AuthWrapper.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import { setUser, clearUser, finishAuthCheck } from "../features/userSlice";
import LoadingModal from "./LoadingModal";

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { authChecking } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        dispatch(setUser({ user: res.data.user }));
      } catch (err) {
        dispatch(clearUser());
      } finally {
        dispatch(finishAuthCheck());
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  // ✅ Show loader while checking authentication
  if (authChecking) {
    return <LoadingModal show text="Checking authentication..." />;
  }

  // ✅ Once auth check done → render children (your app routes)
  return children;
};

export default AuthWrapper;
