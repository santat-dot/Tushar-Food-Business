import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import FoodItems from "./pages/FoodItems";
import Orders from "./pages/Orders";
import GalleryManagement from "./components/GalleryManagement";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import RequireAdmin from "./components/RequireAdmin";
import { AdminAuthProvider } from "./context/AdminAuthContext";

function AdminLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <div className="admin-app">
      <BrowserRouter>
        <AdminAuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
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
        </AdminAuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
