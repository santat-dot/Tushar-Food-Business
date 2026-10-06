import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const CUISINES = ["Maharashtrian", "Gujarati", "South Indian", "North Indian", "Continental"];
const TASTES = ["Mild", "Medium", "Spicy"];
const STYLES = ["Light", "Comfort", "Indulgent"];
const BUDGETS = ["Budget", "Balanced", "Premium"];
const TIMINGS = ["Breakfast", "Lunch", "Dinner", "Snack Time"];
const translationKey = (value) => `food_dna_${value.toLowerCase().replace(/\s+/g, "_")}`;

export default function FoodDNA() {
  const { user, updateFoodDNA } = useAuth();
  const { t } = useLanguage();
  const [dna, setDna] = useState(user.foodDNA || { cuisine: [], taste: "Medium", style: "Comfort", budget: "Balanced", timing: [] });
  const [saved, setSaved] = useState(false);

  function toggleMulti(field, value) {
    setDna((prev) => ({ ...prev, [field]: prev[field].includes(value) ? prev[field].filter((v) => v !== value) : [...prev[field], value] }));
  }

  function save() { updateFoodDNA(dna); setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>{t("food_dna")}</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 24 }}>{t("food_dna_description")}</p>

      <FieldGroup label={t("food_dna_cuisine")}>
        {CUISINES.map((c) => <Chip key={c} active={dna.cuisine.includes(c)} onClick={() => toggleMulti("cuisine", c)}>{t(translationKey(c))}</Chip>)}
      </FieldGroup>
      <FieldGroup label={t("food_dna_taste")}>
        {TASTES.map((c) => <Chip key={c} active={dna.taste === c} onClick={() => setDna((p) => ({ ...p, taste: c }))}>{t(translationKey(c))}</Chip>)}
      </FieldGroup>
      <FieldGroup label={t("food_dna_meal_style")}>
        {STYLES.map((c) => <Chip key={c} active={dna.style === c} onClick={() => setDna((p) => ({ ...p, style: c }))}>{t(translationKey(c))}</Chip>)}
      </FieldGroup>
      <FieldGroup label={t("food_dna_budget_label")}>
        {BUDGETS.map((c) => <Chip key={c} active={dna.budget === c} onClick={() => setDna((p) => ({ ...p, budget: c }))}>{t(translationKey(c))}</Chip>)}
      </FieldGroup>
      <FieldGroup label={t("food_dna_meal_timing")}>
        {TIMINGS.map((c) => <Chip key={c} active={dna.timing.includes(c)} onClick={() => toggleMulti("timing", c)}>{t(translationKey(c))}</Chip>)}
      </FieldGroup>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={save} className="btn btn-primary">{t("food_dna_save")}</button>
        {saved && <span style={{ color: "var(--olive)", fontSize: 13.5, alignSelf: "center" }}>{t("common_saved")}</span>}
      </div>
    </div>
  );
}

function FieldGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h4 style={{ fontSize: 14, marginBottom: 10 }}>{label}</h4>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{children}</div>
    </div>
  );
}
function Chip({ active, onClick, children }) {
  return <button onClick={onClick} className={active ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}>{children}</button>;
}
