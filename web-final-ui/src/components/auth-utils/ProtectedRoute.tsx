import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
  console.log("ProtectedRoute Loaded!");
  const { user } = useAuth();
  console.log("protected: user", user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
