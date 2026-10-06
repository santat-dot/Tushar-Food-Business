import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { productsInCategory } from "../data/products";
import { categories } from "../data/categories";
import { liveOffers } from "../data/offers";
import ProductCard from "../components/ProductCard";
import FilterSortBar from "../components/FilterSortBar";
import { useFilteredProducts } from "../utils/useFilteredProducts";
import { useLanguage } from "../context/LanguageContext";
import { localizeCategoryDescription, localizeCategoryGroup, localizeCategoryName } from "../i18n/translations";

export default function Category() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const [group, setGroup] = useState("all");
  const category = categories.find((c) => c.slug === slug);
  const all = category ? productsInCategory(slug) : [];
  const base = group === "all" ? all : all.filter((p) => p.groups.some((g) => g.category === slug && g.group === group));
  const f = useFilteredProducts(base);
  const offer = liveOffers().find((o) => o.categories.includes(slug));

  if (!category) return <Navigate to="/shop" replace />;

  return (
    <div className="container section" key={slug}>
      <div className="crumbs"><Link to="/">{t("nav_home")}</Link> / <Link to="/shop">{t("nav_shop")}</Link> / {localizeCategoryName(category, lang)}</div>
      <div className="cat-hero" style={{
        "--h": category.hue,
        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.28), rgba(31,25,18,0.44)), url(${category.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        textShadow: "0 2px 16px rgba(0,0,0,0.35)"
      }}>
        <span className="cat-hero-emoji">{category.emoji}</span>
        <div><h1 style={{ fontSize: 32 }}>{localizeCategoryName(category, lang)}</h1><p>{localizeCategoryDescription(category, lang)} · {t("unit_items", { count: all.length })}</p></div>
      </div>
      {offer && <Link to="/offers" className="offer-strip">{offer.emoji} <b>{offer.title}</b> — {offer.percent}% off · {t("home_all_offers")} →</Link>}
      <div className="chip-row">
        <button className={group === "all" ? "chip is-active" : "chip"} onClick={() => setGroup("all")}>{t("category_all_items", { count: all.length })}</button>
        {category.groups.length > 1 && category.groups.map((g) => (
          <button key={g} className={group === g ? "chip is-active" : "chip"} onClick={() => setGroup(g)}>{localizeCategoryGroup(g, lang)}</button>
        ))}
      </div>
      <FilterSortBar f={f} resultCount={f.filtered.length} />
      {f.filtered.length === 0 ? (
        <div className="empty-state"><h3>{t("no_results")}</h3></div>
      ) : (
        <div className="product-grid">{f.filtered.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
