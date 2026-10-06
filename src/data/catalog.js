// Master catalogue: 11 storefront categories -> sub-groups -> items.
// Item format: "Name|price|weight|emoji"  (price in INR, base MRP)
export const catalog = [
  { slug: "papad-fryums", name: "Papad & Fryums", emoji: "🥠", hue: 38, blurb: "Sun-dried, hand-rolled papads and crisp fryums.",
    groups: [{ name: "Papad & Fryums", items: [
      "Rice Papad|90|200g|🥠","Udid Papad|110|200g|🥠","Moong Dal Papad|120|200g|🥠","Potato Papad|100|200g|🥔","Sabudana Papad|130|200g|🥠",
      "Garlic Papad|120|200g|🧄","Masala Papad|115|200g|🌶️","Mirchi Papad|115|200g|🌶️","Rice Fryums|80|200g|🍘","Masala Fryums|90|200g|🍘" ] }] },
  { slug: "chakli-snacks", name: "Chakli & Snacks", emoji: "🌀", hue: 28, blurb: "Namkeen, chakli, sev, cookies and festive farsan.",
    groups: [
      { name: "Chakli & Namkeen", items: [
        "Homemade Chakli|160|300g|🌀","Bhajani Chakli|170|300g|🌀","Rice Chakli|150|300g|🌀","Multigrain Chakli|180|300g|🌀","Besan Sev|130|250g|🍜",
        "Garlic Sev|140|250g|🍜","Bhujia|140|250g|🍜","Poha Chivda|120|250g|🥣","Bhadang|110|250g|🥣","Masala Peanuts|110|250g|🥜" ] },
      { name: "Traditional Snacks", items: [
        "Shankarpali|150|250g|🔶","Namak Para|120|250g|🔶","Karanji|220|8 pcs|🥟","Anarsa|240|8 pcs|🍪","Farsan|130|250g|🥣",
        "Mathri|130|250g|🍘","Khakhra|110|250g|🍘","Kadboli|140|250g|🍩","Dry Kachori|160|8 pcs|🥟" ] },
      { name: "Cookies & Biscuits", items: [
        "Atta Cookies|140|250g|🍪","Nankhatai|150|250g|🍪","Besan Cookies|150|250g|🍪","Coconut Cookies|150|250g|🍪","Jeera Cookies|140|250g|🍪",
        "Ragi Cookies|160|250g|🍪","Multigrain Cookies|160|250g|🍪","Dry Fruit Cookies|220|250g|🍪","Peanut Cookies|140|250g|🍪","Jaggery Cookies|160|250g|🍪" ] } ] },
  { slug: "pickles", name: "Pickles", emoji: "🫙", hue: 8, blurb: "Sun-cured pickles in cold-pressed oil.",
    groups: [{ name: "Pickles", items: [
      "Mango Pickle|180|400g|🥭","Lemon Pickle|160|400g|🍋","Green Chilli Pickle|150|300g|🌶️","Garlic Pickle|170|300g|🧄","Ginger Pickle|160|300g|🫚",
      "Mixed Vegetable Pickle|170|400g|🥕","Amla Pickle|150|300g|🫒","Carrot Pickle|140|300g|🥕","Sweet Mango Pickle|180|400g|🥭","Ginger-Garlic Pickle|170|300g|🧄" ] }] },
  { slug: "laddoos-sweets", name: "Laddoos & Sweets", emoji: "🍬", hue: 45, blurb: "Ladoos, chikki, gajak, jaggery and coconut sweets.",
    groups: [
      { name: "Laddoos & Traditional Sweets", items: [
        "Besan Ladoo|260|250g|🟡","Rava Ladoo|230|250g|🟡","Coconut Ladoo|240|250g|🥥","Til Ladoo|220|250g|🟤","Peanut Ladoo|210|250g|🥜",
        "Ragi Ladoo|250|250g|🟤","Dry Fruit Ladoo|420|250g|🌰","Dates Ladoo|360|250g|🟤","Boondi Ladoo|240|250g|🟠","Multigrain Ladoo|260|250g|🟤" ] },
      { name: "Jaggery & Chikki", items: [
        "Jaggery|90|500g|🟫","Jaggery Powder|100|500g|🟫","Peanut Chikki|120|200g|🥜","Sesame Chikki|120|200g|🟤","Dry Fruit Chikki|220|200g|🌰",
        "Coconut Chikki|140|200g|🥥","Til Gul|110|200g|🟤","Peanut Gajak|130|200g|🥜","Dry Fruit Gajak|240|200g|🌰","Jaggery Ladoo|230|250g|🟫" ] },
      { name: "Coconut Products", items: [
        "Dry Coconut|160|250g|🥥","Coconut Powder|140|200g|🥥","Coconut Chips|150|150g|🥥","Coconut Barfi|260|250g|🥥","Coconut Jaggery Balls|220|250g|🥥" ] } ] },
  { slug: "dry-fruits", name: "Dry Fruits", emoji: "🌰", hue: 30, blurb: "Premium nuts, dry fruits, seeds and roasted snacks.",
    groups: [
      { name: "Dry Fruits & Nuts", items: [
        "Almonds|780|500g|🌰","Cashews|850|500g|🥜","Pistachios|1100|500g|🟢","Walnuts|900|500g|🌰","Raisins|320|500g|🍇",
        "Dates|280|500g|🟤","Anjeer|650|500g|🟣","Makhana|420|250g|⚪","Mixed Dry Fruits|750|500g|🌰","Masala Cashews|450|250g|🥜" ] },
      { name: "Seeds & Roasted Snacks", items: [
        "Flax Seeds|110|250g|🌱","Pumpkin Seeds|240|250g|🎃","Sunflower Seeds|160|250g|🌻","Chia Seeds|220|250g|🌱","Sesame Seeds|120|250g|⚪",
        "Roasted Makhana|220|150g|⚪","Mixed Seeds|240|250g|🌱","Masala Seeds|180|250g|🌶️","Roasted Chana|90|250g|🟤","Roasted Peanuts|100|250g|🥜" ] } ] },
  { slug: "chutneys", name: "Chutneys", emoji: "🌶️", hue: 12, blurb: "Dry chutney powders and fiery thecha.",
    groups: [{ name: "Chutneys & Dry Chutney Powders", items: [
      "Peanut Chutney Powder|120|200g|🥜","Garlic Chutney|110|200g|🧄","Dry Coconut Chutney|130|200g|🥥","Flaxseed Chutney|120|200g|🌱","Sesame Chutney|120|200g|⚪",
      "Curry Leaf Chutney|120|200g|🌿","Red Chilli Chutney Powder|110|200g|🌶️","Idli Chutney Powder|120|200g|🍚","Maharashtrian Thecha|140|200g|🌶️","Peanut-Garlic Chutney|130|200g|🧄" ] }] },
  { slug: "traditional-foods", name: "Traditional Foods", emoji: "🪔", hue: 20, blurb: "Authentic Maharashtrian pantry classics.",
    groups: [{ name: "Traditional Maharashtrian Products", items: [
      "Bhajani Chakli|170|300g|🌀","Thalipeeth Bhajani|150|500g|🫓","Sabudana Papad|130|200g|🥠","Bhadang|110|250g|🥣","Poha Chivda|120|250g|🥣",
      "Dry Garlic Chutney|110|200g|🧄","Thecha|140|200g|🌶️","Goda Masala|160|200g|🟤","Anarsa|240|8 pcs|🍪","Shankarpali|150|250g|🔶" ] }] },
  { slug: "healthy-foods", name: "Healthy Foods", emoji: "🌾", hue: 95, blurb: "Millet, multigrain and guilt-free snacking.",
    groups: [
      { name: "Healthy / Millet Products", items: [
        "Ragi Chakli|170|300g|🌾","Ragi Ladoo|250|250g|🌾","Ragi Cookies|160|250g|🍪","Jowar Chakli|170|300g|🌾","Jowar Bhakri Flour|90|500g|🌾",
        "Multigrain Chakli|180|300g|🌀","Millet Chivda|140|250g|🥣","Millet Cookies|170|250g|🍪","Roasted Seeds Mix|240|250g|🌱","Healthy Dry Fruit Mix|480|250g|🌰" ] },
      { name: "Homemade Healthy Snacks", items: [
        "Roasted Chana|90|250g|🟤","Roasted Makhana|220|150g|⚪","Roasted Peanuts|100|250g|🥜","Mixed Seeds|240|250g|🌱","Dry Fruit Mix|480|250g|🌰",
        "Millet Chivda|140|250g|🥣","Multigrain Chakli|180|300g|🌀","Ragi Cookies|160|250g|🍪","Baked Chakli|190|300g|🌀","Dates & Nuts Ladoo|380|250g|🟤" ] } ] },
  { slug: "flours-bhajani", name: "Flours & Bhajani", emoji: "🌾", hue: 50, blurb: "Stone-ground flours and bhajani mixes.",
    groups: [{ name: "Homemade Flour & Bhajani", items: [
      "Chakli Bhajani|150|500g|🌾","Thalipeeth Bhajani|150|500g|🌾","Multigrain Flour|110|1kg|🌾","Ragi Flour|100|1kg|🌾","Jowar Flour|90|1kg|🌾",
      "Bajra Flour|90|1kg|🌾","Rice Flour|80|1kg|🍚","Besan|120|1kg|🟡","Wheat Flour|70|1kg|🌾","Sprouted Multigrain Flour|140|1kg|🌱" ] }] },
  { slug: "masalas", name: "Masalas", emoji: "🧂", hue: 15, blurb: "Freshly ground masalas and spice blends.",
    groups: [{ name: "Masalas & Spice Blends", items: [
      "Goda Masala|160|200g|🟤","Garam Masala|180|200g|🟤","Kala Masala|170|200g|⚫","Misal Masala|160|200g|🌶️","Pav Bhaji Masala|140|200g|🍅",
      "Chole Masala|140|200g|🟤","Biryani Masala|170|200g|🍛","Jeera Powder|130|200g|🟤","Turmeric Powder|110|200g|🟡","Red Chilli Powder|130|200g|🌶️" ] }] },
  { slug: "ready-to-cook", name: "Ready-to-Cook", emoji: "🍲", hue: 60, blurb: "Instant mixes that taste like home.",
    groups: [{ name: "Ready-to-Cook Mixes", items: [
      "Sabudana Khichdi Mix|130|250g|🍲","Upma Mix|100|250g|🍲","Poha Mix|100|250g|🍲","Dosa Mix|120|500g|🥞","Idli Mix|120|500g|🍚",
      "Misal Mix|140|250g|🍛","Kanda Poha Mix|110|250g|🍲","Multigrain Dosa Mix|140|500g|🥞","Puran Poli Mix|190|500g|🫓","Appe Mix|130|500g|🧆" ] }] },
];
