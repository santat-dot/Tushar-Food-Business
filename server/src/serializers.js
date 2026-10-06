export const idOf = (document) => document._id.toString();

export function toAdminCategory(category) {
  return { id: idOf(category), categoryName: category.name.en, imageUrl: category.image };
}

export function toPublicCategory(category, count = 0) {
  return {
    slug: idOf(category),
    name: typeof category.name === "string"
      ? { en: category.name, hi: category.name, mr: category.name }
      : category.name,
    emoji: category.emoji,
    hue: category.hue,
    blurb: category.blurb,
    groups: category.groups,
    count,
    image: category.image,
  };
}

export function toAdminFood(item, category) {
  return {
    id: idOf(item),
    foodName: item.name,
    description: item.description,
    price: item.price,
    imageUrl: item.images?.[0] || "",
    category: category ? toAdminCategory(category) : null,
  };
}

export function toPublicFood(item) {
  return {
    id: idOf(item),
    slug: item.slug,
    name: item.name,
    category: item.category,
    categories: item.categories?.length ? item.categories : [item.category],
    groups: item.groups || [],
    description: item.description,
    mrp: item.mrp ?? item.price,
    price: item.price,
    originalPrice: item.originalPrice ?? null,
    weight: item.weight,
    rating: item.rating ?? 0,
    reviewCount: item.reviewCount ?? 0,
    availability: item.availability,
    stock: item.stock ?? 0,
    badge: item.badge ?? null,
    isNew: Boolean(item.isNew),
    dietary: item.dietary || [],
    emoji: item.emoji || "🍽️",
    hue: item.hue ?? 35,
    images: item.images || [],
    offer: item.offer || null,
    story: item.story || "",
    ingredients: item.ingredients || [],
    storage: item.storage || "",
    shelfLife: item.shelfLife || "",
  };
}

export function toAdminOrder(order) {
  return {
    id: idOf(order),
    customerName: order.customerName,
    phone: order.phone,
    address: order.address,
    slot: order.slot,
    payment: order.payment,
    instructions: order.instructions,
    date: order.date,
    createdAt: order.createdAt,
    status: order.status,
    totalPrice: order.totalPrice,
    items: order.items,
  };
}

export function toPublicOrder(order) {
  const status = order.status.toLowerCase();
  return {
    id: idOf(order),
    date: order.date,
    status: status === "pending" ? "placed" : status,
    total: order.totalPrice,
    payment: order.payment,
    address: order.address,
    slot: order.slot,
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.foodName,
      qty: item.quantity,
      price: item.price,
    })),
  };
}
