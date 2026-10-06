import { useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { categories } from "../data/categories";
import { getProductBySlug, getRelatedProducts, products } from "../data/products";
import { reviews as allReviews } from "../data/reviews";
import { useLanguage } from "../context/LanguageContext";
import { localizeCategoryName } from "../i18n/translations";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import AvailabilityBadge from "../components/AvailabilityBadge";
import StarRating from "../components/StarRating";
import ProductCard from "../components/ProductCard";

export default function Product() {
  const { slug } = useParams();
  const { t, lang, formatCurrency } = useLanguage();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { toggle, isWishlisted } = useWishlist();
  const product = getProductBySlug(slug);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [notified, setNotified] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState(null);

  if (!product) return <Navigate to="/shop" replace />;

  const purchasable = ["available", "low-stock", "limited"].includes(product.availability);
  const related = getRelatedProducts(product);
  const combo = related[0] ? products.find((p) => p.id !== product.id && !related.includes(p) && p.categories.some((c) => product.categories.includes(c))) : null;
  const cat = categories.find((c) => c.slug === product.category);
  const productReviews = allReviews.filter((r) => r.productId === product.id);
  const wished = isWishlisted(product.id);

  function checkDelivery() {
    if (pincode.length !== 6) { setDeliveryMsg({ ok: false, key: "delivery_invalid_pincode" }); return; }
    const serviceable = ["411001", "411038", "400001", "440001"].includes(pincode);
    setDeliveryMsg(serviceable ? { ok: true, key: "delivery_serviceable" } : { ok: false, key: "delivery_unavailable" });
  }

  return (
    <div className="container section">
      <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 20 }}>
        <Link to="/">{t("nav_home")}</Link> / <Link to="/shop">{t("nav_shop")}</Link> / <Link to={`/category/${product.category}`}>{localizeCategoryName(cat, lang)}</Link> / {product.name}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }} className="product-top">
        <div>
          <div style={{ aspectRatio: "1/1", borderRadius: 16, overflow: "hidden", marginBottom: 12, position: "relative" }}>
            <img src={product.images[activeImg]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {product.offer && <span className="offer-ribbon" style={{ top: 14, left: 14 }}>{product.offer.emoji} {product.offer.percent}% OFF · {product.offer.title}</span>}
          </div>
          {product.images.length > 1 && (
            <div style={{ display: "flex", gap: 8 }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ width: 64, height: 64, borderRadius: 8, overflow: "hidden", border: activeImg === i ? "2px solid var(--mustard-deep)" : "1px solid var(--line)", padding: 0 }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <AvailabilityBadge status={product.availability} />
          <h1 style={{ fontSize: 30, marginTop: 12 }}>{product.name}</h1>
          <div style={{ marginTop: 8 }}><StarRating value={product.rating} count={product.reviewCount} /></div>
          <p style={{ marginTop: 16, color: "var(--ink-soft)", lineHeight: 1.6, fontSize: 15 }}>{product.description}</p>

          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 20 }}>
            <span style={{ fontSize: 28, fontFamily: "var(--serif)" }}>{formatCurrency(product.price)}</span>
            {product.originalPrice && <span style={{ fontSize: 16, color: "var(--ink-soft)", textDecoration: "line-through" }}>{formatCurrency(product.originalPrice)}</span>}
            <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>· {product.weight}</span>
            {product.offer && <span className="badge badge-offer">{t("product_save_amount", { amount: formatCurrency(product.originalPrice - product.price) })}</span>}
          </div>

          {product.availability === "unavailable" && (
            <p style={{ marginTop: 14, fontSize: 13.5, color: "var(--brick)", background: "#F4DEDA", padding: "10px 14px", borderRadius: 8 }}>{product.unavailableReason}</p>
          )}
          {product.availability === "preorder" && (
            <p style={{ marginTop: 14, fontSize: 13.5, color: "#5B4C82", background: "#EAE2F2", padding: "10px 14px", borderRadius: 8 }}>
              {t("product_preparation_date", { date: product.preorderDate, delivery: product.expectedDelivery })}
            </p>
          )}
          {product.availability === "low-stock" && (
            <p style={{ marginTop: 14, fontSize: 13.5, color: "var(--mustard-deep)" }}>{t("stock_only_left", { count: product.stock })}</p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
            {purchasable && (
              <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)", borderRadius: 999 }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ background: "none", border: "none", padding: "8px 16px", fontSize: 16 }}>−</button>
                <span style={{ minWidth: 20, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} style={{ background: "none", border: "none", padding: "8px 16px", fontSize: 16 }}>+</button>
              </div>
            )}
            <button
              onClick={() => toggle(product.id)}
              className="btn btn-outline btn-sm"
              style={{ color: wished ? "var(--brick)" : undefined, borderColor: wished ? "var(--brick)" : undefined }}
            >
              {wished ? "♥" : "♡"} {t("nav_wishlist")}
            </button>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            {purchasable ? (
              <>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => addItem(product, qty)}>{t("add_to_cart")}</button>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { if (addItem(product, qty)) navigate("/checkout"); }}>{t("buy_now")}</button>
              </>
            ) : product.availability === "preorder" ? (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => addItem(product, qty)}>{t("status_preorder")}</button>
            ) : (
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={notified}
                onClick={() => setNotified(true)}
              >
                {notified ? t("success_notify") : t("notify_me")}
              </button>
            )}
          </div>

          <div style={{ marginTop: 28, padding: 18, border: "1px solid var(--line)", borderRadius: 12 }}>
            <h4 style={{ fontSize: 14, marginBottom: 10 }}>{t("check_delivery")}</h4>
            <div style={{ display: "flex", gap: 10 }}>
              <input value={pincode} maxLength={6} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} placeholder={t("enter_pincode")} style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--line)" }} />
              <button onClick={checkDelivery} className="btn btn-outline btn-sm">{t("check_delivery")}</button>
            </div>
            {deliveryMsg && <p style={{ marginTop: 10, fontSize: 13, color: deliveryMsg.ok ? "var(--olive)" : "var(--brick)" }}>{t(deliveryMsg.key)}</p>}
          </div>
        </div>
      </div>

      {/* DETAIL SECTIONS */}
      <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: "2fr 1fr", gap: 48 }} className="product-details">
        <div>
          <DetailBlock title={t("product_story")}><p style={{ lineHeight: 1.7, color: "var(--ink-soft)" }}>{product.story}</p></DetailBlock>
          <DetailBlock title={t("ingredients")}>
            <ul style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {product.ingredients.map((ing) => <li key={ing} className="badge badge-available">{ing}</li>)}
            </ul>
          </DetailBlock>
          <DetailBlock title={t("storage")}><p style={{ color: "var(--ink-soft)" }}>{product.storage}</p></DetailBlock>
          <DetailBlock title={t("shelf_life")}><p style={{ color: "var(--ink-soft)" }}>{product.shelfLife}</p></DetailBlock>
          <DetailBlock title={t("delivery_info")}><p style={{ color: "var(--ink-soft)" }}>{t("product_delivery_copy")}</p></DetailBlock>

          <DetailBlock title={t("reviews")}>
            {productReviews.length === 0 ? (
              <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>{t("product_no_reviews")}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {productReviews.map((r) => (
                  <div key={r.id} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong style={{ fontSize: 14 }}>{r.name} {r.verified && <span style={{ fontSize: 11, color: "var(--olive)" }}>· {t("product_verified")}</span>}</strong>
                      <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{r.date}</span>
                    </div>
                    <StarRating value={r.rating} />
                    <p style={{ fontSize: 14, marginTop: 6, color: "var(--ink-soft)" }}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
            <button className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>{t("write_review")}</button>
          </DetailBlock>

          <DetailBlock title={t("faq")}>
            <FaqItem q={t("product_faq_delivery_q")} a={t("product_faq_delivery_a")} />
            <FaqItem q={t("product_faq_spice_q")} a={t("product_faq_spice_a")} />
          </DetailBlock>
        </div>

        <div>
          {combo && (
            <div className="card" style={{ padding: 18, marginBottom: 20 }}>
              <h4 style={{ fontSize: 14, marginBottom: 12 }}>{t("pair_it_with")}</h4>
              <ProductCard product={combo} />
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 60 }}>
          <h3 style={{ fontSize: 22, marginBottom: 20 }}>{t("related_products")}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 }}>
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 800px) {
          .product-top, .product-details { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function DetailBlock({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h4 style={{ fontSize: 16, marginBottom: 10 }}>{title}</h4>
      {children}
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--line)", padding: "10px 0" }}>
      <button onClick={() => setOpen((v) => !v)} style={{ background: "none", border: "none", width: "100%", textAlign: "left", fontSize: 14, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
        {q} <span>{open ? "−" : "+"}</span>
      </button>
      {open && <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 8 }}>{a}</p>}
    </div>
  );
}
