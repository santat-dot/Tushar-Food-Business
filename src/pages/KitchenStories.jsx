import { useState } from "react";
import { kitchenStories } from "../data/kitchenStories";
import { getProductBySlug, products } from "../data/products";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

export default function KitchenStories() {
  const { t } = useLanguage();
  const [active, setActive] = useState(null);

  return (
    <div className="container section">
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>{t("nav_kitchen_stories")}</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 30, maxWidth: 560 }}>{t("kitchen_stories_home")} — real glimpses from our daily cooking.</p>
      <div className="kitchen-story-grid">
        {kitchenStories.map((s) => {
          const product = products.find((p) => p.id === s.relatedProductId);
          return (
            <div key={s.id} className="card" onClick={() => setActive(s)} style={{ cursor: "pointer" }}>
              <div className="kitchen-story-media" style={{ position: "relative", overflow: "hidden" }}>
                <img src={s.thumbnail} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, color: "#fff", background: "rgba(0,0,0,0.15)" }}>▶</span>
                <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 11, padding: "2px 7px", borderRadius: 999 }}>{s.duration}</span>
              </div>
              <div style={{ padding: 14 }}>
                <h4 style={{ fontSize: 15 }}>{s.title}</h4>
                <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4 }}>{s.caption}</p>
                {product && <Link to={`/product/${product.slug}`} onClick={(e) => e.stopPropagation()} className="link-more" style={{ fontSize: 12, marginTop: 8, display: "inline-block" }}>View {product.name}</Link>}
              </div>
            </div>
          );
        })}
      </div>

      {active && (
        <div onClick={() => setActive(null)} style={{ position: "fixed", inset: 0, background: "rgba(20,15,10,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--ink)", borderRadius: 16, maxWidth: 340, width: "100%", overflow: "hidden" }}>
            <div style={{ aspectRatio: "9/16", position: "relative" }}>
              <img src={active.thumbnail} alt={active.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, color: "#fff" }}>▶</span>
            </div>
            <div style={{ padding: 18 }}>
              <h4 style={{ color: "var(--cream)", fontSize: 16 }}>{active.title}</h4>
              <p style={{ color: "#C9BFAF", fontSize: 13, marginTop: 6 }}>{active.caption}</p>
              <button onClick={() => setActive(null)} className="btn btn-outline btn-sm" style={{ marginTop: 14, color: "var(--cream)", borderColor: "var(--cream)" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
