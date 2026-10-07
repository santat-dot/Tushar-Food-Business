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

export function downloadOrderReceipt(order) {
  const items = order.items || [];
  const total = order.total ?? order.totalPrice ?? items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty ?? item.quantity) || 0),
    0,
  );
  const itemRows = items.map((item) => {
    const quantity = Number(item.qty ?? item.quantity) || 0;
    const price = Number(item.price) || 0;
    return `<tr>
      <td>${escapeHtml(item.name ?? item.foodName)}</td>
      <td class="number">${quantity}</td>
      <td class="number">${money(price)}</td>
      <td class="number">${money(price * quantity)}</td>
    </tr>`;
  }).join("");
  const date = order.date || order.createdAt
    ? new Date(order.date || order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  const documentHtml = `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Order bill ${escapeHtml(order.id)}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 36px; color: #172b34; font: 14px/1.5 Arial, sans-serif; }
          main { max-width: 760px; margin: 0 auto; }
          .actions { display: flex; justify-content: flex-end; margin-bottom: 24px; }
          .actions button { padding: 10px 16px; border: 0; border-radius: 6px; background: #f5b92e; color: #10271d; font: 600 14px Arial, sans-serif; cursor: pointer; }
          header { display: flex; justify-content: space-between; gap: 24px; padding-bottom: 20px; border-bottom: 3px solid #0b2633; }
          h1 { margin: 0; color: #0b2633; font-size: 24px; }
          h2 { margin: 28px 0 12px; font-size: 15px; }
          p { margin: 4px 0; }
          .muted { color: #64727a; font-size: 12px; }
          .meta { text-align: right; }
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px; padding: 18px 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px 8px; border-bottom: 1px solid #e1e4e2; text-align: left; }
          th { background: #f2f3ef; color: #344750; font-size: 12px; }
          .number { text-align: right; white-space: nowrap; }
          .total { display: flex; justify-content: flex-end; gap: 32px; padding: 16px 8px; font-size: 18px; font-weight: 700; }
          .notice { margin-top: 28px; padding: 12px; border: 1px solid #e8d49e; background: #fff8e6; color: #604814; font-size: 12px; }
          @media print { body { padding: 12mm; } .actions { display: none; } }
        </style>
      </head>
      <body>
        <main>
          <div class="actions"><button type="button" onclick="window.print()">Print / Save as PDF</button></div>
          <header>
            <div><h1>Tushar Food Business</h1><p class="muted">Order bill / receipt</p></div>
            <div class="meta"><strong>Order #${escapeHtml(order.id)}</strong><p>${escapeHtml(date)}</p><p>${escapeHtml(order.status || "")}</p></div>
          </header>
          <section class="details">
            <div><strong>Customer</strong><p>${escapeHtml(order.customer || order.customerName || "Customer")}</p></div>
            <div><strong>Payment method</strong><p>${escapeHtml(order.payment || "—")}</p></div>
            <div><strong>Delivery address</strong><p>${escapeHtml(order.address || "—")}</p></div>
            <div><strong>Delivery slot</strong><p>${escapeHtml(order.slot || "—")}</p></div>
          </section>
          <table>
            <thead><tr><th>Item</th><th class="number">Qty</th><th class="number">Unit price</th><th class="number">Amount</th></tr></thead>
            <tbody>${itemRows}</tbody>
          </table>
          ${Number(order.savings) > 0 ? `<p class="number muted">Savings: ${money(order.savings)}</p>` : ""}
          <div class="total"><span>Total</span><span>${money(total)}</span></div>
          <p class="notice">Prototype order document only. Online payment processing is not active; this is not a tax invoice or proof of payment.</p>
        </main>
      </body>
    </html>`;
  const blob = new Blob([documentHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const orderId = String(order.id || "order").replace(/[^a-z0-9_-]/gi, "-");
  link.href = url;
  link.download = `Tushar-Food-Bill-${orderId}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
