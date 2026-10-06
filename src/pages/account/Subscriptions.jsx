import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const PLANS = [
  { id: "weekly-thali", name: "Weekly Thali Plan", freq: "Weekly", price: 1600, desc: "5 thalis delivered every week, Mon–Fri." },
  { id: "monthly-snack", name: "Monthly Snack Box", freq: "Monthly", price: 900, desc: "A curated snack box delivered once a month." },
  { id: "meal-plan-family", name: "Family Meal Plan", freq: "Weekly", price: 2800, desc: "Dinner for a family of 4, delivered 6 days a week." },
];

export default function Subscriptions() {
  const { user, addSubscription, updateSubscription } = useAuth();
  const { t } = useLanguage();

  function subscribe(plan) {
    addSubscription({ id: plan.id + "-" + Date.now(), planId: plan.id, name: plan.name, freq: plan.freq, price: plan.price, status: "active", startedOn: new Date().toISOString().slice(0, 10) });
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>{t("subscriptions")}</h1>

      {user.subscriptions.length > 0 && (
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Your Plans</h3>
          {user.subscriptions.map((s) => (
            <div key={s.id} className="card" style={{ padding: 18, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{s.name}</strong>
                <span className={`badge ${s.status === "active" ? "badge-available" : "badge-soon"}`}>{s.status}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6 }}>{s.freq} · ₹{s.price} · Since {s.startedOn}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {s.status === "active" ? (
                  <button onClick={() => updateSubscription(s.id, { status: "paused" })} className="btn btn-outline btn-sm">Pause</button>
                ) : (
                  <button onClick={() => updateSubscription(s.id, { status: "active" })} className="btn btn-outline btn-sm">Resume</button>
                )}
                <button onClick={() => updateSubscription(s.id, { status: "cancelled" })} className="btn-ghost" style={{ fontSize: 13, color: "var(--brick)" }}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ fontSize: 16, marginBottom: 12 }}>Available Plans</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {PLANS.map((p) => (
          <div key={p.id} className="card" style={{ padding: 18 }}>
            <strong style={{ fontSize: 15 }}>{p.name}</strong>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "8px 0" }}>{p.desc}</p>
            <div style={{ fontSize: 16, fontFamily: "var(--serif)", marginBottom: 10 }}>₹{p.price} / {p.freq.toLowerCase()}</div>
            <button onClick={() => subscribe(p)} className="btn btn-primary btn-sm">Subscribe</button>
          </div>
        ))}
      </div>
    </div>
  );
}
