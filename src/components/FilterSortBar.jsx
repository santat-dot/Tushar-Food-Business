import { useLanguage } from "../context/LanguageContext";

export default function FilterSortBar({ f, resultCount }) {
  const { t } = useLanguage();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", padding: "16px 0", borderBottom: "1px solid var(--line)", marginBottom: 24 }}>
      <span style={{ fontSize: 13.5, color: "var(--ink-soft)", marginRight: "auto" }}>{t("filter_results", { count: resultCount })}</span>

      <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
        {t("price")} ≤ ₹{f.priceMax}
        <input type="range" min="50" max="1200" step="50" value={f.priceMax} onChange={(e) => f.setPriceMax(Number(e.target.value))} />
      </label>

      <select value={f.availability} onChange={(e) => f.setAvailability(e.target.value)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 13 }}>
        <option value="all">{t("availability")}</option>
        <option value="available">{t("filter_available")}</option>
        <option value="low-stock">{t("filter_low_stock")}</option>
        <option value="limited">{t("filter_limited")}</option>
        <option value="preorder">{t("filter_preorder")}</option>
        <option value="sold-out">{t("filter_sold_out")}</option>
      </select>

      <select value={f.dietary} onChange={(e) => f.setDietary(e.target.value)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 13 }}>
        <option value="all">{t("dietary")}</option>
        <option value="vegetarian">{t("filter_vegetarian")}</option>
        <option value="vegan">{t("filter_vegan")}</option>
      </select>

      <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
        <input type="checkbox" checked={f.onlyBestseller} onChange={(e) => f.setOnlyBestseller(e.target.checked)} /> {t("filter_bestseller")}
      </label>
      <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
        <input type="checkbox" checked={f.onlyNew} onChange={(e) => f.setOnlyNew(e.target.checked)} /> {t("filter_new")}
      </label>

      <select value={f.sort} onChange={(e) => f.setSort(e.target.value)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 13 }}>
        <option value="featured">{t("sort_featured")}</option>
        <option value="bestselling">{t("sort_bestselling")}</option>
        <option value="newest">{t("sort_newest")}</option>
        <option value="price-low">{t("sort_price_low")}</option>
        <option value="price-high">{t("sort_price_high")}</option>
        <option value="rating">{t("sort_rating")}</option>
      </select>

      <button onClick={f.reset} className="btn-ghost btn-sm">{t("clear_all")}</button>
    </div>
  );
}
