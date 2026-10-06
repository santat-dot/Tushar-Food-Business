import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const FAQS = [
  ["faq_fresh_q", "faq_fresh_a"],
  ["faq_delivery_q", "faq_delivery_a"],
  ["faq_cancel_q", "faq_cancel_a"],
  ["faq_allergy_q", "faq_allergy_a"],
  ["faq_preorder_q", "faq_preorder_a"],
];

export default function FAQ() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(0);
  return (
    <div className="container section" style={{ maxWidth: 680 }}>
      <h1 style={{ fontSize: 30, marginBottom: 24 }}>{t("faq")}</h1>
      {FAQS.map(([question, answer], i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--line)", padding: "16px 0" }}>
          <button onClick={() => setOpen(open === i ? -1 : i)} style={{ background: "none", border: "none", width: "100%", textAlign: "left", fontSize: 15.5, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            {t(question)}<span>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 10, lineHeight: 1.6 }}>{t(answer)}</p>}
        </div>
      ))}
    </div>
  );
}
