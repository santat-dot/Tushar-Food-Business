import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

// One-click repeat for bulk buyers: add everything from a past order again at today's prices.
export default function ReorderButtons({ items, compact }) {
  const { addOrderItems, showToast } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  function run(goTo) {
    const res = addOrderItems(items, { replace: goTo === "/checkout" });
    if (res.added === 0) { showToast(t("reorder_none_available")); return; }
    showToast(res.skipped.length
      ? t("reorder_items_skipped", { count: res.added, items: res.skipped.join(", ") })
      : t("reorder_items_added", { count: res.added }));
    if (goTo) navigate(goTo);
  }
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button className="btn btn-primary btn-sm" onClick={() => run("/checkout")} title={t("reorder_checkout_title")}>⟳ {t("reorder_now")}</button>
      {!compact && <button className="btn btn-outline btn-sm" onClick={() => run("/cart")} title={t("reorder_edit_title")}>{t("reorder_edit")}</button>}
    </div>
  );
}
