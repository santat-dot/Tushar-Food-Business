import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { occasions } from "../data/categories";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";

const OCCASION_PRODUCTS = {
  "breakfast": ["c27", "c50"], "quick-lunch": ["c140", "c142"], "office-lunch": ["c140", "c27"],
  "family-dinner": ["c140", "c52", "c50"], "evening-cravings": ["c27", "c11"], "guests-coming": ["c50", "c50", "c52"],
  "weekend-special": ["c142", "c140"], "festival": ["c53", "c50", "c50"], "travel-packed": ["c27", "c108"], "small-party": ["c140", "c142", "c52"],
};

export default function OccasionPlanner() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const [selected, setSelected] = useState(params.get("occasion") || occasions[0].slug);
  const ids = OCCASION_PRODUCTS[selected] || [];
  const list = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container section">
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>{t("occasion_title")}</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 28 }}>Pick an occasion and we'll suggest what fits.</p>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", marginBottom: 30 }}>
        {occasions.map((o) => (
          <button key={o.slug} onClick={() => setSelected(o.slug)} className={selected === o.slug ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"} style={{ flexShrink: 0 }}>{o.name}</button>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="empty-state"><h3>{t("empty_generic")}</h3></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 }}>
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
