import { useState, useMemo } from "react";
import { demoOrders, orderStatuses } from "../../data/orders";
import { PageHeader, Table, Badge, statusTone, Modal } from "../components/AdminUI";

const NEXT_STATUS = {
  placed: "confirmed", confirmed: "preparing", preparing: "ready", ready: "out-for-delivery", "out-for-delivery": "delivered",
};
const ACTION_LABEL = {
  placed: "Confirm", confirmed: "Start Preparing", preparing: "Mark Ready", ready: "Dispatch", "out-for-delivery": "Mark Delivered",
};

export default function Orders() {
  const [orders, setOrders] = useState(() => demoOrders.map((o) => ({ ...o, notes: "" })));
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesQuery = !query || o.id.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  function advance(order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)));
    setSelected((s) => (s && s.id === order.id ? { ...s, status: next } : s));
  }
  function cancel(order) {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "cancelled" } : o)));
    setSelected((s) => (s && s.id === order.id ? { ...s, status: "cancelled" } : s));
  }

  return (
    <>
      <PageHeader title="Orders" />
      <div className="admin-content">
        <div className="a-toolbar">
          <input className="a-input" placeholder="Search by order ID…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="a-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {orderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span style={{ fontSize: 13, color: "var(--a-text-soft)" }}>{filtered.length} orders</span>
        </div>

        <div className="a-panel">
          <Table
            columns={["Order ID", "Date", "Items", "Total", "Payment", "Status", "Actions"]}
            rows={filtered}
            renderRow={(o) => (
              <tr key={o.id}>
                <td><button className="a-btn-outline a-btn a-btn-sm" onClick={() => setSelected(o)}>{o.id}</button></td>
                <td>{o.date}</td>
                <td>{o.items.length} item(s)</td>
                <td>₹{o.total}</td>
                <td>{o.payment}</td>
                <td><Badge tone={statusTone(o.status)}>{o.status}</Badge></td>
                <td style={{ display: "flex", gap: 6 }}>
                  {NEXT_STATUS[o.status] && <button className="a-btn a-btn-sm" onClick={() => advance(o)}>{ACTION_LABEL[o.status]}</button>}
                  {!["delivered", "cancelled"].includes(o.status) && <button className="a-btn a-btn-outline a-btn-sm" onClick={() => cancel(o)}>Cancel</button>}
                </td>
              </tr>
            )}
          />
        </div>
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ fontSize: 18 }}>Order {selected.id}</h3>
            <Badge tone={statusTone(selected.status)}>{selected.status}</Badge>
          </div>
          <p style={{ fontSize: 13.5, color: "var(--a-text-soft)", marginBottom: 4 }}><strong>Customer address:</strong> {selected.address}</p>
          <p style={{ fontSize: 13.5, color: "var(--a-text-soft)", marginBottom: 4 }}><strong>Delivery slot:</strong> {selected.slot}</p>
          <p style={{ fontSize: 13.5, color: "var(--a-text-soft)", marginBottom: 12 }}><strong>Payment:</strong> {selected.payment}</p>

          <h4 style={{ fontSize: 14, marginBottom: 8 }}>Items</h4>
          <Table
            columns={["Item", "Qty", "Price"]}
            rows={selected.items}
            renderRow={(i, idx) => <tr key={idx}><td>{i.name}</td><td>{i.qty}</td><td>₹{i.price}</td></tr>}
          />
          <div style={{ textAlign: "right", fontWeight: 700, marginTop: 8 }}>Total: ₹{selected.total}</div>

          <h4 style={{ fontSize: 14, margin: "16px 0 8px" }}>Timeline</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["placed", "confirmed", "preparing", "ready", "out-for-delivery", "delivered"].map((s, i, arr) => {
              const reached = arr.indexOf(selected.status) >= i || selected.status === "delivered";
              return <Badge key={s} tone={reached ? "good" : "neutral"}>{s}</Badge>;
            })}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            {NEXT_STATUS[selected.status] && <button className="a-btn" onClick={() => advance(selected)}>{ACTION_LABEL[selected.status]}</button>}
            {!["delivered", "cancelled"].includes(selected.status) && <button className="a-btn a-btn-outline" onClick={() => cancel(selected)}>Cancel Order</button>}
            <button className="a-btn a-btn-outline" onClick={() => setSelected(null)}>Close</button>
          </div>
        </Modal>
      )}
    </>
  );
}
