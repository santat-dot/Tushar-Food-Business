import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { categories } from "../data/categories";
import { liveOffers } from "../data/offers";
import { languageOptions, localizeCategoryName, localizeOffer } from "../i18n/translations";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const { itemCount, requireLogin } = useCart();
  const { user, logout } = useAuth();
  const { ids } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const navigate = useNavigate();
  const live = liveOffers()[0];
  const localizedLive = live ? localizeOffer(live, lang) : null;

  const links = [
    { to: "/", label: t("nav_home") },
    { to: "/shop", label: t("nav_shop") },
    { to: "/offers", label: `${t("nav_offers")} 🔥` },
    { to: "/kitchen-stories", label: t("nav_kitchen_stories") },
    { to: "/our-story", label: t("nav_our_story") },
    { to: "/track-order", label: t("nav_track_order") },
  ];

  return (
    <header className="site-header">
      {live && (
        <Link to="/offers" className="announce">
          {localizedLive.emoji} <b>{localizedLive.title}</b> — {t("offer_percent_off", { percent: localizedLive.percent })} · {localizedLive.note} <u>{t("home_all_offers")}</u>
        </Link>
      )}
      <div className="container nav-main">
        <button onClick={() => setMenuOpen((v) => !v)} aria-label={t("nav_toggle_menu")} className="nav-burger">☰</button>
        <Link to="/" className="brand"><span className="brand-mark">TF</span>Tushar Food</Link>

        <nav className="nav-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <div style={{ position: "relative" }}>
            <button onClick={() => setLangOpen((v) => !v)} className="nav-language" aria-label={t("nav_select_language")}>
              <span className="nav-language-icon">文</span><span>{languageOptions.find((l) => l.code === lang)?.label}</span><span className="nav-chevron">⌄</span>
            </button>
            {langOpen && (
              <div className="dropdown">
                {languageOptions.map((l) => <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }} className={l.code === lang ? "is-active" : ""}>{l.label}</button>)}
              </div>
            )}
          </div>
          <button onClick={() => navigate("/search")} className="nav-action" aria-label={t("nav_search")}><span className="nav-action-icon">⌕</span><span className="nav-action-label">{t("nav_search")}</span></button>
          <Link to="/wishlist" className="nav-action" aria-label={t("nav_wishlist")}><span className="nav-action-icon">♡</span><span className="nav-action-label">{t("nav_wishlist")}</span>{ids.length > 0 && <span className="nav-count">{ids.length}</span>}</Link>
          <button onClick={() => { if (requireLogin(t("auth_cart_login_prompt"))) setCartOpen(true); }} className="nav-action" aria-label={t("nav_cart")}>
            <span className="nav-action-icon">🛒</span><span className="nav-action-label">{t("nav_cart")}</span>{itemCount > 0 && <span className="nav-count">{itemCount}</span>}
          </button>
          {user ? (
            <div style={{ position: "relative" }}>
              <button className="nav-action" onClick={() => setUserOpen((v) => !v)}><span className="avatar">{user.name.charAt(0).toUpperCase()}</span><span className="nav-action-label">{user.name.split(" ")[0]}</span></button>
              {userOpen && (
                <div className="dropdown" onClick={() => setUserOpen(false)}>
                  <Link to="/account">{t("nav_my_account")}</Link><Link to="/account/orders">{t("nav_my_orders")}</Link><Link to="/account/addresses">{t("nav_saved_address")}</Link>
                  <button onClick={() => { logout(); navigate("/"); }} style={{ color: "var(--brick)" }}>{t("nav_logout")}</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/account" className="btn btn-primary btn-sm">{t("nav_my_account")}</Link>
          )}
        </div>
      </div>

      <div className="cat-bar"><div className="container cat-bar-inner">
        {categories.map((c) => (
          <NavLink key={c.slug} to={`/category/${c.slug}`} className={({ isActive }) => (isActive ? "cat-link is-active" : "cat-link")}>{localizeCategoryName(c, lang)}</NavLink>
        ))}
      </div></div>

      {menuOpen && (
        <div className="container mobile-menu">
          {links.map((l) => <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}>{l.label}</Link>)}
          <Link to="/account" onClick={() => setMenuOpen(false)}><b>{t("nav_my_account")}</b></Link>
        </div>
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
