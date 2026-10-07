# Tushar Food Business API

The Express API and MongoDB database are shared by the customer storefront and the standalone admin panel.
A fresh database is seeded with the 30-item starter catalog. On an existing database, a one-time migration
removes retired seeded items and updates the starter products' category assignments. It preserves admin-added
products and saved orders.

## Local setup

1. Install dependencies from the repository root with `npm install`, then install the API dependencies with
   `npm install --prefix server`.
2. Copy `server/.env.example` to `server/.env`. Set a long, unique `JWT_SECRET` and a private
   `ADMIN_USERNAME` / `ADMIN_PASSWORD`. Keep this file out of source control.
   For a trusted local development machine only, set `ADMIN_AUTH_DISABLED=true` to open the local
   admin panel without signing in. The API ignores this setting in production; never enable it on a
   publicly reachable development server.
3. Ensure MongoDB is running and set `MONGODB_URI` if it is not available at the example local address.
4. Start the API with `npm run api:dev`.
5. In a second terminal, start the customer website with `npm run dev`.
6. In another terminal, start the standalone admin with `npm --prefix Cafe-Admin-Panel-main run dev`,
   then open `http://localhost:5174`. The Vite development admin opens directly to the dashboard.
   Production builds continue to require admin sign-in.

The customer storefront refreshes the shared catalog on initial load, when it regains focus, and every 15 seconds.
The browser catalog remains available as a read-only fallback if the API cannot be reached. Checkout requires the
API so that customer orders appear in admin order management.

Set `VITE_API_BASE_URL` in the repository root `.env.local` when the customer website needs an API host other
than `http://localhost:3001`. Set the same variable in
`Cafe-Admin-Panel-main/.env.local` with `/admin` appended for the standalone admin.

## API behavior

- `/catalog` returns the public categories and food items used by the customer-facing pages.
- `/orders` accepts customer checkout orders, and `/orders/:id/status` returns the public tracking status only.
- `/admin/auth/login` issues an expiring JWT. All other `/admin/*` routes require that bearer token.
- Admin CRUD endpoints cover categories, food items, orders, and gallery uploads.
- Food items can be reassigned to another category in the admin; the category page displays live item counts.
- A category cannot be removed while it still has food items; remove or reassign its items first.
- Gallery uploads are limited to 10 MB and stored in `server/uploads`.
