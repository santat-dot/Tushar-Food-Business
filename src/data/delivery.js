export const deliverySlots = [
  { id: "morning", label: "Morning", window: "7:00 AM – 10:00 AM", status: "available", capacity: 40, booked: 18, cutoff: "9:00 PM previous day" },
  { id: "afternoon", label: "Afternoon", window: "12:00 PM – 3:00 PM", status: "almost-full", capacity: 30, booked: 27, cutoff: "10:00 AM same day" },
  { id: "evening", label: "Evening", window: "5:00 PM – 8:00 PM", status: "full", capacity: 35, booked: 35, cutoff: "2:00 PM same day" },
];

export const serviceablePincodes = {
  "411001": { zone: "Pune Central", charge: 0, freeThreshold: 0, etaDays: 0 },
  "411038": { zone: "Pune West", charge: 30, freeThreshold: 500, etaDays: 0 },
  "400001": { zone: "Mumbai South", charge: 60, freeThreshold: 800, etaDays: 1 },
  "440001": { zone: "Nagpur Central", charge: 80, freeThreshold: 1000, etaDays: 2 },
};

export const kitchenCapacity = { daily: 120, booked: 76 };
