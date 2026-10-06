# Tushar Food Business API

The Express API and MongoDB database are shared by the customer storefront and the standalone admin panel.
The first API startup seeds the database from the existing storefront catalog only when the category or food
collection is empty.

## Local setup

1. Install dependencies from the repository root with `npm install`, then install the API dependencies with
   `npm install --prefix server`.
2. Copy `server/.env.example` to `server/.env`. Set a long, unique `JWT_SECRET` and a private
   `ADMIN_USERNAME` / `ADMIN_PASSWORD`. Keep this file out of source control.
3. Ensure MongoDB is running and set `MONGODB_URI` if it is not available at the example local address.
4. Start the API with `npm run api:dev`.
5. In a second terminal, start the customer website with `npm run dev`.
6. In another terminal, start the standalone admin with `npm --prefix Cafe-Admin-Panel-main run dev`,
   then sign in at `http://localhost:5174/login`.

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
- A category cannot be removed while it still has food items; remove or reassign its items first.
- Gallery uploads are limited to 10 MB and stored in `server/uploads`.
