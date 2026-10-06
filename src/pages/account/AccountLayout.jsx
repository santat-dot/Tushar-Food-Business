import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import AccountAuth from "./AccountAuth";

const LINKS = [
  ["/account/orders", "orders"], ["/account/addresses", "addresses"], ["/account/food-dna", "food_dna"],
  ["/account/food-memory", "food_memory"], ["/account/loyalty", "loyalty"], ["/account/referrals", "referrals"],
  ["/account/subscriptions", "subscriptions"],
];

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  if (!user) return <AccountAuth />;

  return (
    <div className="container section" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 40 }} id="account-layout">
      <aside>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{user.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{user.email}</div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {LINKS.map(([to, key]) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({ padding: "9px 12px", borderRadius: 8, fontSize: 14, background: isActive ? "var(--cream-deep)" : "transparent", fontWeight: isActive ? 600 : 400 })}>
              {t(key)}
            </NavLink>
          ))}
          <button onClick={logout} className="btn-ghost" style={{ textAlign: "left", padding: "9px 12px", fontSize: 14, color: "var(--brick)" }}>{t("logout")}</button>
        </nav>
      </aside>
      <div><Outlet /></div>
      <style>{`@media (max-width: 760px) { #account-layout { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
