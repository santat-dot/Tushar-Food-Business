import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { localizeTier } from "../../i18n/translations";

export default function Loyalty() {
  const { user } = useAuth();
  const { t, lang, formatDate } = useLanguage();
  const nextTierAt = 500;
  const progress = Math.min(100, (user.loyalty.points / nextTierAt) * 100);

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>{t("loyalty")}</h1>
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>{t("loyalty_tier", { tier: localizeTier(user.loyalty.tier, lang) })}</span>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{t("account_points", { count: user.loyalty.points })}</span>
        </div>
        <div style={{ height: 8, background: "var(--cream-deep)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "var(--mustard-deep)" }} />
        </div>
        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 8 }}>{t("loyalty_to_gold", { count: nextTierAt - user.loyalty.points })}</p>
      </div>

      <h3 style={{ fontSize: 17, marginBottom: 14 }}>{t("loyalty_ways_earn")}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
        {["purchase", "repeat_order", "referral", "review", "campaign"].map((key) => (
          <div key={key} className="card" style={{ padding: 16, fontSize: 14 }}>{t(`loyalty_${key}`)}</div>
        ))}
      </div>

      <h3 style={{ fontSize: 17, marginBottom: 14 }}>{t("loyalty_history")}</h3>
      {user.loyalty.history.map((h) => (
        <div key={h.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}>
          <span>{h.label}<br /><span style={{ color: "var(--ink-soft)", fontSize: 12 }}>{formatDate(h.date, { day: "numeric", month: "short", year: "numeric" })}</span></span>
          <span style={{ color: "var(--olive)", fontWeight: 600 }}>+{h.points}</span>
        </div>
      ))}
    </div>
  );
}
