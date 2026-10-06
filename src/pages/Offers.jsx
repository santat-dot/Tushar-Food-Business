import { useState } from "react";
import { Link } from "react-router-dom";
import { offers, coupons, bulkTiers, offerStatus, liveOffers } from "../data/offers";
import { products } from "../data/products";
import OfferCard from "../components/OfferCard";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { localizeCoupon } from "../i18n/translations";

export default function Offers() {
  const { showToast } = useCart();
  const { t, lang, formatCurrency } = useLanguage();
  const live = liveOffers();
  const upcoming = offers.filter((o) => offerStatus(o) === "upcoming");
  const onOffer = products.filter((p) => p.offer);
  const [copied, setCopied] = useState(null);

  function copy(code) {
    navigator.clipboard?.writeText(code);
    setCopied(code); showToast(t("offers_coupon_copied", { code })); setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div>
      <section className="offers-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: "#F3D79A" }}>{t("offers_eyebrow")}</p>
          <h1>{t("offers_title")}</h1>
          <p>{t("offers_description")}</p>
        </div>
      </section>

      <div className="container section" style={{ paddingTop: 48 }}>
        <h2 className="block-title">🔥 {t("offers_live_now")}</h2>
        {live.length === 0 ? <p style={{ color: "var(--ink-soft)" }}>{t("offers_none_live")}</p>
          : <div className="offer-grid">{live.map((o) => <OfferCard key={o.id} offer={o} />)}</div>}

        {onOffer.length > 0 && (
          <>
            <h2 className="block-title" style={{ marginTop: 56 }}>{t("offers_items_on_offer", { count: onOffer.length })}</h2>
            <div className="product-grid">{onOffer.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </>
        )}

        <h2 className="block-title" style={{ marginTop: 56 }}>📅 {t("offers_upcoming")}</h2>
        <div className="offer-grid">{upcoming.map((o) => <OfferCard key={o.id} offer={o} />)}</div>

        <h2 className="block-title" style={{ marginTop: 56 }}>🎟️ {t("offers_coupons_bulk")}</h2>
        <div className="offer-grid">
          {coupons.map((c) => (
            <div key={c.code} className="card coupon-card">
              <div><strong style={{ fontSize: 20, letterSpacing: ".06em" }}>{c.code}</strong><p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 4 }}>{localizeCoupon(c, lang).label}</p></div>
              <button className="btn btn-outline btn-sm" onClick={() => copy(c.code)}>{copied === c.code ? `${t("offers_copied")} ✓` : t("offers_copy")}</button>
            </div>
          ))}
          {[...bulkTiers].reverse().map((b) => (
            <div key={b.min} className="card coupon-card">
              <div><strong style={{ fontSize: 20 }}>{t("offers_bulk_discount", { percent: b.percent })}</strong><p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 4 }}>{t("offers_bulk_description", { amount: formatCurrency(b.min) })}</p></div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 28, fontSize: 13.5, color: "var(--ink-soft)" }}>{t("offers_bulk_buyer")} <Link to="/account/orders" style={{ textDecoration: "underline" }}>{t("offers_my_orders")}</Link>.</p>
      </div>
    </div>
  );
}
