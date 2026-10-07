import { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import { printMonthlySalesReport } from "../utils/printMonthlySalesReport";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [reportMonth, setReportMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      console.log(`Fetching orders with filter: ${filterStatus}`);
      const orderRequest = filterStatus === "ALL"
        ? api.get("/order")
        : api.get(`/order/status/${filterStatus}`);
      const deliveredRequest = filterStatus === "DELIVERED"
        ? orderRequest
        : api.get("/order/status/DELIVERED");
      const [response, deliveredResponse] = await Promise.all([orderRequest, deliveredRequest]);
      console.log("Orders received:", response.data);
      setOrders(response.data);
      setDeliveredOrders(deliveredResponse.data);
      setError("");
    } catch (err) {
      const errorMessage = "Failed to fetch orders";
      setError(errorMessage);
      console.error("Error fetching orders:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
      });
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/order/${orderId}/status/${newStatus}`);
      setOrders((current) => current.map((order) => order.id === orderId ? response.data : order));
      setDeliveredOrders((current) => {
        const remaining = current.filter((order) => order.id !== orderId);
        return newStatus === "DELIVERED" ? [...remaining, response.data] : remaining;
      });
      setSelectedOrder(null);
      alert("Order status updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
      console.error("Error updating order:", err);
    }
  };

  const completeOrder = async (orderId) => {
    await updateOrderStatus(orderId, "DELIVERED");
  };

  const cancelOrder = async (orderId) => {
    if (window.confirm("Cancel this order?")) {
      await updateOrderStatus(orderId, "CANCELLED");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const interval = setInterval(fetchOrders, 25000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const [reportYear, reportMonthNumber] = reportMonth.split("-").map(Number);
  const monthlyDeliveredOrders = deliveredOrders.filter((order) => {
    const date = new Date(order.createdAt || `${order.date}T00:00:00`);
    return !Number.isNaN(date.getTime())
      && date.getFullYear() === reportYear
      && date.getMonth() + 1 === reportMonthNumber;
  });
  const monthlyRevenue = monthlyDeliveredOrders.reduce((total, order) => total + (Number(order.totalPrice) || 0), 0);
  const reportMonthLabel = new Date(reportYear, reportMonthNumber - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const containerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0",
    background: "linear-gradient(135deg, #F8F3E9 0%, #EEE4D0 100%)",
    minHeight: "100vh",
  };

  const headerStyle = {
    background: "linear-gradient(135deg, #2B2118 0%, #3A1F14 100%)",
    padding: "3rem 2rem",
    borderRadius: "20px",
    border: "2px solid #C68E17",
    boxShadow: "0 10px 30px rgba(43, 33, 24, 0.3)",
    margin: "2rem",
    marginBottom: "1rem",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: "0.5rem",
    letterSpacing: "-0.3px",
  };

  const subtitleStyle = {
    fontSize: "1rem",
    color: "#E2D7C3",
    fontWeight: "500",
  };

  const filterContainerStyle = {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
    padding: "0 2rem",
  };

  const filterButtonStyle = (isActive) => ({
    padding: "0.75rem 1.5rem",
    border: isActive ? "2px solid #C68E17" : "2px solid #E2D7C3",
    backgroundColor: isActive ? "#C68E17" : "#ffffff",
    color: isActive ? "#F8F3E9" : "#66714A",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: isActive ? "700" : "600",
    transition: "all 0.3s ease",
    boxShadow: isActive ? "0 4px 12px rgba(43, 33, 24, 0.3)" : "0 2px 6px rgba(43, 33, 24, 0.1)",
  });

  const gridStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "2rem",
    paddingTop: "0",
  };

  const cardStyle = {
    border: "2px solid #E2D7C3",
    borderRadius: "14px",
    padding: "1.5rem",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(43, 33, 24, 0.12)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.3s ease",
  };

  const cardHoverStyle = {
    ...cardStyle,
    boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.15)",
  };

  const statusBadgeStyle = (status) => {
    const statusColors = {
      PENDING: { bg: "#66714A", color: "#ffffff" },
      CONFIRMED: { bg: "#C68E17", color: "#ffffff" },
      PREPARING: { bg: "#66714A", color: "#F8F3E9" },
      DELIVERED: { bg: "#2B2118", color: "#E2D7C3" },
      CANCELLED: { bg: "#8b5a5a", color: "#F8F3E9" },
    };
    const colors = statusColors[status] || statusColors.PENDING;
    return {
      display: "inline-block",
      padding: "0.5rem 1rem",
      backgroundColor: colors.bg,
      color: colors.color,
      borderRadius: "6px",
      fontWeight: "600",
      fontSize: "0.875rem",
    };
  };

  const emptyStateStyle = {
    textAlign: "center",
    padding: "3rem 2rem",
    color: "#5B5044",
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    backgroundColor: "#FFFDF9",
    border: "1px solid #E2D7C3",
    borderRadius: "14px",
    padding: "2rem",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  };

  if (loading) {
    return (
      <div className="admin-page orders-page" style={containerStyle}>
        <p style={{ textAlign: "center", color: "#5B5044" }}>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-page orders-page" style={containerStyle}>
      <div className="orders-header" style={headerStyle}>
        <h1 style={titleStyle}>📦 Orders Management</h1>
        <p style={subtitleStyle}>Track and manage customer orders</p>
      </div>

      <section className="monthly-sales-report" aria-label="Monthly sales revenue report">
        <div>
          <h2>Monthly sales revenue</h2>
          <p>Delivered orders placed in {reportMonthLabel}. Prototype payments are not collected.</p>
        </div>
        <label>
          Report month
          <input type="month" required value={reportMonth} onChange={(event) => {
            if (event.target.value) setReportMonth(event.target.value);
          }} />
        </label>
        <div className="monthly-sales-total">
          <span>{monthlyDeliveredOrders.length} delivered orders</span>
          <strong>₹{monthlyRevenue.toFixed(2)}</strong>
        </div>
        <button
          type="button"
          className="monthly-sales-download"
          onClick={() => {
            if (!printMonthlySalesReport(reportMonth, monthlyDeliveredOrders)) {
              window.alert("Allow pop-ups for this site to print or save the monthly report.");
            }
          }}
        >
          Print monthly report / Save as PDF
        </button>
      </section>

      <div className="orders-filters" style={filterContainerStyle}>
        <button
          onClick={() => setFilterStatus("ALL")}
          style={filterButtonStyle(filterStatus === "ALL")}
        >
          All Orders
        </button>
        <button
          onClick={() => setFilterStatus("PENDING")}
          style={filterButtonStyle(filterStatus === "PENDING")}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus("DELIVERED")}
          style={filterButtonStyle(filterStatus === "DELIVERED")}
        >
          Delivered
        </button>
      </div>

      {error && <div role="alert" className="orders-error">{error}</div>}

      {orders.length === 0 ? (
        <div style={emptyStateStyle}>
          <p style={{ fontSize: "1.1rem" }}>📭 No orders found for this filter</p>
        </div>
      ) : (
        <div className="orders-list" style={gridStyle}>
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className="order-card"
              style={{ ...cardStyle, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1.5rem" }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, { ...cardHoverStyle, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1.5rem" })}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { ...cardStyle, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1.5rem" })}
              onClick={() => setSelectedOrder(order)}
            >
              <div style={{ display: "flex", gap: "2rem", alignItems: "center", flex: 1 }}>
                <div style={statusBadgeStyle(order.status)}>{order.status}</div>

                <div>
                  <p style={{ margin: "0", color: "#5B5044", fontSize: "0.85rem" }}>
                    Customer
                  </p>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#2B2118", fontWeight: "600", fontSize: "0.95rem" }}>
                    {order.customerName}
                  </p>
                </div>

                <div>
                  <p style={{ margin: "0", color: "#5B5044", fontSize: "0.85rem" }}>
                    Order Time
                  </p>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#2B2118", fontWeight: "600", fontSize: "0.95rem" }}>
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <div>
                  <p style={{ margin: "0", color: "#5B5044", fontSize: "0.85rem" }}>
                    Amount
                  </p>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#2B2118", fontWeight: "600", fontSize: "0.95rem" }}>
                    ₹{order.totalPrice?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              {filterStatus === "PENDING" && (
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelOrder(order.id);
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#8A3B2E",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✕ Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    completeOrder(order.id);
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#66714A",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✓ Complete
                </button>
              </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="order-modal-backdrop" style={modalOverlayStyle} onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: "0", color: "#2B2118", fontSize: "1.5rem" }}>
                Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#5B5044",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <p style={{ margin: "0 0 0.5rem 0", color: "#5B5044", fontSize: "0.9rem" }}>
                Customer Name
              </p>
              <p style={{ margin: "0", color: "#2B2118", fontWeight: "600", fontSize: "1.1rem" }}>
                {selectedOrder.customerName}
              </p>
            </div>

            <label className="order-status-control">
              Update order status
              <select
                value={selectedOrder.status}
                onChange={(event) => updateOrderStatus(selectedOrder.id, event.target.value)}
              >
                {["PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>

            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ margin: "0 0 1rem 0", color: "#2B2118", fontSize: "1rem", fontWeight: "600" }}>
                Order Items
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.75rem", borderBottom: "1px solid #E2D7C3" }}>
                    <div>
                      <p style={{ margin: "0 0 0.25rem 0", color: "#2B2118", fontWeight: "500" }}>
                        {item.foodName}
                      </p>
                      <p style={{ margin: "0", color: "#94a3b8", fontSize: "0.85rem" }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: "0 0 0.25rem 0", color: "#5B5044", fontSize: "0.85rem" }}>
                        ₹{item.price?.toFixed(2)} each
                      </p>
                      <p style={{ margin: "0", color: "#2B2118", fontWeight: "600" }}>
                        ₹{item.subtotal?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "1rem", backgroundColor: "#FFFDF9", borderRadius: "8px", marginBottom: "1.5rem", borderLeft: "4px solid #2B2118" }}>
              <p style={{ margin: "0", color: "#5B5044", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                Total Bill
              </p>
              <p style={{ margin: "0", color: "#2B2118", fontSize: "1.3rem", fontWeight: "700" }}>
                ₹{selectedOrder.totalPrice?.toFixed(2) || "0.00"}
              </p>
            </div>

            <button
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#f1f5f9",
                color: "#5B5044",
                border: "1px solid #E2D7C3",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
              }}
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
