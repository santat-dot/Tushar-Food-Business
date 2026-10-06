export default function StarRating({ value, count, size = 14 }) {
  const full = Math.round(value);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--ink-soft)" }}>
      <span style={{ color: "var(--mustard-deep)", fontSize: size }} aria-hidden="true">
        {"★".repeat(full)}{"☆".repeat(5 - full)}
      </span>
      <span>{value.toFixed(1)}{count ? ` (${count})` : ""}</span>
    </span>
  );
}
