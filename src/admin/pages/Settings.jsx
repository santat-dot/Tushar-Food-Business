import { useState } from "react";
import { PageHeader, Badge } from "../components/AdminUI";
import { useAdminAuth } from "../AdminAuthContext";

const WHATSAPP_TEMPLATES = ["Order Confirmation", "Order Status", "Delivery Update", "Restock", "Review Request", "Admin Alert", "Reorder", "Customer Support"];

export default function Settings() {
  const { logout } = useAdminAuth();
  const [tab, setTab] = useState("notifications");

  return (
    <>
      <PageHeader title="Settings" action={<button className="a-btn a-btn-outline" onClick={logout}>Log Out</button>} />
      <div className="admin-content">
        <div className="a-tabs">
          <button className={tab === "notifications" ? "active" : ""} onClick={() => setTab("notifications")}>Notifications</button>
          <button className={tab === "seo" ? "active" : ""} onClick={() => setTab("seo")}>SEO Foundation</button>
          <button className={tab === "local" ? "active" : ""} onClick={() => setTab("local")}>Local Business</button>
        </div>

        {tab === "notifications" && (
          <div className="a-panel">
            <h3>WhatsApp / Notification Templates</h3>
            <p style={{ fontSize: 12.5, color: "var(--a-text-soft)", marginBottom: 12 }}>Prototype templates — sending is simulated, no real WhatsApp/SMS integration.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {WHATSAPP_TEMPLATES.map((t) => <Badge key={t} tone="info">{t}</Badge>)}
            </div>
          </div>
        )}

        {tab === "seo" && (
          <div className="a-panel">
            <h3>SEO Foundation</h3>
            <p style={{ fontSize: 13.5, marginBottom: 8 }}>Every product, category and story page is configured with a page title, meta description, canonical URL, Open Graph tags, semantic HTML and alt text.</p>
            <p style={{ fontSize: 13.5, marginBottom: 8 }}>A sitemap.xml and robots.txt structure is included at the project root for prototype purposes.</p>
            <p style={{ fontSize: 12.5, color: "var(--a-text-soft)" }}>This is a technical foundation only — it does not guarantee search rankings.</p>
          </div>
        )}

        {tab === "local" && (
          <div className="a-panel">
            <h3>Local Business Foundation</h3>
            <p style={{ fontSize: 13.5, marginBottom: 8 }}>Configuration placeholders for Google Business Profile, Google Maps embed, Local Search listing, and Search Console verification.</p>
            <p style={{ fontSize: 12.5, color: "var(--a-text-soft)" }}>No business verification is performed in this prototype — these are content areas to fill in when going live.</p>
          </div>
        )}
      </div>
    </>
  );
}
