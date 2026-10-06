import { referralRules } from "../data/adminData";
import { PageHeader, StatCard } from "../components/AdminUI";

export default function ReferralsAdmin() {
  return (
    <>
      <PageHeader title="Referrals" />
      <div className="admin-content">
        <div className="a-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: 16 }}>
          <StatCard label="Total Referrals" value={referralRules.totalReferrals} />
          <StatCard label="Successful Referrals" value={referralRules.successfulReferrals} />
          <StatCard label="Success Rate" value={`${Math.round((referralRules.successfulReferrals / referralRules.totalReferrals) * 100)}%`} />
        </div>
        <div className="a-panel">
          <h3>Referral Rules</h3>
          <p style={{ fontSize: 13.5, marginBottom: 6 }}><strong>Referrer reward:</strong> {referralRules.referrerReward}</p>
          <p style={{ fontSize: 13.5 }}><strong>Referee reward:</strong> {referralRules.refereeReward}</p>
        </div>
      </div>
    </>
  );
}
