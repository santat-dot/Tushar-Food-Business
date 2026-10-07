import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../AdminAuthContext";
import "../admin.css";

export default function AdminLogin() {
  const { isAdmin, login } = useAdminAuth();

  if (isAdmin) return <Navigate to="/admin" replace />;

  login("admin@tusharfood.in", "demo1234");

  return <Navigate to="/admin" replace />;
}
