import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { localizeAddressLabel } from "../../i18n/translations";

const blank = { label: "Home", line: "", landmark: "", pincode: "", city: "", state: "Maharashtra", phone: "" };

export default function Addresses() {
  const { user, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAuth();
  const { t, lang } = useLanguage();
  const [form, setForm] = useState(null); // null = closed
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function save(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(form.pincode)) return alert(t("delivery_invalid_pincode"));
    const data = { ...form, name: user.name, phone: form.phone || user.phone };
    if (form.id) updateAddress(form.id, data); else addAddress(data);
    setForm(null);
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>{t("addresses")}</h1>
      <p style={{ color: "var(--ink-soft)", fontSize: 14, marginBottom: 20 }}>{t("addresses_instructions")}</p>
      {user.addresses.map((a) => (
        <div key={a.id} className={`card addr-card ${a.isDefault ? "is-selected" : ""}`} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{localizeAddressLabel(a.label, lang)}</strong>
            {a.isDefault && <span className="badge badge-available">{t("address_default")}</span>}
          </div>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 8 }}>{a.line}{a.landmark ? `, ${a.landmark}` : ""}, {a.city}, {a.state} - {a.pincode}</p>
          <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 13 }}>
            <button className="btn-ghost" onClick={() => setForm(a)}>{t("address_edit")}</button>
            {!a.isDefault && <button className="btn-ghost" onClick={() => setDefaultAddress(a.id)}>{t("common_make_default")}</button>}
            {user.addresses.length > 1 && <button className="btn-ghost" style={{ color: "var(--brick)" }} onClick={() => removeAddress(a.id)}>{t("remove")}</button>}
          </div>
        </div>
      ))}
      {!form && <button className="btn btn-outline btn-sm" onClick={() => setForm(blank)}>+ {t("common_add_address")}</button>}
      {form && (
        <form onSubmit={save} className="card" style={{ padding: 20, display: "grid", gap: 12 }}>
          <h4>{form.id ? t("address_edit") : t("address_new")}</h4>
          <input className="input" required placeholder={t("address_house_placeholder")} value={form.line} onChange={set("line")} />
          <input className="input" placeholder={t("auth_landmark_optional")} value={form.landmark} onChange={set("landmark")} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input className="input" required placeholder={t("pincode")} maxLength={6} value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "") }))} />
            <input className="input" required placeholder={t("city")} value={form.city} onChange={set("city")} />
            <input className="input" required placeholder={t("state")} value={form.state} onChange={set("state")} />
            <input className="input" placeholder={t("address_phone_optional")} value={form.phone} onChange={set("phone")} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>{["Home", "Work", "Other"].map((l) => <button type="button" key={l} className={form.label === l ? "chip is-active" : "chip"} onClick={() => setForm((f) => ({ ...f, label: l }))}>{t(`common_${l.toLowerCase()}`)}</button>)}</div>
          <div style={{ display: "flex", gap: 10 }}><button className="btn btn-primary btn-sm">{t("common_save")}</button><button type="button" className="btn btn-outline btn-sm" onClick={() => setForm(null)}>{t("common_cancel")}</button></div>
        </form>
      )}
    </div>
  );
}
