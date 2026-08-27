// ---------------------------------------------------------------------------
// TEMPORARY MOCK DATA — for frontend development & visual testing only.
//
// This is intentionally isolated from src/services/*. Each service checks a
// USE_MOCK flag and, when true, reads from here instead of calling apiFetch().
// Flip USE_MOCK to false (or delete this file) once the Node/Express/MongoDB
// backend is live — no other frontend code needs to change.
// ---------------------------------------------------------------------------

import { Address, Order, Product, User } from "@/types";

function img(seed: string, w = 800, h = 1000) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function makeImages(seed: string, count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${seed}-${i}`,
    url: img(`${seed}-${i}`),
    alt: seed.replace(/-/g, " "),
  }));
}

export const CATEGORIES = [
  "T-Shirts",
  "Shirts",
  "Jeans",
  "Dresses",
  "Jackets",
  "Shoes",
  "Knitwear",
  "Accessories",
] as const;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const SHOE_SIZES = ["6", "7", "8", "9", "10", "11"];
export const COLORS = ["Black", "White", "Sand", "Olive", "Navy", "Rust"];

let idCounter = 1000;
function nextId() {
  idCounter += 1;
  return `PRD-${idCounter}`;
}

interface Seed {
  title: string;
  category: (typeof CATEGORIES)[number];
  gender: "Men" | "Women" | "Unisex";
  price: number;
  original?: number;
  featured?: boolean;
  newArrival?: boolean;
  material?: string;
}

const seeds: Seed[] = [
  { title: "Structured Cotton Tee", category: "T-Shirts", gender: "Men", price: 1299, original: 1799, featured: true, material: "100% combed cotton" },
  { title: "Boxy Fit Ribbed Tee", category: "T-Shirts", gender: "Women", price: 1199, newArrival: true, material: "Cotton-modal blend" },
  { title: "Oxford Weave Shirt", category: "Shirts", gender: "Men", price: 2499, original: 3199, featured: true, material: "Brushed oxford cotton" },
  { title: "Relaxed Poplin Shirt", category: "Shirts", gender: "Women", price: 2299, newArrival: true, material: "Cotton poplin" },
  { title: "Tapered Selvedge Denim", category: "Jeans", gender: "Men", price: 3499, original: 4299, featured: true, material: "Selvedge denim" },
  { title: "High-Rise Straight Denim", category: "Jeans", gender: "Women", price: 3299, newArrival: true, material: "Rigid denim" },
  { title: "Bias-Cut Slip Dress", category: "Dresses", gender: "Women", price: 3899, featured: true, material: "Recycled satin" },
  { title: "Wrap Midi Dress", category: "Dresses", gender: "Women", price: 3599, newArrival: true, material: "Crepe" },
  { title: "Wool-Blend Overcoat", category: "Jackets", gender: "Men", price: 6999, original: 8999, featured: true, material: "Wool blend" },
  { title: "Cropped Bomber Jacket", category: "Jackets", gender: "Women", price: 4599, newArrival: true, material: "Nylon shell" },
  { title: "Minimal Leather Sneaker", category: "Shoes", gender: "Unisex", price: 4999, original: 5999, featured: true, material: "Full-grain leather" },
  { title: "Suede Chelsea Boot", category: "Shoes", gender: "Men", price: 5799, newArrival: true, material: "Suede" },
  { title: "Merino Crew Sweater", category: "Knitwear", gender: "Men", price: 3299, featured: true, material: "Merino wool" },
  { title: "Cable Knit Cardigan", category: "Knitwear", gender: "Women", price: 3799, newArrival: true, material: "Wool blend" },
  { title: "Leather Card Holder", category: "Accessories", gender: "Unisex", price: 999, material: "Vegetable-tanned leather" },
  { title: "Wide Brim Wool Hat", category: "Accessories", gender: "Women", price: 1499, newArrival: true, material: "Wool felt" },
  { title: "Essential Crewneck Tee", category: "T-Shirts", gender: "Unisex", price: 999, material: "Organic cotton" },
  { title: "Denim Trucker Jacket", category: "Jackets", gender: "Unisex", price: 4299, original: 4999, material: "Rigid denim" },
  { title: "Silk Cami Top", category: "Shirts", gender: "Women", price: 2799, material: "Mulberry silk" },
  { title: "Straight Fit Chinos", category: "Jeans", gender: "Men", price: 2599, material: "Cotton twill" },
  { title: "Pleated Midi Skirt", category: "Dresses", gender: "Women", price: 2999, featured: true, material: "Satin twill" },
  { title: "Canvas Low-Top Sneaker", category: "Shoes", gender: "Unisex", price: 2799, material: "Canvas" },
  { title: "Ribbed Turtleneck", category: "Knitwear", gender: "Women", price: 2399, material: "Cotton-cashmere" },
  { title: "Woven Leather Belt", category: "Accessories", gender: "Men", price: 1299, material: "Leather" },
];

export const MOCK_PRODUCTS: Product[] = seeds.map((s, i) => {
  const seedSlug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const discount =
    s.original && s.original > s.price
      ? Math.round(((s.original - s.price) / s.original) * 100)
      : undefined;
  return {
    id: nextId(),
    title: s.title,
    slug: `${seedSlug}-${i}`,
    description:
      `The ${s.title.toLowerCase()} is cut for everyday wear with a refined, minimal silhouette. ` +
      `Designed in a considered palette to layer easily across the season.`,
    category: s.category,
    subcategory: s.category,
    gender: s.gender,
    price: s.price,
    originalPrice: s.original,
    discountPercent: discount,
    quantity: 10 + ((i * 7) % 40),
    sizes: s.category === "Shoes" ? SHOE_SIZES : SIZES,
    colors: COLORS.slice(0, 3 + (i % 3)),
    images: makeImages(seedSlug, 4),
    material: s.material,
    careInstructions: "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    isFeatured: !!s.featured,
    isNewArrival: !!s.newArrival,
    isActive: true,
    rating: 3.8 + ((i % 12) / 10),
    reviewCount: 12 + i * 3,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  };
});

export const MOCK_USER: User = {
  id: "USR-1001",
  firstName: "Aanya",
  lastName: "Rao",
  email: "aanya.rao@example.com",
  phone: "9876543210",
  role: "USER",
  createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
};

export const MOCK_ADMIN: User = {
  id: "USR-1000",
  firstName: "Studio",
  lastName: "Admin",
  email: "admin@example.com",
  phone: "9990001111",
  role: "ADMIN",
  createdAt: new Date(Date.now() - 400 * 86400000).toISOString(),
};

export const MOCK_ADDRESSES: Address[] = [
  {
    id: "ADDR-1",
    firstName: "Aanya",
    lastName: "Rao",
    phone: "9876543210",
    email: "aanya.rao@example.com",
    addressLine1: "402, Silver Oak Residency",
    addressLine2: "Banjara Hills Road No. 12",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    pincode: "500034",
    landmark: "Near Care Hospital",
    isDefault: true,
  },
];

function randomOrderStatus(i: number) {
  const statuses: Order["status"][] = [
    "Pending",
    "Confirmed",
    "Processing",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];
  return statuses[i % statuses.length];
}

export const MOCK_ORDERS: Order[] = Array.from({ length: 8 }).map((_, i) => {
  const items = MOCK_PRODUCTS.slice(i * 2, i * 2 + 2).map((p) => ({
    productId: p.id,
    title: p.title,
    image: p.images[0].url,
    size: p.sizes[0],
    color: p.colors[0],
    price: p.price,
    quantity: 1 + (i % 2),
  }));
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const shipping = subtotal > 3000 ? 0 : 149;
  const tax = Math.round(subtotal * 0.05);
  const discount = i % 3 === 0 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping + tax - discount;
  const created = new Date(Date.now() - i * 4 * 86400000);
  const expected = new Date(created.getTime() + 7 * 86400000);
  return {
    id: `ORD-${20250 + i}`,
    userId: MOCK_USER.id,
    customerName: `${MOCK_USER.firstName} ${MOCK_USER.lastName}`,
    customerEmail: MOCK_USER.email,
    customerPhone: MOCK_USER.phone,
    items,
    shippingAddress: MOCK_ADDRESSES[0],
    billingAddress: MOCK_ADDRESSES[0],
    paymentMethod: (["UPI", "CREDIT_CARD", "COD", "DEBIT_CARD"] as const)[i % 4],
    subtotal,
    discount,
    shipping,
    tax,
    total,
    status: randomOrderStatus(i),
    createdAt: created.toISOString(),
    expectedDelivery: expected.toISOString(),
  };
});
