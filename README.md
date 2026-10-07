# Tushar Food — Packaged Food Store (v3)

Run: `npm install` then `npm run dev` (or `npm run build`).

## What's new
- **Landing page = shop**: `/` shows the 30-item starter catalog, section by section, with 11 categories
  (Papad & Fryums, Chakli & Snacks, Pickles, Laddoos & Sweets, Dry Fruits, Chutneys, Traditional Foods,
  Healthy Foods, Flours & Bhajani, Masalas, Ready-to-Cook). The initial category allocation is 3, 4, 3, 4, 3,
  2, 3, 2, 2, 2, and 2 items respectively. Category pages have sub-group filters, and the admin lets you
  reassign products and see each category's live item count. The starter list lives in `src/data/catalog.js`.
- **No login gate for prototype**: browsing, cart, and checkout all work without any sign-in or sign-up flow.
- **Address saved once**: available in the account area for prototype convenience and reused automatically at checkout. Manage in *Account → Addresses*.
- **Reorder for bulk buyers**: *Reorder now* (straight to checkout), *Edit & reorder*, "Order again" strip on the
  home page, and named **saved bulk lists** (Account → Orders). Items use today's price/availability.
- **Discounts**: `/offers` page, announcement bar, offer badges on products, festival offers applied automatically
  (edit dates/percentages in `src/data/offers.js`), coupons (`HOME10`, `WELCOME10`) and automatic bulk discounts
  (5% over ₹2,000, 10% over ₹5,000).

## Note
The storefront and standalone admin share the Node/Express API in `server/`, backed by MongoDB. Categories
and food items managed in the admin are reflected in the storefront; checkout orders are saved by the API
and their status can be updated from the admin. Customer account/session data is still stored in the browser
(localStorage), and this setup does not provide payment processing. Follow [server/README.md](./server/README.md)
to configure the API and admin credentials before running locally or deploying. Product images are generated
artwork; replace `images` per product in `src/data/products.js` with real photos.

## Deploy storefront, admin, and API separately

This repository is a monorepo with three deployable applications. Deploy the customer storefront and admin
as separate Vercel projects, and deploy the Express API as a Render web service. Both frontends use the same
API and MongoDB database.

### 1. Deploy the API on Render

1. Create a MongoDB database (for example, MongoDB Atlas) and copy its connection URI.
2. In Render, create a Blueprint from this repository and select the root `render.yaml`. Render uses the
   `server/` directory and configures the API health check at `/health`.
3. Set the prompted environment variables: `MONGODB_URI`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and
   `CLIENT_ORIGINS`. Render generates `JWT_SECRET` from the Blueprint; keep it private.
4. Set `CLIENT_ORIGINS` to the exact, comma-separated HTTPS origins of the storefront and admin once their
   Vercel URLs are known, for example `https://store.example.com,https://admin.example.com`.
5. Deploy and verify that `https://<your-api>.onrender.com/health` reports `"status":"ok"`.

Do not commit `.env` files, database URIs, or admin credentials. Use Render's environment settings for
secrets. A fresh database starts with the 30-item catalog. The API also applies a one-time migration to remove
retired seeded items from an existing catalog while preserving admin-added products and saved orders.

### 2. Deploy the customer storefront on Vercel

Create a Vercel project from this repository with:

- **Root Directory:** repository root (`.`)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:** `VITE_API_BASE_URL=https://<your-api>.onrender.com`

The root `vercel.json` rewrites client-side routes to the storefront entry point.

### 3. Deploy the standalone admin panel on Vercel

Create a second Vercel project from the same repository with:

- **Root Directory:** `Cafe-Admin-Panel-main`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:** `VITE_API_BASE_URL=https://<your-api>.onrender.com/admin`

The admin directory's `vercel.json` rewrites client-side routes to its entry point. Sign in using the
`ADMIN_USERNAME` and `ADMIN_PASSWORD` configured on Render.

The legacy demo admin routes have been removed from the customer storefront. Use only the standalone admin
project for catalog and order management.

### Local development

See [server/README.md](./server/README.md) for local API configuration and commands. The Vercel environment
variables above should only be configured in the hosting dashboards; local `.env` files remain untracked.
