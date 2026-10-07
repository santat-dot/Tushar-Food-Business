import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function CartDrawer({ open, onClose }) {
  const { items, updateQty, removeItem, subtotal, itemCount } = useCart();
  const { t, formatCurrency } = useLanguage();

  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(30,22,14,0.35)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .2s", zIndex: 60 }}
      />
      <aside
        style={{
          position: "fixed", inset: "0 0 0 auto", height: "100dvh", width: "min(420px, 100%)", minHeight: 0, background: "var(--paper)",
          transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .25s ease", zIndex: 61, overflow: "hidden",
          display: "flex", flexDirection: "column", boxShadow: "-10px 0 30px rgba(0,0,0,0.12)",
        }}
        aria-hidden={!open}
      >
        <div style={{ flexShrink: 0, padding: "18px 20px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 19 }}>{t("cart_title")} ({itemCount})</h3>
          <button onClick={onClose} aria-label={t("common_close")} style={{ background: "none", border: "none", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", padding: "12px 20px" }}>
          {items.length === 0 ? (
            <div className="empty-state">
              <h3>{t("cart_empty")}</h3>
              <p>{t("cart_empty_sub")}</p>
            </div>
          ) : items.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
              <img src={item.image} alt={item.name} style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14.5 }}>{item.name}</span>
                  <span style={{ fontWeight: 600, fontSize: 14.5 }}>{formatCurrency(item.price * item.qty)}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{item.weight}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)", borderRadius: 999 }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ background: "none", border: "none", padding: "2px 10px" }}>−</button>
                    <span style={{ fontSize: 13, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ background: "none", border: "none", padding: "2px 10px" }}>+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="btn-ghost" style={{ fontSize: 12.5 }}>{t("remove")}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{ flexShrink: 0, padding: "20px 20px calc(20px + env(safe-area-inset-bottom))", borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 15 }}>
              <span>{t("subtotal")}</span><strong>{formatCurrency(subtotal)}</strong>
            </div>
            <Link to="/cart" onClick={onClose} className="btn btn-outline" style={{ width: "100%", marginBottom: 8 }}>{t("cart_title")}</Link>
            <Link to="/checkout" onClick={onClose} className="btn btn-primary" style={{ width: "100%" }}>{t("bills_and_payments")}</Link>
          </div>
        )}
      </aside>
    </>,
    document.body,
  );
}
