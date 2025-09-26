import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    // Not logged in → send to login page
    return <Navigate to="/login" replace />;
  }

  return children; // Logged in → allow access
};

export default ProtectedRoute;
