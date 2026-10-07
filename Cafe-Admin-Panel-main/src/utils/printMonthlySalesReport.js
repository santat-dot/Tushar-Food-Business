const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
})[character]);

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
}).format(Number(value) || 0);

export function printMonthlySalesReport(month, orders) {
  const printWindow = window.open("", "_blank", "width=900,height=900");
  if (!printWindow) return false;

  const [year, monthNumber] = month.split("-").map(Number);
  const monthLabel = new Date(year, monthNumber - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
  const revenue = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
  const rows = orders.map((order) => {
    const orderDate = new Date(order.createdAt || `${order.date}T00:00:00`);
    return `<tr>
      <td>${escapeHtml(order.id)}</td>
      <td>${Number.isNaN(orderDate.getTime()) ? "—" : escapeHtml(orderDate.toLocaleDateString("en-IN"))}</td>
      <td>${escapeHtml(order.customerName)}</td>
      <td>${escapeHtml(order.payment || "—")}</td>
      <td class="number">${money(order.totalPrice)}</td>
    </tr>`;
  }).join("");

  printWindow.document.write(`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Monthly sales report - ${escapeHtml(monthLabel)}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 36px; color: #172b34; font: 14px/1.5 Arial, sans-serif; }
          main { max-width: 900px; margin: 0 auto; }
          header { display: flex; justify-content: space-between; gap: 20px; align-items: flex-end; padding-bottom: 18px; border-bottom: 3px solid #0b2633; }
          h1 { margin: 0; color: #0b2633; font-size: 24px; }
          p { margin: 5px 0 0; }
          .muted { color: #64727a; font-size: 12px; }
          .summary { display: flex; justify-content: space-between; gap: 20px; margin: 22px 0; padding: 16px; border: 1px solid #e2e2dc; background: #f5f4ef; }
          .summary strong { display: block; color: #0b2633; font-size: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px 8px; border-bottom: 1px solid #e1e4e2; text-align: left; }
          th { background: #f2f3ef; color: #344750; font-size: 12px; }
          .number { text-align: right; white-space: nowrap; }
          .notice { margin-top: 24px; padding: 12px; border: 1px solid #e8d49e; background: #fff8e6; color: #604814; font-size: 12px; }
          @media print { body { padding: 12mm; } }
        </style>
      </head>
      <body>
        <main>
          <header>
            <div><h1>Tushar Food Business</h1><p class="muted">Monthly sales revenue report</p></div>
            <strong>${escapeHtml(monthLabel)}</strong>
          </header>
          <section class="summary">
            <div><span class="muted">Delivered orders placed this month</span><strong>${orders.length}</strong></div>
            <div class="number"><span class="muted">Delivered order revenue</span><strong>${money(revenue)}</strong></div>
          </section>
          <table>
            <thead><tr><th>Order</th><th>Date placed</th><th>Customer</th><th>Payment method</th><th class="number">Revenue</th></tr></thead>
            <tbody>${rows || '<tr><td colspan="5">No delivered orders for this month.</td></tr>'}</tbody>
          </table>
          <p class="notice">Report includes orders currently marked Delivered, grouped by order placement month. Razorpay is prototype-only and payments are not captured.</p>
        </main>
        <script>window.addEventListener("load", () => setTimeout(() => window.print(), 200));</script>
      </body>
    </html>`);
  printWindow.document.close();
  return true;
}
