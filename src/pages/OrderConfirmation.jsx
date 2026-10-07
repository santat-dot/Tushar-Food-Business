import { useParams, useLocation, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { demoOrders } from "../data/orders";
import ReorderButtons from "../components/ReorderButtons";
import { downloadOrderReceipt } from "../utils/printOrderReceipt";

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const { t, formatCurrency } = useLanguage();
  const stored = JSON.parse(localStorage.getItem("tfb_new_orders") || "[]");
  const order = location.state || stored.find((o) => o.id === id) || demoOrders.find((o) => o.id === id);

  if (!order) {
    return <div className="container section"><div className="empty-state"><h3>{t("order_not_found")}</h3></div></div>;
  }

  return (
    <div className="container section" style={{ maxWidth: 640 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 44 }}>✓</div>
        <h1 style={{ fontSize: 26, marginTop: 10 }}>{t("order_confirmed")}</h1>
        <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>{t("confirmation_order", { id: order.id })}</p>
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 20 }}>
        {order.items.map((i, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
            <span>{i.name} × {i.qty}</span><span>{formatCurrency(i.price * i.qty)}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--line)", margin: "12px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}><span>{t("total")}</span><span>{formatCurrency(order.total)}</span></div>
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 28 }}>
        <Row label={t("payment_method")} value={order.payment} />
        <Row label={t("address")} value={order.address} />
        <Row label={t("delivery_slot")} value={order.slot} />
      </div>

      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <button className="btn btn-outline" type="button" onClick={() => {
          if (!downloadOrderReceipt(order)) window.alert(t("receipt_download_failed"));
        }}>
          {t("download_order_receipt")}
        </button>
      </div>

      <div style={{ marginBottom: 16, textAlign: "center" }}><p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 8 }}>{t("confirmation_reorder_prompt")}</p><div style={{ display: "inline-block" }}><ReorderButtons items={order.items} compact /></div></div>
      <div style={{ display: "flex", gap: 12 }}>
        <Link to={`/track-order?id=${order.id}`} className="btn btn-primary" style={{ flex: 1, textAlign: "center" }}>{t("track_order")}</Link>
        <Link to="/" className="btn btn-outline" style={{ flex: 1, textAlign: "center" }}>{t("continue_shopping")}</Link>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 13.5, marginBottom: 10, color: "var(--ink-soft)" }}>
      <span>{label}</span><span style={{ textAlign: "right", color: "var(--ink)" }}>{value}</span>
    </div>
  );
}
