# Fashion Store API Documentation

Base URL: `http://localhost:5000/api`

All responses follow this shape:

**Success**
```json
{ "success": true, "message": "...", "...data fields": {} }
```

**Error**
```json
{ "success": false, "message": "...", "error": { "code": "SOME_CODE", "details": "optional" } }
```

Authenticated routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Health

### GET /health
No auth required.

**Response 200**
```json
{ "success": true, "message": "Fashion Store API is running", "database": "connected", "environment": "development", "uptime": 12.3 }
```

---

## Auth

### POST /auth/register
**Body**
```json
{ "firstName": "Anand", "lastName": "Raju", "email": "user@example.com", "phone": "9876543210", "password": "password123" }
```
**Response 201**: `{ success, message, user, token }`
**Errors**: `422 VALIDATION_ERROR`, `409 EMAIL_ALREADY_EXISTS`

### POST /auth/login
**Body**: `{ "email": "...", "password": "..." }`
**Response 200**: `{ success, message, user, token }`
**Errors**: `401 INVALID_CREDENTIALS`, `403 ACCOUNT_DEACTIVATED`

### POST /auth/logout
**Auth required.** Stateless — client discards the token.
**Response 200**: `{ success, message }`

### GET /auth/me
**Auth required.**
**Response 200**: `{ success, message, user }`

### POST /auth/forgot-password
**Body**: `{ "email": "..." }`
**Response 200**: generic success message (does not leak whether the email exists)

### POST /auth/reset-password
**Body**: `{ "token": "...", "password": "..." }`
**Response**: `400 NOT_IMPLEMENTED` — reserved for wiring up an email provider; out of scope for this demo.

---

## Products (Public)

### GET /products
Query params: `page, limit, search, category, gender, minPrice, maxPrice, sort (price_asc|price_desc|newest), featured, newArrival`

Example: `GET /products?page=1&limit=20&category=shirts&sort=price_asc`

**Response 200**
```json
{ "success": true, "message": "Products fetched", "products": [], "pagination": { "page":1,"limit":20,"total":100,"totalPages":5,"hasNextPage":true,"hasPreviousPage":false } }
```

### GET /products/:id
### GET /products/slug/:slug
### GET /products/category/:category
Same query params as the list endpoint.

---

## Products (Admin)

All require `Authorization` header + ADMIN role.

### POST /products
`multipart/form-data`

Fields: `title, description, category, subcategory, gender, price, originalPrice, discount, stock, sizes (CSV or JSON array), colors (CSV or JSON array), featured, newArrival, images (files, up to 6)`

**Response 201**: `{ success, message, product }`
**Errors**: `400 IMAGES_REQUIRED`, `422 VALIDATION_ERROR`, `403 Forbidden` (non-admin)

### PUT /products/:id
Same fields, all optional. New images (if attached) are appended to the update payload.

### DELETE /products/:id
Soft-deletes by default (`isActive=false`). Pass `?permanent=true` to hard-delete.

### GET /admin/products
Same as `/products` list but includes inactive products, admin-only.

---

## Cart

All require auth. A user only ever sees/modifies their own cart.

### GET /cart
### POST /cart
**Body**: `{ "productId": "...", "quantity": 2, "size": "M", "color": "Black" }`
Server re-fetches price/stock from the database — client-sent prices are never trusted.

### PUT /cart/:itemId
**Body**: `{ "quantity": 3 }`

### DELETE /cart/:itemId
### DELETE /cart
Clears the entire cart.

---

## Addresses

All require auth. Users can only access their own addresses.

### POST /addresses
```json
{ "firstName":"Jane","lastName":"Doe","phone":"9876543210","email":"jane@example.com","addressLine1":"123 Main St","addressLine2":"","city":"Hyderabad","state":"TS","country":"India","pincode":"500001","landmark":"","isDefault":true }
```
### GET /addresses
### GET /addresses/:id
### PUT /addresses/:id
### DELETE /addresses/:id

---

## Wishlist

All require auth.

### GET /wishlist
### POST /wishlist/:productId
### DELETE /wishlist/:productId

---

## Orders (User)

All require auth. Users only ever see their own orders.

### POST /orders
```json
{
  "items": [{ "productId": "...", "quantity": 2, "size": "M", "color": "Black" }],
  "shippingAddressId": "...",
  "billingAddressId": "...",
  "paymentMethod": "COD"
}
```
The backend recalculates subtotal, discount, shipping, and tax from database prices — it never trusts frontend totals. Stock is decremented, the order number and expected delivery date are generated, and the cart is cleared, all inside a single MongoDB transaction.

**Response 201**: `{ success, message, order }`
**Errors**: `400 INSUFFICIENT_STOCK`, `400 INVALID_SIZE`, `400 INVALID_COLOR`, `400 ADDRESS_NOT_FOUND`

### GET /orders
Query: `page, limit`

### GET /orders/:id
Returns `404 ORDER_NOT_FOUND` if the order doesn't belong to the requesting user.

### POST /orders/:id/cancel
Only allowed while `orderStatus` is not `SHIPPED | OUT_FOR_DELIVERY | DELIVERED | CANCELLED`. Restocks items.

---

## Admin

All require auth + ADMIN role.

### GET /admin/dashboard
Query: `from, to` (ISO date filters)

**Response 200**
```json
{
  "success": true,
  "message": "Dashboard data fetched",
  "stats": {
    "totalUsers": 0, "totalProducts": 0, "totalOrders": 0, "totalRevenue": 0,
    "pendingOrders": 0, "confirmedOrders": 0, "processingOrders": 0, "packedOrders": 0,
    "shippedOrders": 0, "outForDeliveryOrders": 0, "deliveredOrders": 0, "cancelledOrders": 0
  },
  "lowStockProducts": [],
  "recentOrders": [],
  "recentUsers": []
}
```
Revenue excludes cancelled orders.

### GET /admin/orders
Query: `page, limit, status, search (order number), sort (newest|oldest)`

### GET /admin/orders/:id
### PUT /admin/orders/:id/status
**Body**: `{ "status": "SHIPPED" }` — must be one of `PENDING, CONFIRMED, PROCESSING, PACKED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED`

### PUT /admin/orders/:id/delivery-date
**Body**: `{ "expectedDeliveryDate": "2026-08-17" }`

### GET /admin/users
Query: `page, limit, search`
Returns each user with `orderCount` and `totalSpending` (derived from non-cancelled orders).

### GET /admin/users/:id
### PUT /admin/users/:id/status
**Body**: `{ "isActive": false }`

---

## HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200  | Success |
| 201  | Created |
| 400  | Bad request / business rule violation |
| 401  | Unauthorized (missing/invalid token, bad credentials) |
| 403  | Forbidden (role/ownership check failed) |
| 404  | Not found |
| 409  | Conflict (duplicate email, duplicate order number) |
| 422  | Validation error |
| 500  | Internal server error |
