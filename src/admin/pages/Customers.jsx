import { useState } from "react";
import { adminCustomers } from "../data/adminData";
import { PageHeader, Table, Badge, statusTone } from "../components/AdminUI";

export default function Customers() {
  const [query, setQuery] = useState("");
  const filtered = adminCustomers.filter((c) => !query || c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <PageHeader title="Customers" />
      <div className="admin-content">
        <div className="a-toolbar">
          <input className="a-input" placeholder="Search customers…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="a-panel">
          <Table
            columns={["Name", "Phone", "Orders", "Last Order", "Type", "Loyalty Points"]}
            rows={filtered}
            renderRow={(c) => (
              <tr key={c.id}>
                <td>{c.name}</td><td>{c.phone}</td><td>{c.orders}</td><td>{c.lastOrder}</td>
                <td><Badge tone={statusTone(c.type === "lapsed" ? "cancelled" : c.type)}>{c.type}</Badge></td>
                <td>{c.loyaltyPoints}</td>
              </tr>
            )}
          />
        </div>
      </div>
    </>
  );
}
