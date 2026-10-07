import "dotenv/config";
import cors from "cors";
import { randomUUID } from "node:crypto";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Category, FoodItem, GalleryItem, Order } from "./models.js";
import { loginAdmin, requireAdmin } from "./auth.js";
import { idOf, toAdminCategory, toAdminFood, toAdminOrder, toPublicCategory, toPublicFood, toPublicOrder } from "./serializers.js";
import { categories as seedCategories } from "../../src/data/categories.js";
import { products as seedProducts } from "../../src/data/products.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const directory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(directory, "../uploads");
const admin = express.Router();
const origins = (process.env.CLIENT_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: origins }));
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(uploadDirectory, { maxAge: "1d", fallthrough: false }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many sign-in attempts. Please try again later." },
});

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) {
      return callback(new Error("Only image and video uploads are allowed."));
    }
    return callback(null, true);
  },
});

const slugify = (value) => value.toLowerCase().trim()
  .replace(/&/g, "and")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
const fail = (status, message) => Object.assign(new Error(message), { status });
const route = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const optionalString = (value, fallback = "") => typeof value === "string" ? value.trim() : fallback;

async function seedCatalog() {
  if (await Category.countDocuments() === 0) {
    await Category.insertMany(seedCategories.map((category) => ({
      _id: category.slug,
      name: category.name,
      emoji: category.emoji,
      hue: category.hue,
      blurb: category.blurb,
      groups: category.groups,
      image: category.image,
    })));
  }

  const migrations = mongoose.connection.collection("catalog_migrations");
  const starterCatalogMigration = "starter-catalog-30";
  if (!await migrations.findOne({ _id: starterCatalogMigration })) {
    const seedNames = seedProducts.map((product) => product.name);
    const pruned = await FoodItem.deleteMany({
      _id: /^c\d+$/,
      name: { $nin: seedNames },
    });
    if (pruned.deletedCount > 0) {
      console.log(`Removed ${pruned.deletedCount} retired seeded food items.`);
    }

    await Category.bulkWrite(seedCategories.map((category) => ({
      updateOne: {
        filter: { _id: category.slug },
        update: { $set: { groups: category.groups } },
      },
    })));
    await FoodItem.bulkWrite(seedProducts.map((product) => ({
      updateOne: {
        filter: { _id: /^c\d+$/, name: product.name },
        update: {
          $set: {
            category: product.category,
            categories: product.categories,
            groups: product.groups,
          },
        },
      },
    })));
    await migrations.insertOne({ _id: starterCatalogMigration, appliedAt: new Date() });
  }

  if (await FoodItem.countDocuments() === 0) {
    await FoodItem.insertMany(seedProducts.map((product) => ({
      ...product,
      _id: product.id,
      category: product.category,
    })));
  }
}

app.get("/health", (_req, res) => {
  res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
    status: mongoose.connection.readyState === 1 ? "ok" : "database_unavailable",
  });
});

app.post("/admin/auth/login", loginLimiter, route(loginAdmin));

app.get("/catalog", route(async (_req, res) => {
  const [storedCategories, storedProducts] = await Promise.all([
    Category.find().sort({ createdAt: 1 }).lean(),
    FoodItem.find().sort({ createdAt: 1 }).lean(),
  ]);
  const counts = new Map();
  storedProducts.forEach((product) => {
    (product.categories?.length ? product.categories : [product.category]).forEach((slug) => {
      counts.set(slug, (counts.get(slug) || 0) + 1);
    });
  });
  res.json({
    categories: storedCategories.map((category) => toPublicCategory(category, counts.get(idOf(category)) || 0)),
    products: storedProducts.map(toPublicFood),
  });
}));

app.post("/orders", route(async (req, res) => {
  const body = req.body ?? {};
  const orderId = optionalString(body.id);
  const customerName = optionalString(body.customer);
  if (!orderId || !customerName || !Array.isArray(body.items) || body.items.length === 0) {
    throw fail(400, "Order ID, customer name, and at least one item are required.");
  }

  const items = body.items.map((item) => {
    const quantity = Number(item.qty);
    const price = Number(item.price);
    if (!optionalString(item.name) || !Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(price) || price < 0) {
      throw fail(400, "Order items must have a name, positive whole-number quantity, and valid price.");
    }
    return {
      productId: optionalString(item.productId),
      foodName: optionalString(item.name),
      quantity,
      price,
      subtotal: Math.round(quantity * price * 100) / 100,
    };
  });

  const order = await Order.create({
    _id: orderId,
    customerName,
    phone: optionalString(body.phone),
    address: optionalString(body.address),
    slot: optionalString(body.slot),
    payment: optionalString(body.payment),
    instructions: optionalString(body.instructions),
    status: "PENDING",
    totalPrice: Number(body.total) || items.reduce((sum, item) => sum + item.subtotal, 0),
    savings: Number(body.savings) || 0,
    items,
  });
  res.status(201).json(toPublicOrder(order));
}));

app.get("/orders/:orderId/status", route(async (req, res) => {
  const order = await Order.findById(req.params.orderId).lean();
  if (!order) throw fail(404, "Order not found.");
  res.json({ id: idOf(order), date: order.date, status: order.status.toLowerCase() });
}));

admin.post("/auth/logout", (_req, res) => res.status(204).end());
admin.use(requireAdmin);

admin.get("/category", route(async (_req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 }).lean();
  res.json(categories.map(toAdminCategory));
}));

admin.post("/category", route(async (req, res) => {
  const categoryName = optionalString(req.body?.categoryName);
  if (!categoryName) throw fail(400, "Category name is required.");
  const id = slugify(categoryName);
  if (!id) throw fail(400, "Category name must include letters or numbers.");
  if (await Category.exists({ _id: id })) throw fail(409, "A category with this name already exists.");
  const category = await Category.create({
    _id: id,
    name: { en: categoryName, hi: categoryName, mr: categoryName },
    emoji: "🍽️",
    hue: 35,
    blurb: `Browse ${categoryName.toLowerCase()} from Tushar Food Business.`,
    groups: [],
    image: optionalString(req.body?.imageUrl),
  });
  res.status(201).json(toAdminCategory(category));
}));

admin.put("/category/:id", route(async (req, res) => {
  const categoryName = optionalString(req.body?.categoryName);
  if (!categoryName) throw fail(400, "Category name is required.");
  const category = await Category.findByIdAndUpdate(req.params.id, {
    $set: {
      "name.en": categoryName,
      "name.hi": categoryName,
      "name.mr": categoryName,
      image: optionalString(req.body?.imageUrl),
    },
  }, { new: true, runValidators: true });
  if (!category) throw fail(404, "Category not found.");
  res.json(toAdminCategory(category));
}));

admin.delete("/category/:id", route(async (req, res) => {
  const categoryId = req.params.id;
  const items = await FoodItem.find({
    $or: [{ category: categoryId }, { categories: categoryId }],
  }).lean();
  const replacementCategoryId = optionalString(req.body?.replacementCategoryId);

  if (items.length && !replacementCategoryId) {
    throw fail(409, "This category still has food items. Choose another category to move them before deleting.");
  }

  if (items.length) {
    if (replacementCategoryId === categoryId) {
      throw fail(400, "Choose a different category for these food items.");
    }
    if (!await Category.exists({ _id: replacementCategoryId })) {
      throw fail(404, "The replacement category was not found.");
    }

    await FoodItem.bulkWrite(items.map((item) => {
      const categories = item.categories?.length ? item.categories : [item.category];
      const movedCategories = [...new Set(
        categories.map((id) => id === categoryId ? replacementCategoryId : id),
      )];
      if (!movedCategories.includes(replacementCategoryId)) movedCategories.push(replacementCategoryId);

      return {
        updateOne: {
          filter: { _id: item._id },
          update: {
            $set: {
              category: item.category === categoryId ? replacementCategoryId : item.category,
              categories: movedCategories,
              groups: (item.groups || []).map((group) => (
                group?.category === categoryId
                  ? { ...group, category: replacementCategoryId }
                  : group
              )),
            },
          },
        },
      };
    }));

    if (await FoodItem.exists({ $or: [{ category: categoryId }, { categories: categoryId }] })) {
      throw fail(409, "Some food items could not be moved. The category was not deleted.");
    }
  }
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) throw fail(404, "Category not found.");
  res.status(204).end();
}));

admin.get("/food", route(async (_req, res) => {
  const items = await FoodItem.find().sort({ createdAt: -1 }).lean();
  const categories = await Category.find({ _id: { $in: items.map((item) => item.category) } }).lean();
  const categoryById = new Map(categories.map((category) => [idOf(category), category]));
  res.json(items.map((item) => toAdminFood(item, categoryById.get(item.category))));
}));

admin.post("/food/category/:categoryId", route(async (req, res) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) throw fail(404, "Choose an existing category before adding a food item.");

  const name = optionalString(req.body?.foodName);
  const price = Number(req.body?.price);
  if (!name || !Number.isFinite(price) || price < 0) {
    throw fail(400, "Food name and a valid non-negative price are required.");
  }
  const id = randomUUID();
  const item = await FoodItem.create({
    _id: id,
    slug: slugify(name) || id,
    name,
    category: idOf(category),
    categories: [idOf(category)],
    groups: category.groups?.length ? [{ category: idOf(category), group: category.groups[0] }] : [],
    description: optionalString(req.body?.description),
    mrp: price,
    price,
    originalPrice: null,
    weight: optionalString(req.body?.weight),
    availability: "available",
    stock: 0,
    dietary: ["vegetarian"],
    emoji: optionalString(req.body?.emoji, "🍽️"),
    hue: category.hue,
    images: optionalString(req.body?.imageUrl) ? [optionalString(req.body.imageUrl)] : [],
  });
  res.status(201).json(toAdminFood(item, category));
}));

admin.put("/food/:id", route(async (req, res) => {
  const update = {};
  let assignedCategory = null;
  if (req.body?.foodName !== undefined) {
    const name = optionalString(req.body.foodName);
    if (!name) throw fail(400, "Food name cannot be empty.");
    update.name = name;
    update.slug = slugify(name);
  }
  if (req.body?.description !== undefined) update.description = optionalString(req.body.description);
  if (req.body?.price !== undefined) {
    const price = Number(req.body.price);
    if (!Number.isFinite(price) || price < 0) throw fail(400, "Enter a valid non-negative price.");
    update.price = price;
    update.mrp = price;
    update.originalPrice = null;
  }
  if (req.body?.imageUrl !== undefined) {
    const imageUrl = optionalString(req.body.imageUrl);
    update.images = imageUrl ? [imageUrl] : [];
  }
  if (req.body?.categoryId !== undefined) {
    const categoryId = optionalString(req.body.categoryId);
    if (!categoryId) throw fail(400, "Choose a category.");
    assignedCategory = await Category.findById(categoryId).lean();
    if (!assignedCategory) throw fail(404, "Category not found.");
    update.category = categoryId;
    update.categories = [categoryId];
    update.groups = assignedCategory.groups?.length
      ? [{ category: categoryId, group: assignedCategory.groups[0] }]
      : [];
    update.hue = assignedCategory.hue;
  }
  const item = await FoodItem.findByIdAndUpdate(req.params.id, { $set: update }, { new: true, runValidators: true });
  if (!item) throw fail(404, "Food item not found.");
  const category = assignedCategory || await Category.findById(item.category).lean();
  res.json(toAdminFood(item, category));
}));

admin.delete("/food/:id", route(async (req, res) => {
  const item = await FoodItem.findByIdAndDelete(req.params.id);
  if (!item) throw fail(404, "Food item not found.");
  res.status(204).end();
}));

admin.get("/order", route(async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: 1 }).lean();
  res.json(orders.map(toAdminOrder));
}));

admin.get("/order/status/:status", route(async (req, res) => {
  const status = req.params.status.toUpperCase();
  if (!["PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"].includes(status)) {
    throw fail(400, "Unsupported order status.");
  }
  const orders = await Order.find({ status }).sort({ createdAt: 1 }).lean();
  res.json(orders.map(toAdminOrder));
}));

admin.put("/order/:id/status/:status", route(async (req, res) => {
  const status = req.params.status.toUpperCase();
  if (!["PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"].includes(status)) {
    throw fail(400, "Unsupported order status.");
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!order) throw fail(404, "Order not found.");
  res.json(toAdminOrder(order));
}));

admin.delete("/order/:id", route(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw fail(404, "Order not found.");
  res.status(204).end();
}));

admin.get("/gallery", route(async (_req, res) => {
  const items = await GalleryItem.find().sort({ createdAt: -1 }).lean();
  res.json(items.map((item) => ({
    id: idOf(item),
    title: item.title,
    mediaType: item.mediaType,
    mediaUrl: item.mediaUrl,
  })));
}));

admin.post("/gallery/upload", upload.single("file"), route(async (req, res) => {
  if (!req.file) throw fail(400, "Select an image or video file to upload.");
  const title = optionalString(req.body?.title);
  const mediaType = optionalString(req.body?.mediaType);
  const correctType = mediaType === "image"
    ? req.file.mimetype.startsWith("image/")
    : mediaType === "video" && req.file.mimetype.startsWith("video/");
  if (!title || !correctType) {
    await import("node:fs/promises").then(({ unlink }) => unlink(req.file.path).catch(() => {}));
    throw fail(400, "Provide a title and a file matching the selected media type.");
  }
  const mediaUrl = `${req.protocol}://${req.get("host")}/uploads/${encodeURIComponent(req.file.filename)}`;
  const item = await GalleryItem.create({ title, mediaType, mediaUrl, filename: req.file.filename });
  res.status(201).json({ id: idOf(item), title: item.title, mediaType: item.mediaType, mediaUrl: item.mediaUrl });
}));

admin.delete("/gallery/:id", route(async (req, res) => {
  const item = await GalleryItem.findByIdAndDelete(req.params.id);
  if (!item) throw fail(404, "Gallery item not found.");
  const { unlink } = await import("node:fs/promises");
  await unlink(path.join(uploadDirectory, item.filename)).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
  res.status(204).end();
}));

app.use("/admin", admin);
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }));
app.use((error, _req, res, _next) => {
  const status = error.status
    || (error instanceof multer.MulterError ? 400 : 0)
    || (error.name === "ValidationError" || error.name === "CastError" ? 400 : 500);
  const message = error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
    ? "Media files must be 10MB or smaller."
    : status === 500 ? "The server could not complete the request." : error.message;
  if (status === 500) console.error("API request failed:", error);
  res.status(status).json({ message });
});

await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tushar_food_business");
await seedCatalog();
app.listen(port, () => {
  console.log(`Tushar Food Business API listening on port ${port}`);
});
