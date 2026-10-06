import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema({
  _id: { type: String, required: true },
  name: { type: Schema.Types.Mixed, required: true },
  emoji: { type: String, default: "🍽️" },
  hue: { type: Number, default: 35 },
  blurb: { type: String, default: "" },
  groups: { type: [String], default: [] },
  image: { type: String, default: "" },
}, { timestamps: true, strict: false });

const foodItemSchema = new Schema({
  _id: { type: String, required: true },
  slug: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  categories: { type: [String], default: [] },
  groups: { type: [Schema.Types.Mixed], default: [] },
  description: { type: String, default: "" },
  mrp: { type: Number, default: 0, min: 0 },
  price: { type: Number, default: 0, min: 0 },
  originalPrice: { type: Number, default: null, min: 0 },
  weight: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  availability: { type: String, default: "available" },
  stock: { type: Number, default: 0, min: 0 },
  badge: { type: String, default: null },
  dietary: { type: [String], default: [] },
  emoji: { type: String, default: "🍽️" },
  hue: { type: Number, default: 35 },
  images: { type: [String], default: [] },
  story: { type: String, default: "" },
  ingredients: { type: [String], default: [] },
  storage: { type: String, default: "" },
  shelfLife: { type: String, default: "" },
}, { timestamps: true, strict: false });

const orderItemSchema = new Schema({
  productId: String,
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 },
}, { _id: false });

const orderSchema = new Schema({
  _id: { type: String, required: true },
  customerName: { type: String, required: true },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  slot: { type: String, default: "" },
  payment: { type: String, default: "" },
  instructions: { type: String, default: "" },
  date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  status: { type: String, default: "PENDING", enum: ["PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"] },
  totalPrice: { type: Number, default: 0, min: 0 },
  savings: { type: Number, default: 0, min: 0 },
  items: { type: [orderItemSchema], default: [] },
}, { timestamps: true });

const gallerySchema = new Schema({
  title: { type: String, required: true, trim: true },
  mediaType: { type: String, enum: ["image", "video"], required: true },
  mediaUrl: { type: String, required: true },
  filename: { type: String, required: true },
}, { timestamps: true });

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export const FoodItem = mongoose.models.FoodItem || mongoose.model("FoodItem", foodItemSchema);
export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export const GalleryItem = mongoose.models.GalleryItem || mongoose.model("GalleryItem", gallerySchema);
