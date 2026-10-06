import { useState } from "react";
import { festivals as seed } from "../data/adminData";
import { PageHeader, Table, Badge } from "../components/AdminUI";

export default function FestivalMode() {
  const [festivals, setFestivals] = useState(seed);
  function toggle(id) {
    setFestivals((prev) => prev.map((f) => (f.id === id ? { ...f, active: !f.active } : { ...f, active: false })));
  }

  return (
    <>
      <PageHeader title="Festival Mode" />
      <div className="admin-content">
        <p style={{ fontSize: 13.5, color: "var(--a-text-soft)", marginBottom: 14 }}>Activating a festival applies its hero, banner, collection, and offer to the storefront. Only one festival can be active at a time in this prototype.</p>
        <div className="a-panel">
          <Table
            columns={["Festival", "Start", "End", "Collection", "Offer", "Status", "Actions"]}
            rows={festivals}
            renderRow={(f) => (
              <tr key={f.id}>
                <td>{f.name}</td><td>{f.start}</td><td>{f.end}</td>
                <td>{f.collection || "—"}</td><td>{f.offer || "—"}</td>
                <td><Badge tone={f.active ? "good" : "neutral"}>{f.active ? "active" : "inactive"}</Badge></td>
                <td><button className="a-btn a-btn-outline a-btn-sm" onClick={() => toggle(f.id)}>{f.active ? "Deactivate" : "Activate"}</button></td>
              </tr>
            )}
          />
        </div>
      </div>
    </>
  );
}
