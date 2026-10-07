// Master catalogue: 11 storefront categories -> sub-groups -> items.
// Item format: "Name|price|weight|emoji"  (price in INR, base MRP)
export const catalog = [
  { slug: "papad-fryums", name: "Papad & Fryums", emoji: "🥠", hue: 38, blurb: "Sun-dried, hand-rolled papads and crisp fryums.",
    groups: [{ name: "Papad & Fryums", items: [
      "Rice Papad|90|200g|🥠","Udid Papad|110|200g|🥠","Sabudana Papad|130|200g|🥠" ] }] },
  { slug: "chakli-snacks", name: "Chakli & Snacks", emoji: "🌀", hue: 28, blurb: "Namkeen, chakli, sev, cookies and festive farsan.",
    groups: [
      { name: "Chakli & Namkeen", items: [
        "Homemade Chakli|160|300g|🌀","Bhajani Chakli|170|300g|🌀","Besan Sev|130|250g|🍜" ] },
      { name: "Traditional Snacks", items: [
        "Shankarpali|150|250g|🔶" ] } ] },
  { slug: "pickles", name: "Pickles", emoji: "🫙", hue: 8, blurb: "Sun-cured pickles in cold-pressed oil.",
    groups: [{ name: "Pickles", items: [
      "Mango Pickle|180|400g|🥭","Lemon Pickle|160|400g|🍋","Green Chilli Pickle|150|300g|🌶️" ] }] },
  { slug: "laddoos-sweets", name: "Laddoos & Sweets", emoji: "🍬", hue: 45, blurb: "Ladoos, chikki, gajak, jaggery and coconut sweets.",
    groups: [
      { name: "Laddoos & Traditional Sweets", items: [
        "Besan Ladoo|260|250g|🟡","Rava Ladoo|230|250g|🟡","Dry Fruit Ladoo|420|250g|🌰" ] },
      { name: "Jaggery & Chikki", items: [
        "Peanut Chikki|120|200g|🥜" ] } ] },
  { slug: "dry-fruits", name: "Dry Fruits", emoji: "🌰", hue: 30, blurb: "Premium nuts, dry fruits, seeds and roasted snacks.",
    groups: [{ name: "Dry Fruits & Nuts", items: [
      "Almonds|780|500g|🌰","Cashews|850|500g|🥜","Makhana|420|250g|⚪" ] }] },
  { slug: "chutneys", name: "Chutneys", emoji: "🌶️", hue: 12, blurb: "Dry chutney powders and fiery thecha.",
    groups: [{ name: "Chutneys & Dry Chutney Powders", items: [
      "Peanut Chutney Powder|120|200g|🥜","Garlic Chutney|110|200g|🧄" ] }] },
  { slug: "traditional-foods", name: "Traditional Foods", emoji: "🪔", hue: 20, blurb: "Authentic Maharashtrian pantry classics.",
    groups: [{ name: "Traditional Maharashtrian Products", items: [
      "Thalipeeth Bhajani|150|500g|🫓","Dry Garlic Chutney|110|200g|🧄","Anarsa|240|8 pcs|🍪" ] }] },
  { slug: "healthy-foods", name: "Healthy Foods", emoji: "🌾", hue: 95, blurb: "Millet, multigrain and guilt-free snacking.",
    groups: [{ name: "Healthy / Millet Products", items: [
      "Ragi Chakli|170|300g|🌾","Millet Chivda|140|250g|🥣" ] }] },
  { slug: "flours-bhajani", name: "Flours & Bhajani", emoji: "🌾", hue: 50, blurb: "Stone-ground flours and bhajani mixes.",
    groups: [{ name: "Homemade Flour & Bhajani", items: [
      "Chakli Bhajani|150|500g|🌾","Multigrain Flour|110|1kg|🌾" ] }] },
  { slug: "masalas", name: "Masalas", emoji: "🧂", hue: 15, blurb: "Freshly ground masalas and spice blends.",
    groups: [{ name: "Masalas & Spice Blends", items: [
      "Goda Masala|160|200g|🟤","Garam Masala|180|200g|🟤" ] }] },
  { slug: "ready-to-cook", name: "Ready-to-Cook", emoji: "🍲", hue: 60, blurb: "Instant mixes that taste like home.",
    groups: [{ name: "Ready-to-Cook Mixes", items: [
      "Sabudana Khichdi Mix|130|250g|🍲","Puran Poli Mix|190|500g|🫓" ] }] },
];
