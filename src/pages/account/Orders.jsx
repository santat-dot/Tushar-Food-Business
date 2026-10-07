import { useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../../context/OrdersContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import ReorderButtons from "../../components/ReorderButtons";
import { downloadOrderReceipt } from "../../utils/printOrderReceipt";

export default function Orders() {
  const { t, formatDate, formatCurrency } = useLanguage();
  const { orders } = useOrders();
  const { user, saveTemplate, deleteTemplate } = useAuth();
  const [naming, setNaming] = useState(null);
  const [name, setName] = useState("");
  const templates = user.templates || [];

  function saveList(order) {
    saveTemplate({ name: name.trim() || `Order ${order.id}`, items: order.items });
    setNaming(null); setName("");
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>{t("orders")}</h1>
      <p style={{ color: "var(--ink-soft)", fontSize: 14, marginBottom: 22 }}>{t("orders_bulk_description")}</p>

      {templates.length > 0 && (
        <section style={{ marginBottom: 30 }}>
          <h3 style={{ fontSize: 17, marginBottom: 12 }}>⭐ {t("orders_saved_lists")}</h3>
          {templates.map((tpl) => (
            <div key={tpl.id} className="card" style={{ padding: 16, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <strong>{tpl.name}</strong>
                <button className="btn-ghost" style={{ fontSize: 12.5, color: "var(--brick)", padding: 0 }} onClick={() => deleteTemplate(tpl.id)}>{t("orders_delete")}</button>
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", margin: "6px 0 12px" }}>{tpl.items.map((i) => `${i.name} × ${i.qty}`).join(" · ")}</div>
              <ReorderButtons items={tpl.items} />
            </div>
          ))}
        </section>
      )}

      {orders.length === 0 ? (
        <div className="empty-state card"><h3>{t("orders_no_orders")}</h3><p>{t("orders_ready_repeat")}</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: "inline-flex" }}>{t("account_start_shopping")}</Link></div>
      ) : orders.map((o) => (
        <div key={o.id} className="card" style={{ padding: 18, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <Link to={`/account/orders/${o.id}`} style={{ fontWeight: 600 }}>#{o.id}</Link>
            <span style={{ fontSize: 13, color: "var(--olive)" }}>{t(`order_status_${o.status.replace(/-/g, "_")}`)}</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 10 }}>{formatDate(o.date, { day: "numeric", month: "short", year: "numeric" })} · {formatCurrency(o.total)} · {o.payment}</div>
          {o.items.map((i, idx) => <div key={idx} style={{ fontSize: 13.5, marginBottom: 4 }}>{i.name} × {i.qty}</div>)}
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
            <ReorderButtons items={o.items} />
            <Link to={`/account/orders/${o.id}`} className="btn btn-outline btn-sm">{t("orders_details")}</Link>
            <button className="btn btn-outline btn-sm" type="button" onClick={() => {
              if (!downloadOrderReceipt(o)) window.alert(t("receipt_download_failed"));
            }}>{t("download_order_receipt")}</button>
            {naming === o.id ? (
              <span style={{ display: "inline-flex", gap: 6 }}>
                <input className="input" style={{ padding: "7px 10px", width: 170 }} autoFocus placeholder={t("orders_list_name_placeholder")} value={name} onChange={(e) => setName(e.target.value)} />
                <button className="btn btn-primary btn-sm" onClick={() => saveList(o)}>{t("common_save")}</button>
              </span>
            ) : <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => { setNaming(o.id); setName(""); }}>☆ {t("orders_save_bulk_list")}</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
