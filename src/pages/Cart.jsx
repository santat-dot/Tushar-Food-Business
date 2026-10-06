import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { products } from "../data/products";
import { useOrders } from "../context/OrdersContext";
import { bulkTiers } from "../data/offers";
import ProductCard from "../components/ProductCard";

export default function Cart() {
  const { items, savedForLater, updateQty, removeItem, saveForLater, moveToCart, subtotal, festivalSavings, bulkTier, bulkDiscount, couponDiscount, deliveryFee, total, coupon, applyCoupon, clearCoupon } = useCart();
  const { orders } = useOrders();
  const { t, formatCurrency } = useLanguage();
  const [code, setCode] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);
  const recommendations = products.filter((p) => p.availability === "available").slice(0, 4);

  function handleApply() {
    const res = applyCoupon(code, orders.length > 0);
    setCouponMsg(res);
  }

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="container section">
        <div className="empty-state">
          <h3>{t("cart_empty")}</h3>
          <p>{t("cart_empty_sub")}</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 18, display: "inline-flex" }}>{t("hero_cta_1")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 style={{ fontSize: 30, marginBottom: 28 }}>{t("cart_title")}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 40 }} className="cart-grid">
        <div>
          {items.map((item) => (
            <div key={item.id} className="card" style={{ display: "flex", gap: 16, padding: 16, marginBottom: 14 }}>
              <img src={item.image} alt={item.name} style={{ width: 88, height: 88, borderRadius: 10, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h4 style={{ fontSize: 16 }}>{item.name}</h4>
                  <strong>{formatCurrency(item.price * item.qty)}</strong>
                </div>
                <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{item.weight}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)", borderRadius: 999 }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ background: "none", border: "none", padding: "4px 12px" }}>−</button>
                    <span style={{ minWidth: 20, textAlign: "center", fontSize: 14 }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ background: "none", border: "none", padding: "4px 12px" }}>+</button>
                  </div>
                  <button onClick={() => saveForLater(item.id)} className="btn-ghost" style={{ fontSize: 13 }}>{t("save_for_later")}</button>
                  <button onClick={() => removeItem(item.id)} className="btn-ghost" style={{ fontSize: 13, color: "var(--brick)" }}>{t("remove")}</button>
                </div>
              </div>
            </div>
          ))}

          {savedForLater.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 18, marginBottom: 14 }}>{t("save_for_later")}</h3>
              {savedForLater.map((item) => (
                <div key={item.id} className="card" style={{ display: "flex", gap: 16, padding: 16, marginBottom: 12, opacity: 0.85 }}>
                  <img src={item.image} alt={item.name} style={{ width: 72, height: 72, borderRadius: 10, objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 15 }}>{item.name}</h4>
                    <button onClick={() => moveToCart(item.id)} className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>{t("move_to_cart")}</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 40 }}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>{t("related_products")}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {recommendations.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>

        {items.length > 0 && (
          <div>
            <div className="card" style={{ padding: 22, position: "sticky", top: 90 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("coupon_placeholder")} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid var(--line)" }} />
                <button onClick={handleApply} className="btn btn-outline btn-sm">{t("apply_coupon")}</button>
              </div>
              {couponMsg && <p style={{ fontSize: 12.5, color: couponMsg.ok ? "var(--olive)" : "var(--brick)", marginBottom: 12 }}>{couponMsg.message}</p>}

              <Row label={t("subtotal")} value={formatCurrency(subtotal)} />
              {bulkDiscount > 0 && <Row label={t("checkout_bulk_discount", { percent: bulkTier.percent })} value={`− ${formatCurrency(bulkDiscount)}`} />}
              {coupon && <Row label={t("checkout_coupon", { code: coupon.code })} value={`− ${formatCurrency(couponDiscount)}`} />}
              <Row label={t("delivery_fee")} value={deliveryFee === 0 ? t("checkout_free") : formatCurrency(deliveryFee)} />
              <div style={{ borderTop: "1px solid var(--line)", margin: "12px 0" }} />
              <Row label={t("total")} value={formatCurrency(total)} bold />

              {festivalSavings > 0 && <p className="save-note">🎉 {t("checkout_festival_savings", { amount: festivalSavings })}</p>}
              {(() => { const next = [...bulkTiers].reverse().find((b) => subtotal < b.min); return next ? <p className="save-note" style={{ background: "var(--cream-deep)", color: "var(--ink-soft)" }}>{t("cart_unlock_bulk", { amount: formatCurrency(next.min - subtotal), percent: next.percent })}</p> : null; })()}
              <Link to="/checkout" className="btn btn-primary" style={{ width: "100%", marginTop: 18 }}>{t("proceed_checkout")}</Link>
            </div>
          </div>
        )}
      </div>
      <style>{`@media (max-width: 800px) { .cart-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: bold ? 17 : 14.5, fontWeight: bold ? 700 : 400, marginBottom: 8 }}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
