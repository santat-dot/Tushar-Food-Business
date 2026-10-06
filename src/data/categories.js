import { catalog } from "./catalog.js";

const categoryImageMap = {
  "papad-fryums": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=900&auto=format&fit=crop",
  "chakli-snacks": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900&auto=format&fit=crop",
  "pickles": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=900&auto=format&fit=crop",
  "laddoos-sweets": "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=900&auto=format&fit=crop",
  "dry-fruits": "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=900&auto=format&fit=crop",
  "chutneys": "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=900&auto=format&fit=crop",
  "traditional-foods": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=900&auto=format&fit=crop",
  "healthy-foods": "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=900&auto=format&fit=crop",
  "flours-bhajani": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=900&auto=format&fit=crop",
  "masalas": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=900&auto=format&fit=crop",
  "ready-to-cook": "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=900&auto=format&fit=crop",
};

export const categories = catalog.map((c) => ({
  slug: c.slug, name: { en: c.name, hi: c.name, mr: c.name }, emoji: c.emoji, hue: c.hue, blurb: c.blurb,
  groups: c.groups.map((g) => g.name),
  count: new Set(c.groups.flatMap((g) => g.items.map((i) => i.split("|")[0]))).size,
  image: categoryImageMap[c.slug] || "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=900&auto=format&fit=crop",
}));

export function replaceCategories(nextCategories) {
  categories.splice(0, categories.length, ...nextCategories);
}

export const occasions = [
  { slug: "breakfast", name: "Breakfast", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=600" },
  { slug: "quick-lunch", name: "Quick Lunch", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600" },
  { slug: "evening-cravings", name: "Evening Cravings", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600" },
  { slug: "guests-coming", name: "Guests Coming", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600" },
  { slug: "festival", name: "Festival", image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?q=80&w=600" },
  { slug: "travel-packed", name: "Travel / Packed Food", image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=600" },
];
