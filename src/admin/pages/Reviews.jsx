import { useState } from "react";
import { adminReviews as seed } from "../data/adminData";
import { PageHeader, Table, Badge, statusTone } from "../components/AdminUI";

export default function Reviews() {
  const [reviews, setReviews] = useState(seed);
  function setStatus(id, status) { setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r))); }

  return (
    <>
      <PageHeader title="Reviews" />
      <div className="admin-content">
        <div className="a-panel">
          <Table
            columns={["Product", "Customer", "Rating", "Review", "Status", "Actions"]}
            rows={reviews}
            renderRow={(r) => (
              <tr key={r.id}>
                <td>{r.product}</td><td>{r.customer}</td><td>{"★".repeat(r.rating)}</td>
                <td style={{ maxWidth: 260 }}>{r.text}</td>
                <td><Badge tone={statusTone(r.status)}>{r.status}</Badge></td>
                <td style={{ display: "flex", gap: 6 }}>
                  {r.status !== "approved" && <button className="a-btn a-btn-sm" onClick={() => setStatus(r.id, "approved")}>Approve</button>}
                  {r.status !== "rejected" && <button className="a-btn a-btn-outline a-btn-sm" onClick={() => setStatus(r.id, "rejected")}>Reject</button>}
                </td>
              </tr>
            )}
          />
        </div>
      </div>
    </>
  );
}
