import { useState, useMemo } from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useCatalog } from "../context/CatalogContext";

const STEPS = [
  { key: "ready-to-cook", label: "Choose a Mix" },
  { key: "chakli-snacks", label: "Add a Snack" },
  { key: "laddoos-sweets", label: "Add a Sweet" },
];

export default function BuildYourMeal() {
  const { t } = useLanguage();
  const { revision } = useCatalog();
  const { addItem, showToast } = useCart();
  const [picks, setPicks] = useState({});

  const options = useMemo(() => STEPS.map((s) => ({ ...s, items: products.filter((p) => p.categories.includes(s.key) && p.availability !== "sold-out").slice(0, 3) })), [revision]);
  const total = Object.values(picks).reduce((sum, p) => sum + (p ? p.price : 0), 0);

  function addAllToCart() {
    Object.values(picks).forEach((p) => p && addItem(p, 1));
    if (Object.values(picks).some(Boolean)) showToast("Meal added to cart");
  }

  return (
    <div className="container section" style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>Build Your Meal</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 30 }}>Pick one item from each step to put together your own meal.</p>
      {options.map((step) => (
        <div key={step.key} style={{ marginBottom: 30 }}>
          <h4 style={{ fontSize: 16, marginBottom: 14 }}>{step.label}</h4>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {step.items.map((p) => (
              <button
                key={p.id}
                onClick={() => setPicks((prev) => ({ ...prev, [step.key]: prev[step.key]?.id === p.id ? null : p }))}
                className="card"
                style={{ width: 150, padding: 0, border: picks[step.key]?.id === p.id ? "2px solid var(--mustard-deep)" : "1px solid var(--line)", textAlign: "left" }}
              >
                <img src={p.images[0]} alt={p.name} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }} />
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>₹{p.price}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>Meal Total</div>
          <div style={{ fontSize: 22, fontFamily: "var(--serif)" }}>₹{total}</div>
        </div>
        <button onClick={addAllToCart} disabled={total === 0} className="btn btn-primary">{t("add_to_cart")}</button>
      </div>
    </div>
  );
}
