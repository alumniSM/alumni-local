import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const PublicOnlyRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  if (isLoggedIn) {
    return <Navigate to={user?.isAdmin ? "/dashboard" : "/"} replace />;
  }

  return children;
};
