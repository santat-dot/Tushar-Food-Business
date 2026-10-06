import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { products, productsInCategory } from "../data/products";
import { categories } from "../data/categories";
import { liveOffers, upcomingOffers } from "../data/offers";
import { generalReviews } from "../data/reviews";
import { localizeCategoryName } from "../i18n/translations";
import ProductCard from "../components/ProductCard";
import OfferCard from "../components/OfferCard";
import ReorderButtons from "../components/ReorderButtons";
import StarRating from "../components/StarRating";

export default function Home() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { orders } = useOrders();
  const live = liveOffers();
  const shownOffers = [...live, ...upcomingOffers()].slice(0, 3);
  const lastOrder = user ? orders[0] : null;
  const bestsellers = products.filter((p) => p.badge === "Bestseller" && p.availability === "available").slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">{t("hero_eyebrow")}</div>
            <h1>{t("hero_title_store")}</h1>
            <p>{t("hero_description", { count: products.length })}</p>
            <div className="hero-cta">
              <a href="#categories" className="btn btn-primary">{t("hero_shop_categories")}</a>
              <Link to="/offers" className="btn btn-outline">🔥 {t("hero_view_offers")}</Link>
              {!user && <Link to="/signup" className="btn btn-ghost" style={{ textDecoration: "underline" }}>{t("hero_create_account")}</Link>}
            </div>
            <div className="hero-trust">
              {["hero_vegetarian", "hero_no_preservatives", "hero_saved_address", "hero_reorder"].map((key) => <span key={key}>✓ {t(key)}</span>)}
            </div>
          </div>
          <div className="hero-mosaic" aria-hidden="true">
            {categories.slice(0, 6).map((c) => (
              <Link key={c.slug} to={`/category/${c.slug}`} className="mosaic-tile" style={{
                "--h": c.hue,
                backgroundImage: `linear-gradient(160deg, rgba(255,255,255,0.18), rgba(38,26,18,0.52)), url(${c.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                textShadow: "0 2px 16px rgba(0,0,0,0.35)"
              }}><span>{c.emoji}</span><b>{localizeCategoryName(c, lang)}</b></Link>
            ))}
          </div>
        </div>
      </section>

      {/* WELCOME BACK / REORDER */}
      {lastOrder && (
        <section className="container reorder-strip">
          <div>
            <h3>⟳ {t("home_order_again")}</h3>
            <p>Your last order #{lastOrder.id}: {lastOrder.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}</p>
          </div>
          <ReorderButtons items={lastOrder.items} />
        </section>
      )}

      {/* OFFERS */}
      {shownOffers.length > 0 && (
        <section className="section" style={{ paddingBottom: 24 }}>
          <div className="container">
            <div className="section-head"><div><div className="eyebrow">{t("home_festival_discounts")}</div><h2 className="section-title">{t("home_offers_occasion")}</h2></div><Link to="/offers" className="link-more">{t("home_all_offers")}</Link></div>
            <div className="offer-grid">{shownOffers.map((o) => <OfferCard key={o.id} offer={o} />)}</div>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <section className="section" id="categories">
        <div className="container">
          <div className="section-head"><div><div className="eyebrow">{t("home_browse")}</div><h2 className="section-title">{t("shop_by_category")}</h2></div></div>
          <div className="cat-grid">
            {categories.map((c) => (
              <Link key={c.slug} to={`/category/${c.slug}`} className="cat-tile" style={{
                "--h": c.hue,
                backgroundImage: `linear-gradient(160deg, rgba(255,255,255,0.25), rgba(31,25,18,0.52)), url(${c.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                textShadow: "0 2px 16px rgba(0,0,0,0.35)"
              }}>
                <span className="cat-tile-emoji">{c.emoji}</span>
                <h4>{localizeCategoryName(c, lang)}</h4>
                <small>{t("unit_items", { count: productsInCategory(c.slug).length })}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {bestsellers.length > 0 && (
        <section className="section" style={{ background: "var(--cream-deep)", paddingTop: 56, paddingBottom: 56 }}>
          <div className="container">
            <div className="section-head"><h2 className="section-title">{t("home_customer_favourites")}</h2></div>
            <div className="product-grid">{bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        </section>
      )}

      {/* ALL PACKAGED FOOD, SECTION BY SECTION */}
      {categories.map((c, idx) => {
        const items = productsInCategory(c.slug);
        return (
          <section key={c.slug} id={c.slug} className="section cat-section" style={{ background: idx % 2 ? "var(--cream-deep)" : "transparent" }}>
            <div className="container">
              <div className="section-head">
                <div><div className="eyebrow">{c.emoji} {t("home_items", { count: items.length })}</div><h2 className="section-title">{localizeCategoryName(c, lang)}</h2></div>
                <Link to={`/category/${c.slug}`} className="link-more">{t("home_view_all", { count: items.length })} →</Link>
              </div>
              <div className="product-grid">{items.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}</div>
              {items.length > 8 && <div style={{ textAlign: "center", marginTop: 28 }}><Link to={`/category/${c.slug}`} className="btn btn-outline">{t("home_see_all", { category: localizeCategoryName(c, lang) })}</Link></div>}
            </div>
          </section>
        );
      })}

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <div className="section-head"><h2 className="section-title">{t("home_how_ordering_works")}</h2></div>
          <div className="steps-grid">
            {[["01", "home_browse_freely", "home_browse_description"], ["02", "home_signup_once", "home_signup_description"],
              ["03", "home_add_order", "home_add_order_description"], ["04", "home_reorder_click", "home_reorder_description"]].map(([n, heading, description]) => (
              <div key={n} className="card step-card"><div className="step-n">{n}</div><h4>{t(heading)}</h4><p>{t(description)}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section" style={{ background: "var(--cream-deep)" }}>
        <div className="container">
          <div className="section-head"><h2 className="section-title">{t("reviews")}</h2></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {generalReviews.map((r) => (
              <div key={r.id} className="card" style={{ padding: 22 }}>
                <StarRating value={r.rating} />
                <p style={{ fontSize: 14.5, marginTop: 10, lineHeight: 1.6 }}>"{r.text}"</p>
                <div style={{ marginTop: 12, fontSize: 13, color: "var(--ink-soft)" }}>{r.name} · {r.location}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
