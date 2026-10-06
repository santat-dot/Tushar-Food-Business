import { useState } from "react";
import { mediaLibrary, contentCalendar } from "../data/adminData";
import { PageHeader, Table, Badge } from "../components/AdminUI";

export default function ContentStudio() {
  const [tab, setTab] = useState("library");
  const [query, setQuery] = useState("");
  const filtered = mediaLibrary.filter((m) => !query || m.title.toLowerCase().includes(query.toLowerCase()) || m.tags.some((t) => t.includes(query.toLowerCase())));

  return (
    <>
      <PageHeader title="Content Studio" />
      <div className="admin-content">
        <div className="a-tabs">
          <button className={tab === "library" ? "active" : ""} onClick={() => setTab("library")}>Media Library</button>
          <button className={tab === "calendar" ? "active" : ""} onClick={() => setTab("calendar")}>Content Calendar</button>
        </div>

        {tab === "library" ? (
          <div className="a-panel">
            <div className="a-toolbar"><input className="a-input" placeholder="Search by title or tag…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
            <Table
              columns={["Title", "Type", "Tags", "Connected Product", "Actions"]}
              rows={filtered}
              renderRow={(m) => (
                <tr key={m.id}>
                  <td>{m.title}</td>
                  <td><Badge tone="info">{m.type}</Badge></td>
                  <td>{m.tags.join(", ")}</td>
                  <td>{m.product || "—"}</td>
                  <td><button className="a-btn a-btn-outline a-btn-sm">Archive</button></td>
                </tr>
              )}
            />
          </div>
        ) : (
          <div className="a-panel">
            <Table
              columns={["Date", "Type", "Title"]}
              rows={[...contentCalendar].sort((a, b) => a.date.localeCompare(b.date))}
              renderRow={(c) => <tr key={c.id}><td>{c.date}</td><td><Badge tone="info">{c.type}</Badge></td><td>{c.title}</td></tr>}
            />
          </div>
        )}
      </div>
    </>
  );
}
