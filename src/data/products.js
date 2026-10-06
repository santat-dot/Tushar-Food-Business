import { catalog } from "./catalog.js";
import { bestOfferFor } from "./offers.js";

const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Generated, offline product artwork (SVG data-URI): gradient + emoji + name.
export function productArt(name, emoji, hue) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},75%,90%)"/><stop offset="1" stop-color="hsl(${(hue + 18) % 360},60%,76%)"/></linearGradient></defs>
<rect width="800" height="600" fill="url(#g)"/><circle cx="650" cy="90" r="190" fill="#fff" opacity=".28"/><circle cx="90" cy="540" r="150" fill="#fff" opacity=".22"/>
<text x="400" y="320" font-size="210" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">${emoji}</text>
<text x="400" y="480" font-size="44" text-anchor="middle" font-family="Georgia,serif" fill="hsl(${hue},45%,22%)">${name.replace(/&/g, "&amp;")}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

const byName = new Map();
const list = [];
let n = 0;
catalog.forEach((cat) => {
  cat.groups.forEach((group) => {
    group.items.forEach((row) => {
      const [name, price, weight, emoji] = row.split("|");
      const key = name.toLowerCase();
      const existing = byName.get(key);
      if (existing) { // item listed in several sections -> one product, shown in each
        if (!existing.categories.includes(cat.slug)) existing.categories.push(cat.slug);
        existing.groups.push({ category: cat.slug, group: group.name });
        return;
      }
      n += 1;
      const seed = n * 37;
      const p = {
        id: `c${n}`, slug: slugify(name), name, category: cat.slug, categories: [cat.slug],
        groups: [{ category: cat.slug, group: group.name }],
        description: `${name} — ${cat.blurb.replace(/\.$/, "")}. Small-batch, homemade-style and freshly packed.`,
        mrp: Number(price), price: Number(price), originalPrice: null, weight,
        rating: +(4.3 + ((seed % 7) / 10)).toFixed(1), reviewCount: 18 + (seed % 190),
        availability: "available", stock: 12 + (seed % 60),
        badge: n % 9 === 0 ? "Bestseller" : n % 13 === 0 ? "New" : null, isNew: n % 13 === 0,
        dietary: ["vegetarian"], emoji, hue: cat.hue,
        images: [productArt(name, emoji, cat.hue)],
        story: `Made in small batches with traditional methods — ${name.toLowerCase()} the way it is made at home.`,
        ingredients: ["Natural ingredients", "No artificial colour", "No preservatives"],
        storage: "Store in a cool, dry place in an airtight container.",
        shelfLife: "Best before 3 months from packing",
      };
      byName.set(key, p);
      list.push(p);
    });
  });
});

// A few realistic availability states so the badges stay meaningful
const overrides = { "Mango Pickle": ["sold-out", 0], "Pistachios": ["low-stock", 4], "Dry Fruit Ladoo": ["low-stock", 3], "Puran Poli Mix": ["limited", 6], "Karanji": ["preorder", 0] };
Object.entries(overrides).forEach(([name, [availability, stock]]) => {
  const p = byName.get(name.toLowerCase());
  if (p) { p.availability = availability; p.stock = stock; if (availability === "preorder") { p.preorderDate = "Oct 20"; p.expectedDelivery = "Oct 24"; } }
});

// Apply live festival discounts
list.forEach((p) => {
  const offer = bestOfferFor(p);
  if (offer) {
    p.offer = { id: offer.id, title: offer.title, percent: offer.percent, emoji: offer.emoji };
    p.price = Math.round(p.mrp * (1 - offer.percent / 100));
    p.originalPrice = p.mrp;
  }
});

export const products = list;
export function replaceProducts(nextProducts) {
  products.splice(0, products.length, ...nextProducts.map((product) => ({
    ...product,
    categories: product.categories?.length ? product.categories : [product.category],
    images: product.images?.length ? product.images : [productArt(product.name, product.emoji || "🍽️", product.hue || 35)],
  })));
}
export const getProductBySlug = (slug) => products.find((p) => p.slug === slug);
export const getProductById = (id) => products.find((p) => p.id === id);
export const productsInCategory = (slug) => products.filter((p) => p.categories.includes(slug));
export const getRelatedProducts = (product, count = 4) =>
  products.filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c))).slice(0, count);
