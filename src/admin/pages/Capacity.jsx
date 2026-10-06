import { useState } from "react";
import { capacitySettings as seed } from "../data/adminData";
import { PageHeader, Table, Progress } from "../components/AdminUI";

export default function Capacity() {
  const [settings, setSettings] = useState(seed);

  return (
    <>
      <PageHeader title="Kitchen Capacity" />
      <div className="admin-content">
        <div className="a-panel" style={{ marginBottom: 16 }}>
          <h3>Daily Capacity</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <input className="a-input" type="number" style={{ width: 100 }} value={settings.dailyCapacity}
              onChange={(e) => setSettings({ ...settings, dailyCapacity: Number(e.target.value) })} />
            <span style={{ fontSize: 13, color: "var(--a-text-soft)" }}>orders / day</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 13.5, marginTop: 10 }}>
            <div><strong>Preparation Cutoff:</strong> {settings.prepCutoff}</div>
            <div><strong>Pre-order Window:</strong> {settings.preorderWindow}</div>
          </div>
          <div style={{ marginTop: 10, fontSize: 13.5 }}>
            <strong>Closed Dates:</strong> {settings.closedDates.join(", ")}
          </div>
        </div>

        <div className="a-panel" style={{ marginBottom: 16 }}>
          <h3>Product Capacity</h3>
          <Table
            columns={["Product", "Capacity", "Booked", "Remaining", "Load"]}
            rows={settings.productCapacity}
            renderRow={(p) => (
              <tr key={p.product}>
                <td>{p.product}</td><td>{p.capacity}</td><td>{p.booked}</td><td>{p.capacity - p.booked}</td>
                <td style={{ width: 140 }}><Progress value={p.booked} max={p.capacity} /></td>
              </tr>
            )}
          />
        </div>

        <div className="a-panel">
          <h3>Delivery Slot Capacity</h3>
          <Table
            columns={["Slot", "Capacity", "Booked", "Remaining", "Load"]}
            rows={settings.slotCapacity}
            renderRow={(s) => (
              <tr key={s.slot}>
                <td>{s.slot}</td><td>{s.capacity}</td><td>{s.booked}</td><td>{s.capacity - s.booked}</td>
                <td style={{ width: 140 }}><Progress value={s.booked} max={s.capacity} /></td>
              </tr>
            )}
          />
        </div>
      </div>
    </>
  );
}
