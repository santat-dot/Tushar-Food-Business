import { useLanguage } from "../context/LanguageContext";

export default function OurStory() {
  const { t } = useLanguage();
  return (
    <div>
      <div className="container section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="story-hero">
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>{t("our_story_title")}</div>
            <h1 style={{ fontSize: 34 }}>A Kitchen That Started With One Tiffin</h1>
            <p style={{ marginTop: 18, color: "var(--ink-soft)", lineHeight: 1.7 }}>
              Tushar Food Business began as a small home kitchen making a handful of lunchboxes for neighbours.
              What stayed constant since then is the intent: every dish is made the way it would be for our own family,
              using the same recipes, the same care, and no shortcuts.
            </p>
          </div>
          <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=900" alt="Founder in the kitchen" style={{ borderRadius: 20, aspectRatio: "4/5", objectFit: "cover" }} />
        </div>
      </div>

      <div className="section" style={{ background: "var(--cream-deep)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {[
            ["Homemade First", "Every recipe is one we cook at home, scaled up without losing its character."],
            ["Honest Ingredients", "We tell you exactly what goes into each dish — no vague labels."],
            ["Made To Order", "Most items are prepared the same day, not stocked in bulk."],
          ].map(([title, desc]) => (
            <div key={title} className="card" style={{ padding: 24 }}>
              <h4 style={{ fontSize: 17 }}>{title}</h4>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container section">
        <h2 className="section-title" style={{ marginBottom: 20 }}>Our Values</h2>
        <ul style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {["Care in every batch, however small the order.", "Transparency about what we cook and how.", "Respect for the people who cook and deliver your food."].map((v) => (
            <li key={v} style={{ fontSize: 15, paddingLeft: 20, position: "relative", color: "var(--ink-soft)" }}>
              <span style={{ position: "absolute", left: 0, color: "var(--mustard-deep)" }}>—</span>{v}
            </li>
          ))}
        </ul>
      </div>
      <style>{`@media (max-width: 800px) { .story-hero { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
