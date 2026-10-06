import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { demoOrders, trackingSteps } from "../data/orders";
import { fetchOrderStatus } from "../api/catalogApi";

export default function TrackOrder() {
  const { t, formatDate } = useLanguage();
  const [params] = useSearchParams();
  const [input, setInput] = useState(params.get("id") || "");
  const [searchedId, setSearchedId] = useState(params.get("id") || "");
  const [serverStatus, setServerStatus] = useState(null);

  const stored = JSON.parse(localStorage.getItem("tfb_new_orders") || "[]");
  const allOrders = [...stored, ...demoOrders];
  const order = useMemo(() => allOrders.find((o) => o.id.toLowerCase() === searchedId.toLowerCase()), [searchedId]);
  useEffect(() => {
    if (!searchedId) {
      setServerStatus(null);
      return undefined;
    }
    let active = true;
    const refreshStatus = async () => {
      try {
        const remoteOrder = await fetchOrderStatus(searchedId);
        if (active) setServerStatus(remoteOrder.status);
      } catch {
        if (active) setServerStatus(null);
      }
    };
    refreshStatus();
    const interval = window.setInterval(refreshStatus, 25000);
    window.addEventListener("focus", refreshStatus);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshStatus);
    };
  }, [searchedId]);

  const status = serverStatus || order?.status;
  const currentIndex = status ? trackingSteps.indexOf(status) : -1;

  return (
    <div className="container section" style={{ maxWidth: 680 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>{t("track_order")}</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("track_order_placeholder")} style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "1px solid var(--line)" }} />
        <button onClick={() => setSearchedId(input)} className="btn btn-primary">{t("track_order")}</button>
      </div>

      {searchedId && !order && !serverStatus && (
        <div className="empty-state"><h3>{t("track_no_order")}</h3><p>{t("track_check_id")}</p></div>
      )}

      {status === "cancelled" && (
        <div className="card" style={{ padding: 22, background: "#F4DEDA" }}>
          <h3 style={{ fontSize: 17, color: "var(--brick)" }}>{t("track_order_cancelled")}</h3>
        </div>
      )}

      {(order || serverStatus) && status !== "cancelled" && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
            <strong>#{order?.id || searchedId}</strong><span style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>{order?.date && formatDate(order.date, { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
          <div style={{ position: "relative" }}>
            {trackingSteps.map((step, i) => (
              <div key={step} style={{ display: "flex", gap: 16, marginBottom: i === trackingSteps.length - 1 ? 0 : 28, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: i <= currentIndex ? "var(--olive)" : "var(--line)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>
                    {i <= currentIndex ? "✓" : ""}
                  </div>
                  {i < trackingSteps.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 24, background: i < currentIndex ? "var(--olive)" : "var(--line)" }} />}
                </div>
                <div style={{ paddingTop: 2 }}>
                  <div style={{ fontSize: 14.5, fontWeight: i === currentIndex ? 700 : 500 }}>{t(`order_status_${step.replace(/-/g, "_")}`)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
