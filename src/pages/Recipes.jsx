import { Link } from "react-router-dom";
import { recipes } from "../data/recipes";
import { useLanguage } from "../context/LanguageContext";

export default function Recipes() {
  const { t } = useLanguage();
  return (
    <div className="container section">
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>{t("nav_recipes")}</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 30 }}>Simple recipes from our kitchen that pair well with what we deliver.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
        {recipes.map((r) => (
          <Link key={r.id} to={`/recipes/${r.slug}`} className="card">
            <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
              <img src={r.image} alt={r.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: 16 }}>
              <h4 style={{ fontSize: 16 }}>{r.title}</h4>
              <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4 }}>{r.time}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
