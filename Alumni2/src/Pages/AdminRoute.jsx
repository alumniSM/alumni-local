import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

const AdminRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  if (!isLoggedIn || !user?.isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
