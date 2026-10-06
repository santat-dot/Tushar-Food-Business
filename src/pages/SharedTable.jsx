import { useState } from "react";
import { products } from "../data/products";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

const DEMO_PARTICIPANTS = [
  { id: "u1", name: "You (Owner)", items: [] },
  { id: "u2", name: "Anjali", items: [{ productId: "p6", name: "Veg Thali Combo", price: 260, qty: 1 }] },
  { id: "u3", name: "Rahul", items: [{ productId: "p12", name: "Shrikhand", price: 190, qty: 2 }] },
];

export default function SharedTable() {
  const { t } = useLanguage();
  const [participants, setParticipants] = useState(DEMO_PARTICIPANTS);
  const [selectedProduct, setSelectedProduct] = useState(products[0].id);

  function addToMyCart() {
    const product = products.find((p) => p.id === selectedProduct);
    setParticipants((prev) => prev.map((p) => p.id === "u1" ? { ...p, items: [...p.items, { productId: product.id, name: product.name, price: product.price, qty: 1 }] } : p));
  }

  const runningTotal = participants.reduce((sum, p) => sum + p.items.reduce((s, i) => s + i.price * i.qty, 0), 0);

  return (
    <div className="container section" style={{ maxWidth: 760 }}>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>Shared Table — Family Dinner</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 30 }}>Everyone adds their own items to one shared order. The owner checks out for the group.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid var(--line)" }}>
          {products.filter((p) => p.availability === "available").map((p) => <option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>)}
        </select>
        <button onClick={addToMyCart} className="btn btn-primary btn-sm">Add My Item</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
        {participants.map((p) => (
          <div key={p.id} className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <strong style={{ fontSize: 15 }}>{p.name}</strong>
              <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{p.items.reduce((s, i) => s + i.price * i.qty, 0)} ₹</span>
            </div>
            {p.items.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>No items added yet.</p>
            ) : p.items.map((i, idx) => (
              <div key={idx} style={{ fontSize: 13.5, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>{i.name} × {i.qty}</span><span>₹{i.price * i.qty}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>Running Total (all participants)</div>
          <div style={{ fontSize: 22, fontFamily: "var(--serif)" }}>₹{runningTotal}</div>
        </div>
        <Link to="/checkout" className="btn btn-primary">Owner: Checkout for Group</Link>
      </div>
    </div>
  );
}
