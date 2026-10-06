// A stylized, deterministic placeholder pattern representing a QR code for prototype purposes.
// Not a scannable QR code — purely illustrative of the "batch → QR" concept.
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) >>> 0; }
  return h;
}

export default function FakeQr({ value, size = 12 }) {
  const seed = hashString(value);
  const cells = [];
  for (let i = 0; i < size * size; i++) {
    // simple deterministic pseudo-random pattern based on seed + index
    const bit = ((seed >> (i % 24)) ^ (i * 2654435761)) & 1;
    cells.push(bit);
  }
  // force finder-pattern-like corners for QR aesthetic
  const idx = (r, c) => r * size + c;
  [[0, 0], [0, size - 3], [size - 3, 0]].forEach(([r, c]) => {
    for (let dr = 0; dr < 3; dr++) for (let dc = 0; dc < 3; dc++) cells[idx(r + dr, c + dc)] = 1;
  });
  return (
    <div className="qr-box" style={{ gridTemplateColumns: `repeat(${size}, 6px)`, gridTemplateRows: `repeat(${size}, 6px)` }} aria-label={`Demo QR for ${value}`}>
      {cells.map((bit, i) => <span key={i} style={{ background: bit ? "#14120F" : "transparent" }} />)}
    </div>
  );
}
