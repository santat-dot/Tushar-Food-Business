import { useState, useEffect, useMemo } from "react";
import { products } from "../data/products";
import { categories } from "../data/categories";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import { localizeCategoryName } from "../i18n/translations";

const RECENTS_KEY = "tfb_recent_searches";

export default function Search() {
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENTS_KEY)) || []; } catch { return []; }
  });

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.replace(/-/g, " ").includes(q) ||
      p.categories.some((slug) => {
        const category = categories.find((item) => item.slug === slug);
        return category && localizeCategoryName(category, lang).toLowerCase().includes(q);
      }) ||
      p.groups.some((g) => g.group.toLowerCase().includes(q)) ||
      p.ingredients?.some((i) => i.toLowerCase().includes(q))
    );
  }, [query, lang]);

  function commitSearch(q) {
    if (!q.trim()) return;
    const next = [q, ...recents.filter((r) => r !== q)].slice(0, 6);
    setRecents(next);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  }

  return (
    <div className="container section">
      <div style={{ maxWidth: 640, margin: "0 auto 32px" }}>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commitSearch(query)}
          placeholder={t("search_placeholder")}
          style={{ width: "100%", padding: "16px 20px", borderRadius: 999, border: "1px solid var(--line)", fontSize: 16, background: "var(--paper)" }}
        />
      </div>

      {!query && (
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {recents.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h4 style={{ fontSize: 14, marginBottom: 10, color: "var(--ink-soft)" }}>{t("recent_searches")}</h4>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {recents.map((r) => (
                  <button key={r} onClick={() => { setQuery(r); commitSearch(r); }} className="btn btn-outline btn-sm">{r}</button>
                ))}
              </div>
            </div>
          )}
          <h4 style={{ fontSize: 14, marginBottom: 10, color: "var(--ink-soft)" }}>{t("popular_categories")}</h4>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <Link key={c.slug} to={`/category/${c.slug}`} className="btn btn-outline btn-sm">{localizeCategoryName(c, lang)}</Link>
            ))}
          </div>
        </div>
      )}

      {query && (
        results.length === 0 ? (
          <div className="empty-state"><h3>{t("no_results")}</h3><p>{t("search_try_another")}</p></div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 }}>
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )
      )}
    </div>
  );
}
