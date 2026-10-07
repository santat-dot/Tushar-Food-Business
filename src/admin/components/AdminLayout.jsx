import { NavLink, Outlet } from "react-router-dom";
import "../admin.css";

const adminRedirect = "/admin";

const NAV = [
  { group: "Overview", items: [["/admin", "Dashboard", true]] },
  {
    group: "Operations",
    items: [
      ["/admin/orders", "Orders"],
      ["/admin/products", "Products"],
      ["/admin/categories", "Categories"],
      ["/admin/inventory", "Inventory"],
      ["/admin/capacity", "Capacity"],
      ["/admin/batches", "Batches"],
      ["/admin/delivery", "Delivery"],
    ],
  },
  {
    group: "Customers",
    items: [
      ["/admin/customers", "Customers"],
      ["/admin/offers", "Offers"],
      ["/admin/reviews", "Reviews"],
    ],
  },
  {
    group: "Content",
    items: [
      ["/admin/kitchen-stories", "Kitchen Stories"],
      ["/admin/content-studio", "Content Studio"],
      ["/admin/recipes", "Recipes"],
      ["/admin/community", "Community"],
    ],
  },
  {
    group: "Retention",
    items: [
      ["/admin/subscriptions", "Subscriptions"],
      ["/admin/loyalty", "Loyalty"],
      ["/admin/referrals", "Referrals"],
    ],
  },
  {
    group: "Insights",
    items: [
      ["/admin/analytics", "Analytics"],
      ["/admin/reports", "Reports"],
    ],
  },
  { group: "System", items: [["/admin/festival-mode", "Festival Mode"], ["/admin/settings", "Settings"]] },
];

export default function AdminLayout() {
  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <div className="brand">Tushar Food<span>Business Command Center</span></div>
        <nav className="admin-nav">
          {NAV.map((g) => (
            <div key={g.group}>
              <div className="nav-group-label">{g.group}</div>
              {g.items.map(([to, label, end]) => (
                <NavLink key={to} to={to} end={!!end} className={({ isActive }) => (isActive ? "active" : "")}>
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
