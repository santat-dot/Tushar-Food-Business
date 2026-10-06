import { products } from "../data/products";
import { categories } from "../data/categories";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import FilterSortBar from "../components/FilterSortBar";
import { useFilteredProducts } from "../utils/useFilteredProducts";
import { useLanguage } from "../context/LanguageContext";
import { localizeCategoryName } from "../i18n/translations";

export default function Shop() {
  const { t, lang } = useLanguage();
  const f = useFilteredProducts(products);

  return (
    <div className="container section">
      <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 10 }}>
        <Link to="/">{t("nav_home")}</Link> / {t("nav_shop")}
      </div>
      <h1 style={{ fontSize: 32, marginBottom: 6 }}>{t("nav_shop")}</h1>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "18px 0" }}>
        {categories.map((c) => (
          <Link key={c.slug} to={`/category/${c.slug}`} className="chip" style={{ flexShrink: 0 }}>{c.emoji} {localizeCategoryName(c, lang)}</Link>
        ))}
      </div>
      <FilterSortBar f={f} resultCount={f.filtered.length} />
      {f.filtered.length === 0 ? (
        <div className="empty-state"><h3>{t("no_results")}</h3></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 }}>
          {f.filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
