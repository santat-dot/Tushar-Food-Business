import { useState } from "react";
import { adminOffers as seed } from "../data/adminData";
import { PageHeader, Table, Badge, Modal, Progress } from "../components/AdminUI";

const TYPES = ["Percentage", "Flat", "Free Delivery", "Combo", "Festival Offer"];
const blank = { code: "", type: "Percentage", value: "", minOrder: "", expiry: "", usageLimit: "", scope: "All products" };

export default function Offers() {
  const [offers, setOffers] = useState(seed);
  const [form, setForm] = useState(null);

  function toggle(id) { setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o))); }
  function save(e) {
    e.preventDefault();
    setOffers((prev) => [{ id: "o" + Date.now(), ...form, used: 0, active: true }, ...prev]);
    setForm(null);
  }

  return (
    <>
      <PageHeader title="Offers" action={<button className="a-btn" onClick={() => setForm({ ...blank })}>+ New Offer</button>} />
      <div className="admin-content">
        <div className="a-panel">
          <Table
            columns={["Code", "Type", "Value", "Min Order", "Expiry", "Usage", "Scope", "Status", "Actions"]}
            rows={offers}
            renderRow={(o) => (
              <tr key={o.id}>
                <td><strong>{o.code}</strong></td><td>{o.type}</td><td>{o.value}</td><td>₹{o.minOrder}</td><td>{o.expiry}</td>
                <td style={{ width: 130 }}>{o.used}/{o.usageLimit}<Progress value={o.used} max={o.usageLimit} /></td>
                <td>{o.scope}</td>
                <td><Badge tone={o.active ? "good" : "bad"}>{o.active ? "active" : "inactive"}</Badge></td>
                <td><button className="a-btn a-btn-outline a-btn-sm" onClick={() => toggle(o.id)}>{o.active ? "Deactivate" : "Activate"}</button></td>
              </tr>
            )}
          />
        </div>
      </div>

      {form && (
        <Modal onClose={() => setForm(null)}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>New Offer</h3>
          <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label>Code<input className="a-input" required style={{ width: "100%", marginTop: 4 }} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></label>
            <label>Type<select className="a-select" style={{ width: "100%", marginTop: 4 }} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select></label>
            <label>Value (e.g. 10%, ₹100)<input className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></label>
            <label>Minimum Order (₹)<input type="number" className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} /></label>
            <label>Expiry<input type="date" className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} /></label>
            <label>Usage Limit<input type="number" className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} /></label>
            <label style={{ gridColumn: "1 / -1" }}>Scope (product/category restriction)<input className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} /></label>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
              <button className="a-btn" type="submit">Create Offer</button>
              <button className="a-btn a-btn-outline" type="button" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
