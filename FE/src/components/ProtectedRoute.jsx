import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />; // Unauthorized
  }

  return children;
};

export default ProtectedRoute;
