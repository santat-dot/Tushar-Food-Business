import { analyticsSummary as a, salesTrend, eventLog } from "../data/adminData";
import { PageHeader, StatCard, Table, Badge } from "../components/AdminUI";

export default function Analytics() {
  const maxOrders = Math.max(...salesTrend.map((s) => s.orders));
  return (
    <>
      <PageHeader title="Analytics" />
      <div className="admin-content">
        <div className="a-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", marginBottom: 20 }}>
          <StatCard label="Revenue (30d)" value={`₹${a.revenue.toLocaleString("en-IN")}`} />
          <StatCard label="Orders (30d)" value={a.orders} />
          <StatCard label="Avg Order Value" value={`₹${a.aov}`} />
          <StatCard label="Repeat Purchase Rate" value={a.repeatPurchaseRate} />
          <StatCard label="Coupon Usage" value={a.couponUsage} />
          <StatCard label="Product Views" value={a.productViews.toLocaleString()} />
          <StatCard label="Video Views" value={a.videoViews.toLocaleString()} />
          <StatCard label="Video Product Clicks" value={a.videoProductClicks} />
          <StatCard label="Video → Order Conversion" value={a.videoToOrderConversion} />
          <StatCard label="Customer Growth" value={a.customerGrowth} />
          <StatCard label="Sold-out Requests" value={a.demandUnavailable} />
          <StatCard label="Notify-Me Requests" value={a.notifyMeRequests} />
          <StatCard label="Pre-orders" value={a.preorders} />
          <StatCard label="Subscriptions" value={a.subscriptions} />
          <StatCard label="Referral Performance" value={a.referralPerformance} />
        </div>

        <div className="a-panel" style={{ marginBottom: 20 }}>
          <h3>Orders — Last 7 Days</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
            {salesTrend.map((s) => (
              <div key={s.day} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ height: 110, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                  <div style={{ width: "60%", height: `${(s.orders / maxOrders) * 100}%`, background: "var(--olive)", borderRadius: "4px 4px 0 0" }} title={`${s.orders} orders`} />
                </div>
                <div style={{ fontSize: 11, color: "var(--a-text-soft)", marginTop: 4 }}>{s.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="a-panel">
          <h3>Live Event Tracking (demo)</h3>
          <Table
            columns={["Event", "Detail", "Time"]}
            rows={eventLog}
            renderRow={(e) => (
              <tr key={e.id}><td><Badge tone="info">{e.event}</Badge></td><td>{e.detail}</td><td>{e.time}</td></tr>
            )}
          />
          <p style={{ fontSize: 12, color: "var(--a-text-soft)", marginTop: 10 }}>
            Tracked events: product_view, add_to_cart, checkout_started, payment_started, purchase, video_view, video_product_click, wishlist_add, coupon_apply, subscription_start, shared_cart_created, food_request, vote. No real analytics provider is connected in this prototype.
          </p>
        </div>
      </div>
    </>
  );
}
