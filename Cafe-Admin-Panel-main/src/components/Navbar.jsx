import { Link, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/useAdminAuth";

function Navbar() {
  const location = useLocation();
  const { signOut } = useAdminAuth();

  return (
    <nav className="admin-navbar" aria-label="Main navigation">
      <div className="admin-navbar-inner">
        <Link to="/" className="admin-brand">
          <span className="admin-brand-mark" aria-hidden="true">TF</span>
          <span className="admin-brand-copy">
            <span className="admin-brand-name">Tushar Food Business</span>
            <span className="admin-brand-label">Admin workspace</span>
          </span>
        </Link>
        <div className="admin-nav-links">
          <Link to="/" className={location.pathname === "/" ? "admin-nav-link active" : "admin-nav-link"}>
            📊 Dashboard
          </Link>
          <Link to="/categories" className={location.pathname === "/categories" ? "admin-nav-link active" : "admin-nav-link"}>
            📑 Categories
          </Link>
          <Link to="/food-items" className={location.pathname === "/food-items" ? "admin-nav-link active" : "admin-nav-link"}>
            🍜 Food Items
          </Link>
          <Link to="/gallery" className={location.pathname === "/gallery" ? "admin-nav-link active" : "admin-nav-link"}>
            🎬 Gallery
          </Link>
          <Link to="/orders" className={location.pathname === "/orders" ? "admin-nav-link active" : "admin-nav-link"}>
            📦 Orders
          </Link>
        </div>
        <button className="admin-sign-out" onClick={signOut}>Sign out</button>
      </div>
    </nav>
  );
}

export default Navbar;
