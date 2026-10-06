import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Dashboard() {
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [catalogCounts, setCatalogCounts] = useState({ categories: 0, foods: 0 });
  const [dashboardError, setDashboardError] = useState("");
  const [showOverview, setShowOverview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    async function fetchDashboardData() {
      try {
        const [ordersResponse, categoriesResponse, foodsResponse] = await Promise.all([
          api.get("/order/status/DELIVERED"),
          api.get("/category"),
          api.get("/food"),
        ]);
        if (!active) return;
        setDeliveredOrders(ordersResponse.data);
        setCatalogCounts({ categories: categoriesResponse.data.length, foods: foodsResponse.data.length });
        const revenue = ordersResponse.data.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        setTotalRevenue(revenue);
        setDashboardError("");
      } catch (err) {
        if (!active) return;
        setDashboardError(err.response?.data?.message || "Dashboard data could not be loaded. Check the API connection.");
        console.error("Error fetching dashboard data:", err);
      }
    }
    fetchDashboardData();
    return () => { active = false; };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F8F3E9 0%, #EEE4D0 100%)", padding: "0", margin: "0" }}>
      <div className="dashboard-content" style={{ maxWidth: "1400px", margin: "0 auto", padding: "3rem 2rem" }}>
        {/* Premium Header */}
        <div className="dashboard-hero" style={{ marginBottom: "3rem", background: "linear-gradient(135deg, #2B2118 0%, #3A1F14 100%)", borderRadius: "24px", padding: "3.5rem 2.5rem", color: "#fff", boxShadow: "0 16px 40px -4px rgba(43, 33, 24, 0.35)", border: "2px solid #C68E17" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "900", margin: "0 0 0.5rem 0", letterSpacing: "-0.8px", color: "#fff" }}>
            🏢 Admin Control Center
          </h1>
          <p style={{ fontSize: "1.15rem", margin: "0", color: "#E2D7C3", fontWeight: "500" }}>
            Manage Tushar Food Business operations with ease and efficiency
          </p>
        </div>

        {/* Cards Grid */}
        {dashboardError && <p className="dashboard-error" role="alert">{dashboardError}</p>}
        <div className="dashboard-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "0" }}>
          {[
            { icon: "📑", title: "Categories", description: `${catalogCounts.categories} storefront categories`, path: "/categories", bgColor: "#C68E17" },
            { icon: "🍜", title: "Food Items", description: `${catalogCounts.foods} products on the customer website`, path: "/food-items", bgColor: "#66714A" },
            { icon: "🎬", title: "Gallery", description: "Upload and manage customer-facing gallery media", path: "/gallery", bgColor: "#8A3B2E" },
            { icon: "📦", title: "Orders", description: "Review and update customer orders", path: "/orders", bgColor: "#9C6E10" },
            { icon: "📊", title: "Overview", description: "View delivered orders and revenue", path: "#overview", bgColor: "#66714A" },
          ].map((item, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              style={{ background: "#ffffff", border: "2px solid #E2D7C3", borderRadius: "20px", padding: "3rem 2rem", boxShadow: "0 8px 20px rgba(43, 33, 24, 0.12)", transition: "all 0.4s cubic-bezier(0.23, 1, 0.320, 1)", cursor: "pointer", position: "relative", overflow: "hidden" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-12px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(43, 33, 24, 0.25)";
                e.currentTarget.style.borderColor = "#C68E17";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(43, 33, 24, 0.12)";
                e.currentTarget.style.borderColor = "#E2D7C3";
              }}
              onClick={() => item.path === "#overview" ? setShowOverview(true) : navigate(item.path)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  item.path === "#overview" ? setShowOverview(true) : navigate(item.path);
                }
              }}
            >
              <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "140px", height: "140px", background: `linear-gradient(135deg, ${item.bgColor}15, ${item.bgColor}08)`, borderRadius: "50%", border: `2px solid ${item.bgColor}30` }}></div>
              <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem", filter: "drop-shadow(0 3px 6px rgba(0, 0, 0, 0.1))" }}>{item.icon}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#2B2118", marginBottom: "0.75rem", letterSpacing: "-0.3px" }}>{item.title}</div>
              <div style={{ color: "#66714A", fontSize: "0.95rem", lineHeight: "1.8", fontWeight: "500" }}>{item.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Overview Modal */}
      {showOverview && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(43, 33, 24, 0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(6px)", padding: "1rem" }} onClick={() => setShowOverview(false)}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", padding: "0", maxWidth: "650px", width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 30px 60px -12px rgba(43, 33, 24, 0.4), 0 0 0 1px rgba(43, 33, 24, 0.2)", overflow: "hidden", animation: "slideIn 0.3s ease-out" }} onClick={(e) => e.stopPropagation()}>
            <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #2B2118 0%, #3A1F14 100%)", padding: "1.8rem 2rem", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #C68E17", flexShrink: 0 }}>
              <div>
                <h2 style={{ margin: "0", color: "#fff", fontSize: "1.6rem", fontWeight: "900", letterSpacing: "-0.5px" }}>📊 Business Overview</h2>
                <p style={{ margin: "0.3rem 0 0 0", color: "#E2D7C3", fontSize: "0.85rem", fontWeight: "500" }}>Real-time analytics dashboard</p>
              </div>
              <button onClick={() => setShowOverview(false)} style={{ background: "rgba(255, 255, 255, 0.15)", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#fff", width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease", flexShrink: 0 }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"; }}>✕</button>
            </div>

            {/* Content */}
            <div style={{ padding: "1.5rem", background: "#F8F3E9", overflowY: "auto", flex: 1 }}>
              {/* Revenue Card */}
              <div style={{ marginBottom: "1rem", padding: "1.2rem", background: "linear-gradient(135deg, #2B2118 0%, #3A1F14 100%)", borderRadius: "16px", border: "2px solid #C68E17", boxShadow: "0 8px 16px rgba(43, 33, 24, 0.2)" }}>
                <p style={{ margin: "0 0 0.4rem 0", color: "#E2D7C3", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.8px" }}>💰 Total Revenue</p>
                <p style={{ margin: "0", color: "#E2D7C3", fontSize: "2rem", fontWeight: "900", letterSpacing: "-1px" }}>₹{totalRevenue.toFixed(2)}</p>
                <p style={{ margin: "0.4rem 0 0 0", color: "#66714A", fontSize: "0.8rem", fontWeight: "500" }}>From Delivered Orders</p>
              </div>

              {/* Orders Count Card */}
              <div style={{ marginBottom: "1.2rem", padding: "1.2rem", background: "linear-gradient(135deg, #C68E17 0%, #66714A 100%)", borderRadius: "16px", border: "2px solid #66714A", boxShadow: "0 8px 16px rgba(43, 33, 24, 0.2)" }}>
                <p style={{ margin: "0 0 0.4rem 0", color: "#F8F3E9", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.8px" }}>📦 Orders Completed</p>
                <p style={{ margin: "0", color: "#F8F3E9", fontSize: "2rem", fontWeight: "900", letterSpacing: "-1px" }}>{deliveredOrders.length}</p>
                <p style={{ margin: "0.4rem 0 0 0", color: "#EEE4D0", fontSize: "0.8rem", fontWeight: "500" }}>Successfully Delivered</p>
              </div>

              {/* Recent Orders */}
              <div>
                <h3 style={{ margin: "0 0 1rem 0", color: "#2B2118", fontSize: "1rem", fontWeight: "800", letterSpacing: "-0.3px" }}>🕐 Recent Delivered Orders</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", maxHeight: "220px", overflowY: "auto" }}>
                  {deliveredOrders.length === 0 ? (
                    <p style={{ color: "#66714A", textAlign: "center", padding: "1.5rem 1rem", fontSize: "0.9rem", fontWeight: "500" }}>No delivered orders yet</p>
                  ) : (
                    deliveredOrders.slice(0, 5).map((order) => (
                      <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem", backgroundColor: "#ffffff", borderRadius: "12px", border: "2px solid #E2D7C3", transition: "all 0.3s ease", cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#FBF7EE"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(43, 33, 24, 0.15)"; e.currentTarget.style.borderColor = "#C68E17"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#E2D7C3"; }}>
                        <div>
                          <p style={{ margin: "0 0 0.2rem 0", color: "#2B2118", fontWeight: "700", fontSize: "0.9rem" }}>{order.customerName}</p>
                          <p style={{ margin: "0", color: "#66714A", fontSize: "0.75rem", fontWeight: "500" }}>{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div style={{ textAlign: "right", background: "linear-gradient(135deg, #C68E17 0%, #66714A 100%)", padding: "0.5rem 0.9rem", borderRadius: "10px", border: "1px solid #66714A" }}>
                          <p style={{ margin: "0", color: "#F8F3E9", fontWeight: "800", fontSize: "0.9rem" }}>₹{order.totalPrice?.toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "1rem 1.5rem", backgroundColor: "#FBF7EE", borderTop: "2px solid #E2D7C3", display: "flex", gap: "1rem", flexShrink: 0 }}>
              <button onClick={() => setShowOverview(false)} style={{ flex: 1, padding: "0.8rem", background: "linear-gradient(135deg, #C68E17 0%, #66714A 100%)", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "0.9rem", transition: "all 0.3s ease", boxShadow: "0 6px 16px rgba(43, 33, 24, 0.25)" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(43, 33, 24, 0.35)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(43, 33, 24, 0.25)"; }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
