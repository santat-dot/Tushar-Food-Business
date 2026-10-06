// Centralized demo/mock data for the Admin command center.
// All numbers are illustrative prototype data, not real business figures.

export const dashboardStats = {
  ordersToday: 27,
  revenueToday: 18640,
  statusCounts: { pending: 5, preparing: 6, ready: 3, outForDelivery: 4, delivered: 8, cancelled: 1 },
  kitchen: { capacity: 60, booked: 42, remaining: 18, lowStock: 4, soldOut: 2, preorders: 6 },
  customers: { newToday: 9, returning: 14, repeatOrders: 12 },
  products: {
    bestSellers: ["Puran Poli", "Veg Thali Combo", "Raw Mango Pickle"],
    mostViewed: ["Kolhapuri Thecha", "Masala Khakhra"],
    slowMoving: ["Goda Masala"],
    lowStock: ["Kolhapuri Thecha"],
    soldOut: ["Modak Box (Festive)"],
    highDemandUnavailable: ["Bhakarwadi"],
  },
  content: { mostWatchedStory: "How We Make Puran Poli", productClicks: 214, shares: 38, storyToOrderConversion: "6.8%" },
  delivery: { ordersPerSlot: [{ slot: "Morning", count: 8 }, { slot: "Afternoon", count: 6 }, { slot: "Evening", count: 13 }], fullSlots: 1, availableSlots: 5 },
  offers: { activeCoupons: 4, usage: 63 },
};

export const todayActions = [
  { id: "a1", text: "5 orders need confirmation.", type: "orders" },
  { id: "a2", text: "Dinner slot is nearly full.", type: "delivery" },
  { id: "a3", text: "Kolhapuri Thecha is low in stock.", type: "inventory" },
  { id: "a4", text: "12 customers have not reordered in 30 days.", type: "customers" },
  { id: "a5", text: "Latest Kitchen Story generated 7 product clicks.", type: "content" },
];

export const salesTrend = [
  { day: "Mon", revenue: 9800, orders: 18 },
  { day: "Tue", revenue: 11200, orders: 21 },
  { day: "Wed", revenue: 8600, orders: 15 },
  { day: "Thu", revenue: 13400, orders: 24 },
  { day: "Fri", revenue: 15900, orders: 28 },
  { day: "Sat", revenue: 21200, orders: 36 },
  { day: "Sun", revenue: 18640, orders: 27 },
];

export const notifyMeRequests = [
  { id: "n1", product: "Modak Box (Festive)", waiting: 23, channel: "WhatsApp", date: "2026-09-18", status: "pending" },
  { id: "n2", product: "Bhakarwadi", waiting: 11, channel: "SMS", date: "2026-09-20", status: "pending" },
  { id: "n3", product: "Shrikhand", waiting: 6, channel: "WhatsApp", date: "2026-09-15", status: "notified" },
];

export const capacitySettings = {
  dailyCapacity: 60,
  productCapacity: [
    { product: "Puran Poli", capacity: 40, booked: 30 },
    { product: "Veg Thali Combo", capacity: 25, booked: 18 },
    { product: "Shrikhand", capacity: 20, booked: 9 },
  ],
  slotCapacity: [
    { slot: "Morning, 7:00 AM – 10:00 AM", capacity: 20, booked: 8 },
    { slot: "Afternoon, 12:00 PM – 3:00 PM", capacity: 20, booked: 6 },
    { slot: "Evening, 5:00 PM – 8:00 PM", capacity: 20, booked: 13 },
  ],
  prepCutoff: "2 hours before slot start",
  preorderWindow: "Up to 5 days in advance",
  closedDates: ["2026-10-02", "2026-10-21"],
};

export const deliveryZones = [
  { id: "z1", pincode: "411038", zone: "Kothrud", charge: 0, freeThreshold: 499, active: true },
  { id: "z2", pincode: "411004", zone: "Deccan", charge: 30, freeThreshold: 599, active: true },
  { id: "z3", pincode: "411001", zone: "Camp", charge: 40, freeThreshold: 699, active: true },
  { id: "z4", pincode: "411057", zone: "Wakad", charge: 60, freeThreshold: 799, active: false },
];

export const batches = [
  { id: "B-2026-0912", product: "Puran Poli", prepDate: "2026-09-22", packingDate: "2026-09-22", bestBefore: "2026-09-24", quantity: 120, status: "dispatched" },
  { id: "B-2026-0913", product: "Raw Mango Pickle", prepDate: "2026-09-18", packingDate: "2026-09-19", bestBefore: "2026-10-19", quantity: 80, status: "packed" },
  { id: "B-2026-0914", product: "Kolhapuri Thecha", prepDate: "2026-09-21", packingDate: "2026-09-21", bestBefore: "2026-10-21", quantity: 45, status: "delivered" },
  { id: "B-2026-0915", product: "Masala Khakhra", prepDate: "2026-09-20", packingDate: "2026-09-20", bestBefore: "2026-11-04", quantity: 60, status: "in-kitchen" },
];

export const batchTimelineSteps = ["Ingredients", "Preparation", "Cooking", "Packing", "Dispatch", "Delivery"];

export const adminCustomers = [
  { id: "c1", name: "Anjali Kulkarni", phone: "98220xxxxx", orders: 14, lastOrder: "2026-09-20", type: "returning", loyaltyPoints: 320 },
  { id: "c2", name: "Rohit Deshmukh", phone: "99870xxxxx", orders: 1, lastOrder: "2026-09-22", type: "new", loyaltyPoints: 20 },
  { id: "c3", name: "Sneha Patil", phone: "97640xxxxx", orders: 27, lastOrder: "2026-08-30", type: "returning", loyaltyPoints: 610 },
  { id: "c4", name: "Vikas Joshi", phone: "98500xxxxx", orders: 3, lastOrder: "2026-07-14", type: "lapsed", loyaltyPoints: 45 },
];

export const adminOffers = [
  { id: "o1", code: "WELCOME10", type: "Percentage", value: "10%", minOrder: 300, expiry: "2026-12-31", usageLimit: 500, used: 214, scope: "All products", active: true },
  { id: "o2", code: "FESTIVE100", type: "Flat", value: "₹100", minOrder: 799, expiry: "2026-11-15", usageLimit: 200, used: 58, scope: "Festival Offer", active: true },
  { id: "o3", code: "FREESHIP", type: "Free Delivery", value: "—", minOrder: 499, expiry: "2026-10-10", usageLimit: 1000, used: 340, scope: "All products", active: true },
  { id: "o4", code: "COMBO50", type: "Combo", value: "₹50 off", minOrder: 0, expiry: "2026-09-30", usageLimit: 150, used: 150, scope: "Thali Combos", active: false },
];

export const adminReviews = [
  { id: "r1", product: "Puran Poli", customer: "Anjali K.", rating: 5, text: "Tastes just like homemade, kids loved it.", status: "approved", date: "2026-09-19" },
  { id: "r2", product: "Kolhapuri Thecha", customer: "Rohit D.", rating: 4, text: "Very spicy, exactly as described.", status: "pending", date: "2026-09-21" },
  { id: "r3", product: "Shrikhand", customer: "Sneha P.", rating: 5, text: "Best shrikhand I've had outside home.", status: "pending", date: "2026-09-20" },
];

export const askKitchenQuestions = [
  { id: "q1", product: "Raw Mango Pickle", customer: "Meera S.", question: "Is this pickle very oily?", answer: "It uses a moderate mustard-oil base, typical of Maharashtrian pickles.", status: "answered" },
  { id: "q2", product: "Masala Khakhra", customer: "Alok T.", question: "Is it fried or roasted?", answer: "", status: "pending" },
];

export const customerMoments = [
  { id: "m1", customer: "Anjali K.", product: "Puran Poli", text: "Made our Ganpati festival complete!", reaction: "Family Favourite", status: "pending" },
  { id: "m2", customer: "Rohit D.", product: "Kolhapuri Thecha", text: "So spicy, exactly how I like it.", reaction: "Spicy Favourite", status: "approved" },
];

export const kitchenNotesOfDay = [
  { id: "kn1", type: "Today's Special", text: "Fresh batch of Shrikhand ready by 11 AM today.", date: "2026-09-23" },
  { id: "kn2", type: "Ingredient Arrival", text: "Fresh Alphonso pulp arrived for the season's Aamras.", date: "2026-09-22" },
];

export const contentCalendar = [
  { id: "cc1", date: "2026-09-24", type: "Kitchen Story", title: "Behind the Kitchen: Morning Prep" },
  { id: "cc2", date: "2026-09-26", type: "Festival Special", title: "Ganesh Chaturthi Modak Collection" },
  { id: "cc3", date: "2026-09-28", type: "Offer", title: "Weekend Combo Discount" },
  { id: "cc4", date: "2026-10-02", type: "Product Launch", title: "New: Bhakarwadi Relaunch" },
];

export const mediaLibrary = [
  { id: "md1", type: "video", title: "Puran Poli Making Process", tags: ["kitchen-story", "sweets"], product: "Puran Poli" },
  { id: "md2", type: "image", title: "Thecha Jar Hero Shot", tags: ["pickles"], product: "Kolhapuri Thecha" },
  { id: "md3", type: "video", title: "Packing Orders Timelapse", tags: ["behind-the-kitchen"], product: null },
];

export const productIdeas = [
  { id: "pi1", name: "Sabudana Khichdi Mix", votes: 84, deadline: "2026-10-05", status: "voting" },
  { id: "pi2", name: "Instant Misal Kit", votes: 61, deadline: "2026-10-05", status: "voting" },
  { id: "pi3", name: "Kokum Sherbet Concentrate", votes: 129, deadline: "2026-09-15", status: "coming-soon" },
];

export const dishRequests = [
  { id: "dr1", customer: "Meera S.", dish: "Kanda Bhaji Mix", stage: "Testing" },
  { id: "dr2", customer: "Alok T.", dish: "Vada Pav Kit", stage: "Requested" },
  { id: "dr3", customer: "Sneha P.", dish: "Aamras Cups", stage: "Available" },
];

export const subscriptionPlans = [
  { id: "sp1", name: "Weekly Snack Box", frequency: "Weekly", price: 499, products: ["Masala Khakhra", "Bhakarwadi"], status: "active" },
  { id: "sp2", name: "Monthly Pickle Combo", frequency: "Monthly", price: 899, products: ["Kolhapuri Thecha", "Raw Mango Pickle"], status: "active" },
  { id: "sp3", name: "Festival Meal Plan", frequency: "One-time", price: 1499, products: ["Veg Thali Combo", "Shrikhand"], status: "draft" },
];

export const loyaltyRules = {
  pointsPerRupee: 1,
  redemptionRate: "100 points = ₹50",
  rewards: [
    { id: "lr1", name: "Free Delivery Voucher", points: 200 },
    { id: "lr2", name: "₹100 Off Coupon", points: 400 },
    { id: "lr3", name: "Free Snack Sample", points: 150 },
  ],
  campaigns: [{ id: "lc1", name: "Festival Double Points", period: "Sept 20 – Oct 5" }],
};

export const referralRules = {
  referrerReward: "₹100 credit after friend's first order",
  refereeReward: "15% off first order",
  totalReferrals: 214,
  successfulReferrals: 132,
};

export const analyticsSummary = {
  revenue: 128400,
  orders: 214,
  aov: 600,
  repeatPurchaseRate: "42%",
  couponUsage: 63,
  productViews: 5860,
  videoViews: 3120,
  videoProductClicks: 480,
  videoToOrderConversion: "6.8%",
  customerGrowth: "+9 today",
  demandUnavailable: 12,
  notifyMeRequests: 40,
  preorders: 6,
  subscriptions: 18,
  referralPerformance: "132 successful",
};

export const eventLog = [
  { id: "e1", event: "product_view", detail: "Puran Poli", time: "10:12" },
  { id: "e2", event: "add_to_cart", detail: "Veg Thali Combo", time: "10:14" },
  { id: "e3", event: "video_view", detail: "How We Make Puran Poli", time: "10:20" },
  { id: "e4", event: "video_product_click", detail: "Puran Poli", time: "10:21" },
  { id: "e5", event: "checkout_started", detail: "Cart #TFB10299", time: "10:25" },
  { id: "e6", event: "purchase", detail: "TFB10299 · ₹710", time: "10:27" },
  { id: "e7", event: "coupon_apply", detail: "WELCOME10", time: "10:26" },
  { id: "e8", event: "wishlist_add", detail: "Shrikhand", time: "10:31" },
];

export const festivals = [
  { id: "f1", name: "Ganesh Chaturthi", start: "2026-09-14", end: "2026-09-24", active: true, collection: "Modak & Festive Sweets", offer: "FESTIVE100" },
  { id: "f2", name: "Diwali", start: "2026-11-01", end: "2026-11-08", active: false, collection: "Diwali Faral Box", offer: "" },
  { id: "f3", name: "Eid", start: "2027-03-20", end: "2027-03-22", active: false, collection: "", offer: "" },
  { id: "f4", name: "Holi", start: "2027-03-03", end: "2027-03-04", active: false, collection: "", offer: "" },
  { id: "f5", name: "Christmas", start: "2026-12-24", end: "2026-12-26", active: false, collection: "", offer: "" },
];

export const reportTypes = ["Orders", "Customers", "Products", "Sales", "Inventory", "Coupons", "Videos", "Demand"];
