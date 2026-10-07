import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import FoodItems from "./pages/FoodItems";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import GalleryManagement from "./components/GalleryManagement";
import Navbar from "./components/Navbar";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { useAdminAuth } from "./context/useAdminAuth";

function AdminLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function RequireAdmin() {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();
  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
}

function App() {
  return (
    <div className="admin-app">
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={import.meta.env.DEV ? <Navigate to="/" replace /> : <Login />} />
            <Route element={<RequireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/food-items" element={<FoodItems />} />
                <Route path="/gallery" element={<GalleryManagement />} />
                <Route path="/orders" element={<Orders />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </div>
  );
}

export default App;
