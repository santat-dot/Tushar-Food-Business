export function PageHeader({ title, action }) {
  return (
    <div className="admin-topbar">
      <h1>{title}</h1>
      {action}
    </div>
  );
}

export function StatCard({ label, value, sub }) {
  return (
    <div className="a-stat-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {sub ? <div className="sub">{sub}</div> : null}
    </div>
  );
}

const badgeClass = (tone) => `a-badge a-badge-${tone}`;
export function Badge({ tone = "neutral", children }) {
  return <span className={badgeClass(tone)}>{children}</span>;
}

export function statusTone(status) {
  const map = {
    delivered: "good", approved: "good", active: "good", available: "good", published: "good", answered: "good", dispatched: "good",
    pending: "warn", preparing: "warn", "low-stock": "warn", draft: "warn", voting: "warn", "in-kitchen": "warn", packed: "warn", requested: "warn", testing: "warn",
    cancelled: "bad", "sold-out": "bad", inactive: "bad", rejected: "bad",
    "out-for-delivery": "info", "coming-soon": "info", "pre-order": "info", ready: "info", confirmed: "info", placed: "info",
  };
  return map[status] || "neutral";
}

export function Table({ columns, rows, renderRow, empty = "No records yet." }) {
  if (!rows || rows.length === 0) {
    return <div className="empty-state"><h3>{empty}</h3></div>;
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="a-table">
        <thead>
          <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>{rows.map(renderRow)}</tbody>
      </table>
    </div>
  );
}

export function Modal({ onClose, children, width = 720 }) {
  return (
    <div className="a-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="a-modal" style={{ maxWidth: width }}>{children}</div>
    </div>
  );
}

export function Progress({ value, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="a-progress-track">
      <div className="a-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
