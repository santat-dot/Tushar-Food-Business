import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { localizeAddressLabel } from "../../i18n/translations";
import { useOrders } from "../../context/OrdersContext";
import ReorderButtons from "../../components/ReorderButtons";
import { Link } from "react-router-dom";

export default function AccountHome() {
  const { user, defaultAddress } = useAuth();
  const { orders: demoOrders } = useOrders();
  const { t, lang, formatDate } = useLanguage();

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>{t("profile")}</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 28 }}>{t("account_welcome_back", { name: user.name })}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label={t("orders")} value={demoOrders.length} to="/account/orders" />
        <StatCard label={t("loyalty")} value={t("account_points", { count: user.loyalty.points })} to="/account/loyalty" />
        <StatCard label={t("referrals")} value={user.referral.successfulReferrals} to="/account/referrals" />
        <StatCard label={t("subscriptions")} value={user.subscriptions.length} to="/account/subscriptions" />
      </div>

      {defaultAddress && (
        <div className="card addr-card" style={{ marginBottom: 28 }}>
          <strong style={{ fontSize: 14 }}>📍 {t("account_delivering_to", { label: localizeAddressLabel(defaultAddress.label, lang) })}</strong>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 6 }}>{defaultAddress.line}, {defaultAddress.city} – {defaultAddress.pincode} · <Link to="/account/addresses" style={{ textDecoration: "underline" }}>{t("common_change")}</Link></p>
        </div>
      )}
      <h3 style={{ fontSize: 17, marginBottom: 14 }}>{t("account_recent_orders")}</h3>
      {demoOrders.length === 0 && <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>{t("account_no_orders")} <Link to="/" style={{ textDecoration: "underline" }}>{t("account_start_shopping")}</Link></p>}
      {demoOrders.slice(0, 2).map((o) => (
        <div key={o.id} className="card" style={{ padding: 16, marginBottom: 10 }}><Link to={`/account/orders/${o.id}`} style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14.5 }}>#{o.id}</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{formatDate(o.date, { day: "numeric", month: "short", year: "numeric" })} · {t("account_order_items", { count: o.items.length })}</div>
          </div>
          <div style={{ fontSize: 13, color: "var(--olive)" }}>{t(`order_status_${o.status.replace(/-/g, "_")}`)}</div>
        </Link><div style={{ marginTop: 10 }}><ReorderButtons items={o.items} compact /></div></div>
      ))}
    </div>
  );
}

function StatCard({ label, value, to }) {
  return (
    <Link to={to} className="card" style={{ padding: 18 }}>
      <div style={{ fontSize: 22, fontFamily: "var(--serif)" }}>{value}</div>
      <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4 }}>{label}</div>
    </Link>
  );
}
