import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    // Logged in but not an admin → redirect to home
    return <Navigate to="/" replace />;
  }

  // If admin, allow access
  return children;
};

export default AdminRoute;
