import { useState } from "react";
import { batches as seed, batchTimelineSteps } from "../data/adminData";
import { products } from "../../data/products";
import { PageHeader, Table, Badge, statusTone, Modal } from "../components/AdminUI";
import FakeQr from "../components/FakeQr";

export default function Batches() {
  const [batches, setBatches] = useState(seed);
  const [form, setForm] = useState(null);
  const [qrBatch, setQrBatch] = useState(null);

  function openCreate() {
    setForm({ id: `B-2026-${Math.floor(1000 + Math.random() * 8999)}`, product: products[0]?.name || "", prepDate: "", packingDate: "", bestBefore: "", quantity: "", status: "in-kitchen" });
  }
  function save(e) {
    e.preventDefault();
    setBatches((prev) => [{ ...form, quantity: Number(form.quantity) || 0 }, ...prev]);
    setForm(null);
  }
  function archive(id) { setBatches((prev) => prev.map((b) => (b.id === id ? { ...b, status: "archived" } : b))); }

  return (
    <>
      <PageHeader title="Batches" action={<button className="a-btn" onClick={openCreate}>+ New Batch</button>} />
      <div className="admin-content">
        <div className="a-panel">
          <Table
            columns={["Batch ID", "Product", "Packing Date", "Best Before", "Quantity", "Status", "Actions"]}
            rows={batches}
            renderRow={(b) => (
              <tr key={b.id}>
                <td>{b.id}</td><td>{b.product}</td><td>{b.packingDate}</td><td>{b.bestBefore}</td><td>{b.quantity}</td>
                <td><Badge tone={statusTone(b.status)}>{b.status}</Badge></td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="a-btn a-btn-outline a-btn-sm" onClick={() => setQrBatch(b)}>Generate QR</button>
                  <button className="a-btn a-btn-outline a-btn-sm" onClick={() => archive(b.id)}>Archive</button>
                </td>
              </tr>
            )}
          />
        </div>
      </div>

      {form && (
        <Modal onClose={() => setForm(null)}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>New Batch</h3>
          <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label>Product<select className="a-select" style={{ width: "100%", marginTop: 4 }} value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
              {products.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select></label>
            <label>Batch ID<input className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} /></label>
            <label>Preparation Date<input type="date" className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.prepDate} onChange={(e) => setForm({ ...form, prepDate: e.target.value })} /></label>
            <label>Packing Date<input type="date" className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.packingDate} onChange={(e) => setForm({ ...form, packingDate: e.target.value })} /></label>
            <label>Best Before<input type="date" className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.bestBefore} onChange={(e) => setForm({ ...form, bestBefore: e.target.value })} /></label>
            <label>Quantity<input type="number" className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
              <button className="a-btn" type="submit">Create Batch</button>
              <button className="a-btn a-btn-outline" type="button" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {qrBatch && (
        <Modal onClose={() => setQrBatch(null)} width={520}>
          <h3 style={{ fontSize: 18, marginBottom: 6 }}>Batch QR — {qrBatch.id}</h3>
          <p style={{ fontSize: 12.5, color: "var(--a-text-soft)", marginBottom: 14 }}>Demo QR representing the customer journey below. Not a scannable code.</p>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
            <FakeQr value={qrBatch.id} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 13.5, marginBottom: 6 }}><strong>{qrBatch.product}</strong></p>
              <p style={{ fontSize: 12.5, color: "var(--a-text-soft)" }}>Best before: {qrBatch.bestBefore}</p>
              <p style={{ fontSize: 12.5, color: "var(--a-text-soft)", marginBottom: 10 }}>Quantity: {qrBatch.quantity}</p>
              <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Customer journey on scan:</p>
              <p style={{ fontSize: 12.5, color: "var(--a-text-soft)" }}>Package → Product → Batch → Food Story → Making Video → Storage → Reorder</p>
            </div>
          </div>
          <h4 style={{ fontSize: 14, margin: "18px 0 8px" }}>Batch Timeline</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {batchTimelineSteps.map((s) => <Badge key={s} tone="info">{s}</Badge>)}
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="a-btn a-btn-outline" onClick={() => setQrBatch(null)}>Close</button>
          </div>
        </Modal>
      )}
    </>
  );
}
