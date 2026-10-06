export const orderStatuses = ["placed", "confirmed", "preparing", "ready", "out-for-delivery", "delivered", "cancelled"];

export const demoOrders = [
  {
    id: "TFB10231", date: "2026-09-20", status: "delivered", payment: "UPI",
    items: [{ productId: "c11", name: "Homemade Chakli", qty: 2, price: 160 }, { productId: "c50", name: "Besan Ladoo", qty: 1, price: 260 }],
    address: "204, Om Sai Residency, Dharampeth, Nagpur - 440010",
    slot: "Evening, 5:00 PM – 8:00 PM", total: 580,
  },
  {
    id: "TFB10256", date: "2026-09-22", status: "out-for-delivery", payment: "COD",
    items: [{ productId: "c50", name: "Besan Ladoo", qty: 1, price: 260 }],
    address: "204, Om Sai Residency, Dharampeth, Nagpur - 440010",
    slot: "Morning, 7:00 AM – 10:00 AM", total: 260,
  },
  {
    id: "TFB10201", date: "2026-09-12", status: "delivered", payment: "Card",
    items: [{ productId: "c41", name: "Lemon Pickle", qty: 1, price: 160 }, { productId: "c108", name: "Goda Masala", qty: 1, price: 160 }],
    address: "204, Om Sai Residency, Dharampeth, Nagpur - 440010",
    slot: "Afternoon, 12:00 PM – 3:00 PM", total: 340,
  },
];

export const trackingSteps = ["placed", "confirmed", "preparing", "ready", "out-for-delivery", "delivered"];
