import { useWishlist } from "../context/WishlistContext";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { ids } = useWishlist();
  const { t } = useLanguage();
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container section">
      <h1 style={{ fontSize: 30, marginBottom: 24 }}>{t("nav_wishlist")}</h1>
      {items.length === 0 ? (
        <div className="empty-state">
          <h3>{t("empty_generic")}</h3>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 16, display: "inline-flex" }}>{t("hero_cta_1")}</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 }}>
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
