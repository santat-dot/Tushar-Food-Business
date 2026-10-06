import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  return (
    <div className="container section" style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 30, marginBottom: 10 }}>{t("nav_contact")}</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 28 }}>{t("contact_intro")}</p>
      {sent ? (
        <div className="empty-state"><h3>{t("contact_sent")}</h3><p>{t("contact_response_time")}</p></div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input required placeholder={t("name")} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid var(--line)" }} />
          <input required type="email" placeholder={t("email")} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid var(--line)" }} />
          <textarea required placeholder={t("contact_message_placeholder")} rows={5} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid var(--line)" }} />
          <button type="submit" className="btn btn-primary">{t("contact_send")}</button>
        </form>
      )}
    </div>
  );
}
