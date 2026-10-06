import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrdersContext";
import { useLanguage } from "../../context/LanguageContext";

export default function FoodMemory() {
  const { user } = useAuth();
  const { orders: demoOrders } = useOrders();
  const { t } = useLanguage();

  const counts = {};
  demoOrders.forEach((o) => o.items.forEach((i) => { counts[i.name] = (counts[i.name] || 0) + i.qty; }));
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  const timeline = [
    { label: t("food_memory_first_order"), value: demoOrders[demoOrders.length - 1]?.id || t("food_memory_no_orders"), date: demoOrders[demoOrders.length - 1]?.date },
    { label: t("food_memory_most_ordered"), value: top },
    { label: t("food_memory_recent_order"), value: demoOrders[0]?.id || "—", date: demoOrders[0]?.date },
    { label: t("food_memory_loyalty_progress"), value: t("food_memory_points", { count: user.loyalty.points, tier: user.loyalty.tier }) },
    { label: t("food_memory_products_discovered"), value: t("food_memory_unique_items", { count: Object.keys(counts).length }) },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>{t("food_memory")}</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 28 }}>{t("food_memory_title")}</p>
      <div style={{ position: "relative", paddingLeft: 24 }}>
        <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 2, background: "var(--line)" }} />
        {timeline.map((item, i) => (
          <div key={i} style={{ position: "relative", marginBottom: 26 }}>
            <div style={{ position: "absolute", left: -24, top: 2, width: 12, height: 12, borderRadius: "50%", background: "var(--mustard-deep)" }} />
            <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{item.label}{item.date ? ` · ${item.date}` : ""}</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
