import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useLanguage } from "../context/LanguageContext";
import { deliverySlots } from "../data/delivery";
import { submitCustomerOrder } from "../api/catalogApi";
import { localizeAddressLabel } from "../i18n/translations";

export default function Checkout() {
  const { items, subtotal, festivalSavings, bulkTier, bulkDiscount, couponDiscount, coupon, deliveryFee, total, clearCart } = useCart();
  const { user, defaultAddress, earnPoints } = useAuth();
  const { addOrder } = useOrders();
  const { t, lang, formatCurrency } = useLanguage();
  const navigate = useNavigate();

  const [addrId, setAddrId] = useState(defaultAddress?.id);
  const address = user.addresses.find((a) => a.id === addrId) || defaultAddress;
  const [instructions, setInstructions] = useState("");
  const [slot, setSlot] = useState("morning");
  const [payment, setPayment] = useState("upi");
  const [placing, setPlacing] = useState(false);
  const [placementError, setPlacementError] = useState("");

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!address) return;
    setPlacing(true);
    setPlacementError("");
    try {
      const orderId = "TFB" + Math.floor(10000 + Math.random() * 89999);
      const s = deliverySlots.find((x) => x.id === slot);
      const order = {
        id: orderId, date: new Date().toISOString().slice(0, 10), status: "confirmed", payment: payment.toUpperCase(),
        items: items.map((i) => ({ productId: i.id, name: i.name, qty: i.qty, price: i.price })),
        address: `${address.line}${address.landmark ? ", " + address.landmark : ""}, ${address.city}, ${address.state} - ${address.pincode}`,
        phone: address.phone || user.phone, customer: user.name, instructions,
        slot: `${s?.label}, ${s?.window}`, total, savings: festivalSavings + bulkDiscount + couponDiscount,
      };
      const savedOrder = await submitCustomerOrder(order);
      addOrder({ ...order, ...savedOrder, status: order.status });
      earnPoints(Math.floor(total / 10), `Order ${orderId}`);
      clearCart();
      navigate(`/order/${orderId}`, { state: order });
    } catch (error) {
      setPlacementError(error.message || t("checkout_order_save_error"));
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return <div className="container section"><div className="empty-state"><h3>{t("cart_empty")}</h3><Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: "inline-flex" }}>{t("checkout_browse_food")}</Link></div></div>;
  }

  return (
    <div className="container section">
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>{t("checkout_title")}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40 }} className="checkout-grid">
        <form onSubmit={handlePlaceOrder}>
          <Section title={t("checkout_delivering_to")}>
            {address ? (
              <div className="card addr-card is-selected">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <strong>{localizeAddressLabel(address.label, lang)} · {user.name}</strong>
                  <Link to="/account/addresses" style={{ fontSize: 13, textDecoration: "underline" }}>{t("checkout_manage")}</Link>
                </div>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 6, lineHeight: 1.55 }}>
                  {address.line}{address.landmark ? `, ${address.landmark}` : ""}, {address.city}, {address.state} – {address.pincode}<br />📞 {address.phone || user.phone}
                </p>
              </div>
            ) : <p>{t("checkout_no_address")} <Link to="/account/addresses" style={{ textDecoration: "underline" }}>{t("checkout_add_address")}</Link></p>}
            {user.addresses.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                {user.addresses.map((a) => <button type="button" key={a.id} onClick={() => setAddrId(a.id)} className={a.id === address?.id ? "chip is-active" : "chip"}>{localizeAddressLabel(a.label, lang)}</button>)}
              </div>
            )}
            <label style={{ display: "block", marginTop: 14 }}>
              <span style={{ fontSize: 12.5, color: "var(--ink-soft)", display: "block", marginBottom: 5 }}>{t("checkout_instructions_optional")}</span>
              <input value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder={t("checkout_gate_placeholder")} className="input" />
            </label>
          </Section>

          <Section title={t("delivery_slot")}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {deliverySlots.map((s) => (
                <button type="button" key={s.id} onClick={() => s.status !== "full" && setSlot(s.id)} disabled={s.status === "full"}
                  className={slot === s.id ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"} style={{ opacity: s.status === "full" ? 0.5 : 1 }}>
                  {s.label} · {s.window} {s.status === "almost-full" && `(${t("checkout_slot_almost_full")})`} {s.status === "full" && `(${t("checkout_slot_full")})`}
                </button>
              ))}
            </div>
          </Section>

          <Section title={t("payment_method")}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[["upi", t("upi")], ["card", t("card")], ["netbanking", t("netbanking")], ["cod", t("cod")]].map(([id, label]) => (
                <button type="button" key={id} onClick={() => setPayment(id)} className={payment === id ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}>{label}</button>
              ))}
            </div>
          </Section>

          <button type="submit" disabled={placing || !address} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>
            {placing ? t("checkout_placing") : `${t("place_order")} · ${formatCurrency(total)}`}
          </button>
          {placementError && <p role="alert" className="auth-error" style={{ marginTop: 12 }}>{placementError}</p>}
        </form>

        <div>
          <div className="card" style={{ padding: 22, position: "sticky", top: 90 }}>
            <h4 style={{ fontSize: 15, marginBottom: 14 }}>{t("cart_title")}</h4>
            {items.map((i) => (
              <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 8, color: "var(--ink-soft)" }}>
                <span>{i.name} × {i.qty}</span><span>{formatCurrency(i.price * i.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--line)", margin: "12px 0" }} />
            <Row label={t("subtotal")} value={formatCurrency(subtotal)} />
            {bulkDiscount > 0 && <Row label={t("checkout_bulk_discount", { percent: bulkTier.percent })} value={`− ${formatCurrency(bulkDiscount)}`} green />}
            {couponDiscount > 0 && <Row label={t("checkout_coupon", { code: coupon.code })} value={`− ${formatCurrency(couponDiscount)}`} green />}
            <Row label={t("delivery_fee")} value={deliveryFee === 0 ? t("checkout_free") : formatCurrency(deliveryFee)} />
            <div style={{ borderTop: "1px solid var(--line)", margin: "12px 0" }} />
            <Row label={t("total")} value={formatCurrency(total)} bold />
            {festivalSavings > 0 && <p className="save-note">🎉 {t("checkout_festival_savings", { amount: festivalSavings })}</p>}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 800px) { .checkout-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function Section({ title, children }) { return <div style={{ marginBottom: 30 }}><h4 style={{ fontSize: 15.5, marginBottom: 14 }}>{title}</h4>{children}</div>; }
function Row({ label, value, bold, green }) {
  return <div style={{ display: "flex", justifyContent: "space-between", fontSize: bold ? 16 : 14, fontWeight: bold ? 700 : 400, marginBottom: 8, color: green ? "var(--olive)" : undefined }}><span>{label}</span><span>{value}</span></div>;
}
