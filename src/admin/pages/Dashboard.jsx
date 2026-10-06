import { Link } from "react-router-dom";
import { dashboardStats as d, todayActions, salesTrend } from "../data/adminData";
import { PageHeader, StatCard } from "../components/AdminUI";

export default function Dashboard() {
  const maxRevenue = Math.max(...salesTrend.map((s) => s.revenue));
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="admin-content">
        <div className="a-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", marginBottom: 20 }}>
          <StatCard label="Orders Today" value={d.ordersToday} />
          <StatCard label="Revenue Today" value={`₹${d.revenueToday.toLocaleString("en-IN")}`} />
          <StatCard label="Pending" value={d.statusCounts.pending} />
          <StatCard label="Preparing" value={d.statusCounts.preparing} />
          <StatCard label="Ready" value={d.statusCounts.ready} />
          <StatCard label="Out for Delivery" value={d.statusCounts.outForDelivery} />
          <StatCard label="Delivered" value={d.statusCounts.delivered} />
          <StatCard label="Cancelled" value={d.statusCounts.cancelled} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 20, alignItems: "start" }}>
          <div className="a-panel">
            <h3>Revenue — Last 7 Days</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160 }}>
              {salesTrend.map((s) => (
                <div key={s.day} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: 130, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                    <div style={{ width: "60%", height: `${(s.revenue / maxRevenue) * 100}%`, background: "var(--a-accent)", borderRadius: "4px 4px 0 0" }} title={`₹${s.revenue}`} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--a-text-soft)", marginTop: 4 }}>{s.day}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="a-panel">
            <h3>What should I do today?</h3>
            <ul className="a-actions-list">
              {todayActions.map((a) => (
                <li key={a.id}><span className="dot" />{a.text}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          <div className="a-panel">
            <h3>Kitchen</h3>
            <Row k="Capacity" v={d.kitchen.capacity} />
            <Row k="Booked" v={d.kitchen.booked} />
            <Row k="Remaining" v={d.kitchen.remaining} />
            <Row k="Low Stock" v={d.kitchen.lowStock} />
            <Row k="Sold Out" v={d.kitchen.soldOut} />
            <Row k="Pre-orders" v={d.kitchen.preorders} />
            <Link className="link-more" to="/admin/capacity" style={{ display: "inline-block", marginTop: 10 }}>Manage capacity →</Link>
          </div>

          <div className="a-panel">
            <h3>Customers</h3>
            <Row k="New" v={d.customers.newToday} />
            <Row k="Returning" v={d.customers.returning} />
            <Row k="Repeat Orders" v={d.customers.repeatOrders} />
            <Link className="link-more" to="/admin/customers" style={{ display: "inline-block", marginTop: 10 }}>View customers →</Link>
          </div>

          <div className="a-panel">
            <h3>Products</h3>
            <Row k="Best Sellers" v={d.products.bestSellers.join(", ")} />
            <Row k="Slow Moving" v={d.products.slowMoving.join(", ")} />
            <Row k="Low Stock" v={d.products.lowStock.join(", ")} />
            <Row k="Sold Out" v={d.products.soldOut.join(", ")} />
            <Row k="High Demand, Unavailable" v={d.products.highDemandUnavailable.join(", ")} />
            <Link className="link-more" to="/admin/products" style={{ display: "inline-block", marginTop: 10 }}>Manage products →</Link>
          </div>

          <div className="a-panel">
            <h3>Content</h3>
            <Row k="Most Watched Story" v={d.content.mostWatchedStory} />
            <Row k="Product Clicks" v={d.content.productClicks} />
            <Row k="Shares" v={d.content.shares} />
            <Row k="Story → Order Conversion" v={d.content.storyToOrderConversion} />
            <Link className="link-more" to="/admin/kitchen-stories" style={{ display: "inline-block", marginTop: 10 }}>Manage stories →</Link>
          </div>

          <div className="a-panel">
            <h3>Delivery</h3>
            {d.delivery.ordersPerSlot.map((s) => <Row key={s.slot} k={s.slot} v={s.count} />)}
            <Row k="Full Slots" v={d.delivery.fullSlots} />
            <Row k="Available Slots" v={d.delivery.availableSlots} />
            <Link className="link-more" to="/admin/delivery" style={{ display: "inline-block", marginTop: 10 }}>Manage delivery →</Link>
          </div>

          <div className="a-panel">
            <h3>Offers</h3>
            <Row k="Active Coupons" v={d.offers.activeCoupons} />
            <Row k="Usage" v={d.offers.usage} />
            <Link className="link-more" to="/admin/offers" style={{ display: "inline-block", marginTop: 10 }}>Manage offers →</Link>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "5px 0", borderBottom: "1px dashed var(--a-line)" }}>
      <span style={{ color: "var(--a-text-soft)" }}>{k}</span>
      <strong>{v}</strong>
    </div>
  );
}
