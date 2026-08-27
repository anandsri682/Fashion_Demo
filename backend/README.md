# Fashion Store Backend

A production-quality REST API backend for a fashion e-commerce site, built to pair with a Next.js/React/TypeScript/Tailwind frontend.

## Overview

This backend implements the full commerce flow — registration, login, browsing, cart, checkout, orders — plus an admin side for product and order management, a dashboard, and user management. Prices, stock, and order totals are always derived server-side from the database; the client is never trusted for anything business-critical.

## Architecture

Clean layered structure — routes never contain business logic:

```
Route → Middleware (auth/validation) → Controller → Service → Model
```

- **Controllers** parse the request and shape the response; they contain no business logic.
- **Services** hold all business logic (pricing, stock checks, transactions).
- **Models** are Mongoose schemas with their own validation and hooks (e.g. password hashing).
- **Middleware** handles auth, admin checks, file upload, validation, and centralized error formatting.
- **Storage service** is an interface (`IStorageProvider`) with two implementations (local disk, Cloudinary) selected by `STORAGE_PROVIDER` — business logic never touches either implementation directly.

## Features

- JWT authentication with bcrypt password hashing
- Role-based access control (USER / ADMIN)
- Product catalog with search, filtering, sorting, pagination
- Multi-image product uploads (Multer, local-or-Cloudinary storage)
- Cart with server-verified pricing and stock
- Address book
- Wishlist
- Order placement with MongoDB transactions: stock is verified and decremented, totals are computed server-side, order items are snapshotted (so later product edits never change historical orders), the cart is cleared, and an order number + expected delivery date are generated — all atomically
- Order cancellation with automatic restocking
- Admin dashboard (revenue, order counts by status, low-stock alerts, recent activity)
- Admin order management (status updates, delivery date updates)
- Admin user management (view, deactivate, spending stats)
- Centralized error handling, consistent response envelope
- Helmet, CORS, rate limiting on auth routes, Mongo query sanitization, input validation
- Jest + Supertest test suite running against an in-memory MongoDB

## Tech Stack

Node.js · Express.js · TypeScript · MongoDB · Mongoose · JWT · bcryptjs · Multer · Cloudinary (optional) · express-validator · Jest/Supertest

## Folder Structure

```
backend/
├── src/
│   ├── config/       # env, database connection, cloudinary config
│   ├── controllers/  # request/response handling only
│   ├── middleware/   # auth, admin, upload, validation, error handling
│   ├── models/       # Mongoose schemas
│   ├── routes/       # route definitions
│   ├── services/     # business logic, incl. storage/ provider abstraction
│   ├── utils/        # jwt, pagination, order numbers, delivery dates, ApiError
│   ├── validators/   # express-validator chains
│   ├── types/        # ambient TypeScript declarations
│   ├── seed/         # seedAdmin.ts, seed.ts
│   ├── app.ts         # Express app assembly
│   └── server.ts      # entrypoint — connects DB, starts server
├── tests/             # Jest + Supertest
├── uploads/           # local image storage (dev)
├── postman/           # Postman collection
├── .env.example
├── API.md
└── README.md
```

## Requirements

- Node.js 18+
- MongoDB running locally (or a connection string to a remote instance)

## MongoDB Setup

Install and run MongoDB locally, then confirm it's reachable at:
```
mongodb://127.0.0.1:27017
```
The app will create the `fashion_store` database automatically on first connection.

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/fashion_store
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
DEFAULT_DELIVERY_DAYS=7
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STORAGE_PROVIDER=local
ADMIN_EMAIL=admin@fashionstore.com
ADMIN_PASSWORD=ChangeMe123!
ADMIN_FIRST_NAME=Store
ADMIN_LAST_NAME=Admin
```

## Installation

```bash
npm install
cp .env.example .env
```

## Development

```bash
npm run dev
```

Server: `http://localhost:5000`
API base: `http://localhost:5000/api`
Health check: `http://localhost:5000/api/health`

## Production Build

```bash
npm run build
npm start
```

## Admin Creation

Create the initial admin account safely (idempotent — running it again won't create duplicates):

```bash
npm run seed:admin
```

Uses `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.

## Database Seed (optional)

A small set of sample products for local development/demo purposes:

```bash
npm run seed
```

This is entirely optional — products created through the admin panel behave identically to seeded ones, and the app works fine with zero seed data.

## Testing

```bash
npm test
```

Runs the Jest/Supertest suite against an in-memory MongoDB instance (`mongodb-memory-server`) — no real database needed for tests. Covers registration/login, admin-only product creation, stock-checked cart/order flows, order ownership isolation, and admin status/delivery-date updates.

## API Documentation

See [`API.md`](./API.md) for every endpoint, request/response shapes, and error codes.

## Postman Collection

Import [`postman/fashion-store.postman_collection.json`](./postman/fashion-store.postman_collection.json). It uses collection variables:

- `baseUrl` — defaults to `http://localhost:5000/api`
- `token` — set automatically after a successful user login request
- `adminToken` — set automatically after a successful admin login request

## Frontend Connection

The Next.js frontend should set:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

CORS is restricted to `CLIENT_URL` (default `http://localhost:3000`) — update this if the frontend runs elsewhere.

## Image Upload Configuration

By default (`STORAGE_PROVIDER=local`), uploaded images are written to `uploads/` and served statically at `http://localhost:5000/uploads/...`.

To use Cloudinary instead, set:
```
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```
No controller or service code needs to change — the storage provider is selected once, at startup.

## Troubleshooting

**Server won't start / "Failed to connect to MongoDB"**
Confirm MongoDB is running and `MONGO_URI` is correct. The server intentionally refuses to start if the database connection fails.

**401 on every request**
Check the `Authorization: Bearer <token>` header is present and the token hasn't expired (`JWT_EXPIRES_IN`).

**403 on admin routes**
The authenticated user's `role` must be `ADMIN` in the database — role can never be set via request body/query/params.

**Image upload fails**
Only JPEG/JPG/PNG/WEBP are accepted, up to 5MB each, max 6 files per product.

**CORS errors from the frontend**
Make sure `CLIENT_URL` in `.env` exactly matches the frontend's origin (including port).
