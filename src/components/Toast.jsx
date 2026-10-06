import { useCart } from "../context/CartContext";

export default function Toast() {
  const { toast } = useCart();
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 999,
      background: "var(--ink)", color: "var(--cream)", padding: "12px 22px", borderRadius: 999,
      fontSize: 14, fontWeight: 500, boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    }}>
      {toast}
    </div>
  );
}
