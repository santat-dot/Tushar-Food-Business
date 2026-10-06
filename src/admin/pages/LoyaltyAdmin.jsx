import { loyaltyRules } from "../data/adminData";
import { PageHeader, Table } from "../components/AdminUI";

export default function LoyaltyAdmin() {
  return (
    <>
      <PageHeader title="Loyalty" />
      <div className="admin-content">
        <div className="a-panel" style={{ marginBottom: 16 }}>
          <h3>Points Rules</h3>
          <p style={{ fontSize: 13.5 }}>{loyaltyRules.pointsPerRupee} point earned per ₹1 spent · Redemption: {loyaltyRules.redemptionRate}</p>
        </div>
        <div className="a-panel" style={{ marginBottom: 16 }}>
          <h3>Rewards</h3>
          <Table columns={["Reward", "Points Required"]} rows={loyaltyRules.rewards} renderRow={(r) => <tr key={r.id}><td>{r.name}</td><td>{r.points}</td></tr>} />
        </div>
        <div className="a-panel">
          <h3>Campaigns</h3>
          <Table columns={["Campaign", "Period"]} rows={loyaltyRules.campaigns} renderRow={(c) => <tr key={c.id}><td>{c.name}</td><td>{c.period}</td></tr>} />
        </div>
      </div>
    </>
  );
}
