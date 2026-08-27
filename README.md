# Maison Noir — Fashion E-Commerce Frontend

A complete, production-quality fashion e-commerce **frontend** built for a
client demo. It is designed to be dropped in front of a separate
**Node.js + Express + MongoDB** backend with minimal changes.

---

## 1. Overview

This project implements the full customer shopping journey (browse → product
detail → cart → checkout → order confirmation → order tracking) plus a
separate **Admin Studio** for managing products, orders, and users.

Everything runs today on an in-memory **mock data layer** so the demo works
with zero backend setup. Every data operation is already routed through a
`src/services/*` API client, so pointing the app at a real backend is a
one-line change per service (see [Connecting the backend](#6-connecting-the-backend)).

## 2. Features

**Customer storefront**
- Home page: hero, category strip, new arrivals / trending / featured /
  best-seller rails, promo banner, newsletter signup
- Product listing with search, category/size/price filters, sorting, and
  "Load more" pagination — shared across `/products`, `/men`, `/women`,
  `/new-arrivals`, `/collections/[slug]`
- Product details: image gallery with fullscreen viewer, size/color/quantity
  selection, related products, details/shipping tabs
- Cart drawer + full cart page with save-for-later, quantity controls, and
  live totals (subtotal / discount / shipping / tax / grand total)
- 3-step checkout: Address → Order Summary → Payment, with a UI-only payment
  flow (no real gateway, no card data stored)
- Order success page, order history, and per-order detail page with a visual
  status timeline
- Auth: register / login / forgot-password with client-side validation,
  loading and error states
- Account dashboard, address book (add/edit/delete/set default), wishlist

**Admin Studio** (separate layout, role-gated)
- Dashboard: revenue/orders/products/users KPIs, low-stock warning, revenue &
  orders charts, top products, recent orders/customers
- Product management: searchable/filterable table, create/edit form with
  multi-image upload + preview, feature/new-arrival/active toggles, delete
- Order management: searchable/filterable table, full order detail with
  customer + delivery + financial breakdown, status update control
  (Pending → … → Delivered, or Cancelled) and editable expected delivery date
- Registered users table with per-user order count and spend

**Cross-cutting**
- Loading skeletons, empty states, and error states on every data-driven view
- Toast notifications for cart, auth, and admin actions
- Cart/auth/wishlist state persisted client-side via Zustand
- Fully responsive (mobile, tablet, desktop, large desktop)
- Framer Motion for drawers, modals, and page-level transitions

## 3. Tech Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for animation
- **Zustand** for client state (cart, auth, wishlist, toasts) with
  `localStorage` persistence
- **Lucide React** for icons

## 4. Folder Structure

```
src/
  app/
    (site)/                 # customer-facing routes (shares Navbar/Footer layout)
      page.tsx               # home
      products/, men/, women/, new-arrivals/, collections/[slug]/
      products/[id]/          # product details
      search/, cart/, checkout/, order-success/[orderId]/
      login/, register/, forgot-password/
      account/                # account layout + overview/orders/addresses/settings
      wishlist/
    admin/                   # admin routes (separate layout, ADMIN-only)
      page.tsx                # dashboard
      products/, products/new/, products/[id]/edit/
      orders/, orders/[id]/
      users/, settings/
  components/
    layout/                  # Navbar, Footer, CartDrawer, MobileMenu, SearchOverlay
    product/                 # ProductCard, ProductGrid, ProductGallery, ProductFilters, ProductListing
    cart/                    # CartSummary
    checkout/                # AddressForm, AddressSelector, StepIndicator, PaymentMethodSelector
    order/                   # OrderCard, OrderTimeline
    admin/                   # AdminSidebar, AdminNavbar, DashboardCard, BarChart, ProductForm, ProductTable, OrderTable
    ui/                      # Button, Input, Select, Badge, Modal, Toaster, Skeletons, EmptyState, ErrorState
  services/                  # authService, productService, cartService, orderService, adminService
  lib/                       # api.ts (central fetch client), format.ts, validation.ts, cn.ts
  store/                     # cartStore, authStore, wishlistStore, toastStore (Zustand)
  data/                      # mockData.ts — TEMPORARY, isolated from the API layer
  types/                     # shared TypeScript interfaces
  hooks/                     # useAuth, useProducts, useRequireAuth
```

## 5. Installation & Development

Requires Node.js 18.18+ (Node 20 LTS recommended).

```bash
npm install
cp .env.example .env.local   # adjust NEXT_PUBLIC_API_URL if needed
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint
```

> This container had no outbound access to the npm registry, so
> `npm install` / `npm run build` could not be executed here. Every file was
> written by hand and statically verified (see
> [Verification performed in this environment](#10-verification-performed-in-this-environment)) —
> run the commands above in an environment with network access before
> deploying.

### Demo login

The mock `authService` accepts any email/password. Logging in with an email
that **contains "admin"** (e.g. `admin@maisonnoir.com`) signs you in as an
`ADMIN` and redirects to `/admin`; any other email signs you in as a regular
customer.

## 6. Connecting the Backend

The frontend expects a Node.js + Express + MongoDB API at:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Set this in `.env.local` (never commit real secrets — `.env.example` is the
template). The value is read once, centrally, in `src/lib/api.ts`; nothing
else in the app hardcodes a backend URL.

Each file in `src/services/` has a `USE_MOCK` constant at the top:

```ts
const USE_MOCK = true; // flip to false once the endpoint below is live
```

Set it to `false` per service as each backend route becomes available — the
`apiFetch()` calls (in the `else` branch of every method) are already written
against the contract below, so no other frontend code needs to change.

### Expected API contract

**Auth**
```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/me
POST   /auth/forgot-password
POST   /auth/reset-password
```

**Products**
```
GET    /products                 (query: search, category, gender, sizes,
                                   minPrice, maxPrice, sort, page, pageSize,
                                   collection)
GET    /products/:id
GET    /products/slug/:slug
POST   /products                 (admin, multipart/form-data for images)
PUT    /products/:id             (admin)
DELETE /products/:id             (admin)
```

**Cart**
```
GET    /cart
POST   /cart
PUT    /cart/:itemId
DELETE /cart/:itemId
DELETE /cart
```

**Addresses**
```
GET    /addresses
POST   /addresses
PUT    /addresses/:id
DELETE /addresses/:id
```

**Orders**
```
POST   /orders
GET    /orders
GET    /orders/:id
POST   /orders/:id/cancel
PUT    /orders/:id/status            (admin)
PUT    /orders/:id/delivery-date     (admin)
```

**Wishlist**
```
GET    /wishlist
POST   /wishlist/:productId
DELETE /wishlist/:productId
```

**Admin**
```
GET    /admin/dashboard
GET    /admin/products
GET    /admin/orders
GET    /admin/orders/:id
GET    /admin/users
```

Order payloads sent from checkout match:

```ts
{
  userId, items, shippingAddress, billingAddress, paymentMethod,
  subtotal, discount, shipping, tax, total
}
```

**Note:** once connected, the backend should be treated as the source of
truth for order totals — it should recompute and validate `subtotal` /
`discount` / `shipping` / `tax` / `total` server-side rather than trusting
the numbers the frontend submits.

## 7. Authentication & Authorization Architecture

- `src/store/authStore.ts` (Zustand, persisted) holds the current `User`
  (never the password).
- `src/hooks/useAuth.ts` wraps `authService` for login/register/logout and
  handles redirects (admins → `/admin`, customers → their original
  destination).
- `src/hooks/useRequireAuth.ts` is a route-guard hook: `/account/*` requires
  any signed-in user; `/admin/*` requires `role === "ADMIN"`. Both redirect
  to `/login?redirect=<path>` (or `/`) when the check fails.
- This is **UX-level protection only**. The real access-control boundary is
  the backend, which must independently verify the JWT/session and role on
  every request — the frontend guard just avoids flashing protected UI.

## 8. Admin Access

Visit `/admin` after signing in with an admin-style email (see
[Demo login](#demo-login)). The admin section uses its own layout
(`src/app/admin/layout.tsx`) with `AdminSidebar` + `AdminNavbar`, entirely
separate from the customer `Navbar`/`Footer`.

## 9. Known Demo Limitations

- Product images are placeholder photography (`picsum.photos`), swapped for
  real product photography once the backend serves uploaded images.
- Payment is UI-only — no gateway is integrated, and no card data is ever
  stored or transmitted, per the spec.
- Mock data resets whenever the app reloads in a new server/browser session
  (it lives in memory + `localStorage`, not a database).

## 10. Verification performed in this environment

This container's network policy blocks `registry.npmjs.org`
(`x-deny-reason: host_not_allowed`), so `npm install`, `npm run build`, and
`npm run lint` could not actually be executed here — that must be done in a
normal dev environment before shipping. In place of a real build, the
following static checks were run against every file in `src/`:

- **Import resolution**: every `@/...` import (263 total) resolves to an
  existing file.
- **Export matching**: every named and default import matches an actual
  named/default export in its target file.
- **Brace/paren balance**: every `.tsx` file has matched `{}`/`()`.
- **`"use client"` placement**: verified as the first statement in every
  client component.
- **Route audit**: all 27 required routes confirmed present under `src/app`.
- **Manual cross-checks**: e.g. the admin "create product" payload against
  the `productService.createProduct()` signature, the checkout order payload
  against `CreateOrderPayload`, and the mock-data shapes against the shared
  `types/index.ts` interfaces.

These checks catch the most common breakages (missing files, typos in
import/export names, unclosed JSX) but are **not a substitute for a real
`tsc --noEmit` type-check and `next build`**, which will catch prop-type
mismatches and other errors these scripts can't see. Run `npm run build`
before considering this production-ready.

- Product images are placeholder photography (`picsum.photos`), swapped for
  real product photography once the backend serves uploaded images.
- Payment is UI-only — no gateway is integrated, and no card data is ever
  stored or transmitted, per the spec.
- Mock data resets whenever the app reloads in a new server/browser session
  (it lives in memory + `localStorage`, not a database).
#   F a s h i o n _ D e m o  
 