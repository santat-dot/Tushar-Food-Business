const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3001").replace(/\/+$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || `Catalog API request failed (${response.status}).`);
  }
  return response.status === 204 ? null : response.json();
}

export function fetchCatalog() {
  return request("/catalog");
}

export function submitCustomerOrder(order) {
  return request("/orders", { method: "POST", body: JSON.stringify(order) });
}

export function fetchOrderStatus(orderId) {
  return request(`/orders/${encodeURIComponent(orderId)}/status`);
}
