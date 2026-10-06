import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/useAdminAuth";

export default function RequireAdmin() {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
