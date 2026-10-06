import { useState } from "react";
import { subscriptionPlans as seed } from "../data/adminData";
import { PageHeader, Table, Badge, Modal } from "../components/AdminUI";

export default function SubscriptionsAdmin() {
  const [plans, setPlans] = useState(seed);
  const [form, setForm] = useState(null);

  function toggleStatus(id) { setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, status: p.status === "active" ? "paused" : "active" } : p))); }
  function openCreate() { setForm({ name: "", frequency: "Weekly", price: "", products: "" }); }
  function save(e) {
    e.preventDefault();
    setPlans((prev) => [{ id: "sp" + Date.now(), name: form.name, frequency: form.frequency, price: Number(form.price) || 0, products: form.products.split(",").map((s) => s.trim()).filter(Boolean), status: "draft" }, ...prev]);
    setForm(null);
  }

  return (
    <>
      <PageHeader title="Subscriptions" action={<button className="a-btn" onClick={openCreate}>+ New Plan</button>} />
      <div className="admin-content">
        <div className="a-panel">
          <Table
            columns={["Plan", "Frequency", "Price", "Products", "Status", "Actions"]}
            rows={plans}
            renderRow={(p) => (
              <tr key={p.id}>
                <td>{p.name}</td><td>{p.frequency}</td><td>₹{p.price}</td><td>{p.products.join(", ")}</td>
                <td><Badge tone={p.status === "active" ? "good" : p.status === "draft" ? "warn" : "neutral"}>{p.status}</Badge></td>
                <td><button className="a-btn a-btn-outline a-btn-sm" onClick={() => toggleStatus(p.id)}>{p.status === "active" ? "Pause" : "Activate"}</button></td>
              </tr>
            )}
          />
        </div>
      </div>

      {form && (
        <Modal onClose={() => setForm(null)}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>New Subscription Plan</h3>
          <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label>Name<input required className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Frequency<select className="a-select" style={{ width: "100%", marginTop: 4 }} value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
              {["Weekly", "Monthly", "Recurring", "One-time"].map((f) => <option key={f} value={f}>{f}</option>)}
            </select></label>
            <label>Price (₹)<input type="number" className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
            <label style={{ gridColumn: "1 / -1" }}>Products (comma separated)<input className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} /></label>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
              <button className="a-btn" type="submit">Save Plan</button>
              <button className="a-btn a-btn-outline" type="button" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
