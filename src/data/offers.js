// Festival / occasion discounts. An offer is LIVE when today falls between start and end (inclusive).
// Live offers are applied automatically to the products in their categories.
export const offers = [
  { id: "navratri", title: "Navratri Fasting Fest", occasion: "Navratri", emoji: "🪔", percent: 12, start: "2026-10-01", end: "2026-10-19",
    categories: ["dry-fruits", "ready-to-cook"], only: ["Sabudana Papad", "Makhana", "Roasted Makhana", "Sabudana Khichdi Mix"],
    note: "Sabudana & makhana for your vrat — 12% off.", color: "#B5651D",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=900&auto=format&fit=crop" },
  { id: "dussehra", title: "Dussehra Sweet Treat", occasion: "Dussehra", emoji: "🏹", percent: 10, start: "2026-10-15", end: "2026-10-22",
    categories: ["laddoos-sweets"], note: "10% off every laddoo and sweet.", color: "#9C6E10",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=900&auto=format&fit=crop" },
  { id: "diwali", title: "Diwali Dhamaka", occasion: "Diwali", emoji: "🎆", percent: 20, start: "2026-10-28", end: "2026-11-12",
    categories: ["laddoos-sweets", "chakli-snacks", "dry-fruits"], note: "Faral, sweets and gifting dry fruits — flat 20% off.", color: "#8A3B2E",
    image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=900&auto=format&fit=crop" },
  { id: "bhaubij", title: "Bhaubeej Gifting", occasion: "Bhai Dooj", emoji: "🎁", percent: 15, start: "2026-11-10", end: "2026-11-14",
    categories: ["dry-fruits"], note: "Gift a box of nuts — 15% off dry fruits.", color: "#66714A",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=900&auto=format&fit=crop" },
  { id: "sankranti", title: "Makar Sankranti – Til Gul", occasion: "Makar Sankranti", emoji: "🪁", percent: 15, start: "2027-01-10", end: "2027-01-15",
    categories: ["laddoos-sweets"], only: ["Til Ladoo", "Til Gul", "Sesame Chikki", "Peanut Chikki", "Jaggery", "Jaggery Ladoo"], note: "Til-gul ghya, god god bola — 15% off.", color: "#9C6E10",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=900&auto=format&fit=crop" },
  { id: "holi", title: "Holi Faral Fest", occasion: "Holi", emoji: "🎨", percent: 12, start: "2027-03-01", end: "2027-03-08",
    categories: ["chakli-snacks"], note: "Namkeen & snack platters — 12% off.", color: "#8A3B2E",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900&auto=format&fit=crop" },
  { id: "gudipadwa", title: "Gudi Padwa Special", occasion: "Gudi Padwa", emoji: "🌼", percent: 10, start: "2027-04-02", end: "2027-04-09",
    categories: ["traditional-foods", "laddoos-sweets"], note: "Traditional Maharashtrian foods — 10% off.", color: "#C68E17",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=900&auto=format&fit=crop" },
  { id: "pickle", title: "Summer Pickle Festival", occasion: "Summer", emoji: "🥭", percent: 15, start: "2027-04-15", end: "2027-05-31",
    categories: ["pickles", "chutneys"], note: "Stock up on pickles and chutneys — 15% off.", color: "#8A3B2E",
    image: "https://images.unsplash.com/photo-1625944230945-1b7d1d5b7d0d?q=80&w=900&auto=format&fit=crop" },
  { id: "ganesh", title: "Ganeshotsav Modak & Sweets", occasion: "Ganesh Chaturthi", emoji: "🐘", percent: 15, start: "2027-09-05", end: "2027-09-15",
    categories: ["laddoos-sweets"], note: "Prasad-ready sweets — 15% off.", color: "#B5651D",
    image: "https://images.unsplash.com/photo-1604908556851-8a1f2d2f1a1c?q=80&w=900&auto=format&fit=crop" },
];

export const coupons = [
  { code: "HOME10", percent: 10, label: "10% off your cart" },
  { code: "WELCOME10", percent: 10, label: "10% off your first order", firstOrderOnly: true },
];

export const bulkTiers = [
  { min: 5000, percent: 10, label: "Bulk 10% off on orders above ₹5,000" },
  { min: 2000, percent: 5, label: "Bulk 5% off on orders above ₹2,000" },
];

const today = () => new Date().toISOString().slice(0, 10);
export function offerStatus(o, d = today()) { return d < o.start ? "upcoming" : d > o.end ? "ended" : "live"; }
export function liveOffers() { return offers.filter((o) => offerStatus(o) === "live"); }
export function upcomingOffers() { return offers.filter((o) => offerStatus(o) === "upcoming"); }
export function offerApplies(o, product) {
  return product.categories.some((c) => o.categories.includes(c)) && (!o.only || o.only.includes(product.name));
}
export function bestOfferFor(product) {
  return liveOffers().filter((o) => offerApplies(o, product)).sort((a, b) => b.percent - a.percent)[0] || null;
}
export function fmtDate(s) { return new Date(s + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
