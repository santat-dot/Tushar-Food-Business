import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer style={{ background: "var(--ink)", color: "var(--cream)", marginTop: 80 }}>
      <div className="container" style={{ padding: "56px 24px 28px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 32 }}>
        <div>
          <h3 style={{ color: "var(--cream)", fontSize: 22, marginBottom: 12 }}>Tushar Food Business</h3>
          <p style={{ color: "#C9BFAF", fontSize: 14, maxWidth: 320, lineHeight: 1.6 }}>{t("footer_description")}</p>
        </div>
        <div>
          <h4 style={{ color: "var(--cream)", fontSize: 14, marginBottom: 14 }}>{t("footer_explore")}</h4>
          <FooterLinks links={[["/shop", t("nav_shop")], ["/offers", t("footer_offers")], ["/kitchen-stories", t("nav_kitchen_stories")], ["/our-story", t("nav_our_story")], ["/recipes", t("nav_recipes")]]} />
        </div>
        <div>
          <h4 style={{ color: "var(--cream)", fontSize: 14, marginBottom: 14 }}>{t("footer_account")}</h4>
          <FooterLinks links={[["/account/orders", t("footer_orders")], ["/wishlist", t("nav_wishlist")], ["/track-order", t("nav_track_order")], ["/account/loyalty", t("loyalty")]]} />
        </div>
        <div>
          <h4 style={{ color: "var(--cream)", fontSize: 14, marginBottom: 14 }}>{t("footer_help")}</h4>
          <FooterLinks links={[["/faq", t("faq")], ["/contact", t("nav_contact")]]} />
        </div>
      </div>
      <div style={{ borderTop: "1px solid #3E3327", padding: "18px 24px", textAlign: "center", fontSize: 12.5, color: "#9C907E" }}>
        © 2026 Tushar Food Business. Prototype build — Version 2.{" "}
        <Link to="/admin" style={{ color: "#C9BFAF", textDecoration: "underline" }}>{t("footer_admin")}</Link>
      </div>
    </footer>
  );
}

function FooterLinks({ links }) {
  return (
    <ul style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {links.map(([to, label]) => (
        <li key={to}><Link to={to} style={{ color: "#C9BFAF", fontSize: 13.5 }}>{label}</Link></li>
      ))}
    </ul>
  );
}
