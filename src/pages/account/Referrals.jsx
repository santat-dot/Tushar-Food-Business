import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export default function Referrals() {
  const { user } = useAuth();
  const { t, formatCurrency } = useLanguage();
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(user.referral.link).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>{t("referrals")}</h1>
      <div className="card" style={{ padding: 22, marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 6 }}>{t("referrals_code")}</div>
        <div style={{ fontSize: 22, fontFamily: "var(--serif)", letterSpacing: 1 }}>{user.referral.code}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <input readOnly value={user.referral.link} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 13 }} />
          <button onClick={copy} className="btn btn-outline btn-sm">{copied ? t("account_copied") : t("account_copy")}</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 24, fontFamily: "var(--serif)" }}>{user.referral.successfulReferrals}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{t("referrals_successful")}</div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 24, fontFamily: "var(--serif)" }}>{formatCurrency(user.referral.rewardsEarned)}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{t("referrals_rewards")}</div>
        </div>
      </div>
    </div>
  );
}
