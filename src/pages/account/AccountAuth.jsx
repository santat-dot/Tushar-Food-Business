import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const empty = { name: "", email: "", phone: "", password: "", label: "Home", line: "", landmark: "", pincode: "", city: "", state: "Maharashtra" };

export default function AccountAuth({ initialMode }) {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(initialMode || (location.pathname === "/signup" ? "register" : "login"));
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const message = location.state?.message;
  const from = location.state?.from || (location.pathname === "/login" || location.pathname === "/signup" ? "/" : null) || "/account";

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (mode === "register") {
      if (!/^\d{10}$/.test(form.phone)) return setError("Enter a valid 10-digit mobile number.");
      if (!/^\d{6}$/.test(form.pincode)) return setError("Enter a valid 6-digit pincode.");
      if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    }
    setBusy(true);
    const res = mode === "login"
      ? await login(form.email, form.password)
      : await register({ name: form.name, email: form.email, phone: form.phone, password: form.password, address: { label: form.label, line: form.line, landmark: form.landmark, pincode: form.pincode, city: form.city, state: form.state } });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    navigate(from, { replace: true });
  }

  const signup = mode === "register";
  return (
    <main className="auth-page">
      <section className={`auth-panel ${signup ? "auth-panel-wide" : ""}`} aria-labelledby="auth-title">
        <div className="auth-intro">
          <span className="auth-mark">TF</span>
          <p className="eyebrow">{signup ? t("auth_one_time_setup") : t("auth_welcome")}</p>
          <h1 id="auth-title">{signup ? t("auth_create_title") : t("auth_login_title")}</h1>
          <p>{signup ? t("auth_create_description") : t("auth_login_description")}</p>
        </div>
        {message && <div className="auth-message">🔒 {message}</div>}
        <div className="auth-switch" role="tablist">
          <button type="button" onClick={() => { setMode("login"); setError(null); }} className={!signup ? "auth-tab is-active" : "auth-tab"} role="tab" aria-selected={!signup}>{t("nav_login")}</button>
          <button type="button" onClick={() => { setMode("register"); setError(null); }} className={signup ? "auth-tab is-active" : "auth-tab"} role="tab" aria-selected={signup}>{t("nav_signup")}</button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {signup && (
            <>
              <h4 className="auth-section">{t("auth_your_details")}</h4>
              <div className="auth-grid">
                <label className="auth-field"><span>{t("auth_full_name")}</span><input required placeholder={t("auth_full_name")} value={form.name} onChange={set("name")} /></label>
                <label className="auth-field"><span>{t("auth_mobile")}</span><input required inputMode="numeric" maxLength={10} placeholder={t("auth_mobile_placeholder")} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))} /></label>
              </div>
            </>
          )}
          <label className="auth-field"><span>{t("email")}</span><input required type="email" autoComplete="email" placeholder={t("auth_email_placeholder")} value={form.email} onChange={set("email")} /></label>
          <label className="auth-field"><span>{t("auth_password")}</span><span className="auth-password">
            <input required type={showPassword ? "text" : "password"} autoComplete={signup ? "new-password" : "current-password"} placeholder={signup ? t("auth_password_signup_placeholder") : t("auth_password_login_placeholder")} value={form.password} onChange={set("password")} />
            <button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? t("auth_password_hide") : t("auth_password_show")}</button></span></label>

          {signup && (
            <>
              <h4 className="auth-section">{t("auth_delivery_address")} <small>{t("auth_saved_future")}</small></h4>
              <label className="auth-field"><span>{t("auth_address_line")}</span><input required placeholder={t("auth_address_placeholder")} value={form.line} onChange={set("line")} /></label>
              <div className="auth-grid">
                <label className="auth-field"><span>{t("auth_landmark_optional")}</span><input placeholder={t("auth_near_placeholder")} value={form.landmark} onChange={set("landmark")} /></label>
                <label className="auth-field"><span>{t("pincode")}</span><input required inputMode="numeric" maxLength={6} placeholder={t("auth_pincode_placeholder")} value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "") }))} /></label>
                <label className="auth-field"><span>{t("city")}</span><input required placeholder={t("auth_city_placeholder")} value={form.city} onChange={set("city")} /></label>
                <label className="auth-field"><span>{t("state")}</span><input required placeholder={t("auth_state_placeholder")} value={form.state} onChange={set("state")} /></label>
              </div>
              <div className="auth-chips">
                {["Home", "Work", "Other"].map((l) => (
                  <button type="button" key={l} className={form.label === l ? "chip is-active" : "chip"} onClick={() => setForm((f) => ({ ...f, label: l }))}>{l}</button>
                ))}
              </div>
            </>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={busy} className="btn btn-primary auth-submit">{busy ? t("auth_please_wait") : signup ? t("auth_create_continue") : t("auth_login_submit")}</button>
          <p className="auth-note">{signup ? t("auth_already_registered") : t("auth_new_here")}{" "}
            <button type="button" className="auth-forgot" onClick={() => setMode(signup ? "login" : "register")}>{signup ? t("nav_login") : t("auth_create_link")}</button></p>
          <p className="auth-note">{t("auth_browse_open")} <Link to="/" style={{ textDecoration: "underline" }}>{t("auth_back_shop")}</Link>.</p>
        </form>
      </section>
    </main>
  );
}
