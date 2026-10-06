import { useState } from "react";
import { reportTypes } from "../data/adminData";
import { PageHeader, Table, Badge } from "../components/AdminUI";

export default function Reports() {
  const [generated, setGenerated] = useState([]);

  function generate(type) {
    const entry = { id: Date.now(), type, date: new Date().toISOString().slice(0, 10), status: "ready" };
    setGenerated((prev) => [entry, ...prev]);
  }

  return (
    <>
      <PageHeader title="Reports" />
      <div className="admin-content">
        <div className="a-panel" style={{ marginBottom: 20 }}>
          <h3>Generate a Report</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {reportTypes.map((t) => (
              <button key={t} className="a-btn a-btn-outline" onClick={() => generate(t)}>{t} Report</button>
            ))}
          </div>
        </div>

        <div className="a-panel">
          <h3>Generated Reports</h3>
          <Table
            columns={["Report", "Generated On", "Status", "Actions"]}
            rows={generated}
            empty="No reports generated yet — pick a report type above."
            renderRow={(r) => (
              <tr key={r.id}>
                <td>{r.type}</td><td>{r.date}</td><td><Badge tone="good">{r.status}</Badge></td>
                <td><button className="a-btn a-btn-sm" onClick={() => alert(`Demo download: ${r.type}_report_${r.date}.csv`)}>Download (demo)</button></td>
              </tr>
            )}
          />
        </div>
      </div>
    </>
  );
}
