import { useParams, Navigate, Link } from "react-router-dom";
import { trackingSteps } from "../../data/orders";
import { useOrders } from "../../context/OrdersContext";
import ReorderButtons from "../../components/ReorderButtons";
import { useLanguage } from "../../context/LanguageContext";

export default function OrderDetail() {
  const { id } = useParams();
  const { t, formatCurrency } = useLanguage();
  const { getOrder } = useOrders();
  const order = getOrder(id);
  if (!order) return <Navigate to="/account/orders" replace />;
  const currentIndex = trackingSteps.indexOf(order.status);

  return (
    <div>
      <Link to="/account/orders" className="link-more" style={{ fontSize: 13 }}>← {t("orders")}</Link>
      <h1 style={{ fontSize: 24, marginTop: 14, marginBottom: 20 }}>#{order.id}</h1>
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        {order.items.map((i, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
            <span>{i.name} × {i.qty}</span><span>{formatCurrency(i.price * i.qty)}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--line)", margin: "12px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}><span>{t("total")}</span><span>{formatCurrency(order.total)}</span></div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {trackingSteps.map((step, i) => (
          <span key={step} className={`badge ${i <= currentIndex ? "badge-available" : "badge-soldout"}`}>{t(`order_status_${step.replace(/-/g, "_")}`)}</span>
        ))}
      </div>
      <div style={{ marginTop: 18 }}><ReorderButtons items={order.items} /></div>
      <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 20 }}>{t("address")}: {order.address}</p>
      <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 6 }}>{t("delivery_slot")}: {order.slot}</p>
    </div>
  );
}
