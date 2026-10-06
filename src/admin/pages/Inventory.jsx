import { useState } from "react";
import { products as seed } from "../../data/products";
import { notifyMeRequests as seedNotify } from "../data/adminData";
import { PageHeader, Table, Badge, statusTone } from "../components/AdminUI";

const ACTIONS = ["Add Stock", "Set Available", "Set Sold Out", "Enable Pre-Order", "Temporarily Disable", "Set Coming Soon"];
const ACTION_TO_AVAILABILITY = {
  "Set Available": "available", "Set Sold Out": "sold-out", "Enable Pre-Order": "pre-order",
  "Temporarily Disable": "unavailable", "Set Coming Soon": "coming-soon",
};

export default function Inventory() {
  const [products, setProducts] = useState(seed);
  const [notifyRequests, setNotifyRequests] = useState(seedNotify);
  const [tab, setTab] = useState("stock");

  function applyAction(id, action) {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      if (action === "Add Stock") return { ...p, stock: p.stock + 20, availability: "available" };
      const availability = ACTION_TO_AVAILABILITY[action];
      return availability ? { ...p, availability } : p;
    }));
  }
  function notifyCustomers(id) {
    setNotifyRequests((prev) => prev.map((n) => (n.id === id ? { ...n, status: "notified" } : n)));
  }

  const lowStock = products.filter((p) => p.availability === "low-stock" || (p.stock > 0 && p.stock <= 5));
  const soldOut = products.filter((p) => p.availability === "sold-out");

  return (
    <>
      <PageHeader title="Inventory" />
      <div className="admin-content">
        <div className="a-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", marginBottom: 16 }}>
          <MiniStat label="Current Stock (units)" value={products.reduce((s, p) => s + p.stock, 0)} />
          <MiniStat label="Low Stock" value={lowStock.length} />
          <MiniStat label="Sold Out" value={soldOut.length} />
          <MiniStat label="Notify-Me Requests" value={notifyRequests.reduce((s, n) => s + n.waiting, 0)} />
        </div>

        <div className="a-tabs">
          <button className={tab === "stock" ? "active" : ""} onClick={() => setTab("stock")}>Stock & Availability</button>
          <button className={tab === "notify" ? "active" : ""} onClick={() => setTab("notify")}>Notify-Me Requests</button>
        </div>

        {tab === "stock" ? (
          <div className="a-panel">
            <Table
              columns={["Product", "Stock", "Availability", "Actions"]}
              rows={products}
              renderRow={(p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.stock}</td>
                  <td><Badge tone={statusTone(p.availability)}>{p.availability}</Badge></td>
                  <td>
                    <select className="a-select" defaultValue="" onChange={(e) => { if (e.target.value) { applyAction(p.id, e.target.value); e.target.value = ""; } }}>
                      <option value="" disabled>Choose action…</option>
                      {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </td>
                </tr>
              )}
            />
          </div>
        ) : (
          <div className="a-panel">
            <Table
              columns={["Product", "Waiting Customers", "Channel", "Request Date", "Status", "Demand While Unavailable", "Actions"]}
              rows={notifyRequests}
              renderRow={(n) => (
                <tr key={n.id}>
                  <td>{n.product}</td>
                  <td>{n.waiting}</td>
                  <td>{n.channel}</td>
                  <td>{n.date}</td>
                  <td><Badge tone={statusTone(n.status)}>{n.status}</Badge></td>
                  <td>{n.waiting > 15 ? "High" : n.waiting > 5 ? "Moderate" : "Low"}</td>
                  <td>
                    {n.status === "pending"
                      ? <button className="a-btn a-btn-sm" onClick={() => notifyCustomers(n.id)}>Simulate Notify</button>
                      : <span style={{ fontSize: 12, color: "var(--a-text-soft)" }}>Notified</span>}
                  </td>
                </tr>
              )}
            />
          </div>
        )}
      </div>
    </>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="a-stat-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}
