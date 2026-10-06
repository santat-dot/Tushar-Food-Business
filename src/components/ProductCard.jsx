import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import AvailabilityBadge from "./AvailabilityBadge";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
  const { t, formatCurrency } = useLanguage();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const purchasable = product.availability === "available" || product.availability === "low-stock" || product.availability === "limited";
  const wished = isWishlisted(product.id);

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Link to={`/product/${product.slug}`} style={{ position: "relative", display: "block", aspectRatio: "4/3", overflow: "hidden" }}>
        <img src={product.images[0]} alt={product.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {product.offer && <span className="offer-ribbon">{product.offer.emoji} {product.offer.percent}% OFF</span>}
        {product.badge && !product.offer && (
          <span style={{ position: "absolute", top: 10, left: 10, background: "var(--ink)", color: "var(--cream)", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999 }}>
            {product.badge}
          </span>
        )}
        <button
          aria-label={wished ? t("wishlist_remove") : t("wishlist_add")}
          onClick={(e) => { e.preventDefault(); toggle(product.id); }}
          style={{ position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(255,253,249,0.92)", fontSize: 16, color: wished ? "var(--brick)" : "var(--ink-soft)" }}
        >
          {wished ? "♥" : "♡"}
        </button>
      </Link>
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <Link to={`/product/${product.slug}`}>
            <h3 style={{ fontSize: 16.5 }}>{product.name}</h3>
          </Link>
        </div>
        <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{product.weight}</span>
        <StarRating value={product.rating} count={product.reviewCount} />
        <div style={{ marginTop: 2 }}>
          <AvailabilityBadge status={product.availability} />
        </div>
        <div style={{ marginTop: "auto", paddingTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <strong style={{ fontSize: 17 }}>{formatCurrency(product.price)}</strong>
            {product.originalPrice && (
              <span style={{ marginLeft: 6, fontSize: 13, color: "var(--ink-soft)", textDecoration: "line-through" }}>{formatCurrency(product.originalPrice)}</span>
            )}
          </div>
        </div>
        {purchasable ? (
          <button className="btn btn-primary btn-sm" onClick={() => addItem(product, 1)} style={{ width: "100%", marginTop: 4 }}>
            {t("add_to_cart")}
          </button>
        ) : (
          <Link to={`/product/${product.slug}`} className="btn btn-outline btn-sm" style={{ width: "100%", marginTop: 4, textAlign: "center" }}>
            {product.availability === "preorder" ? t("status_preorder") : t("notify_me")}
          </Link>
        )}
      </div>
    </div>
  );
}
