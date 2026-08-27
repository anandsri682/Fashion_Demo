// ---------------------------------------------------------------------------
// Shared domain types for the fashion e-commerce frontend.
// These mirror the shape the Node.js + Express + MongoDB backend is expected
// to return. Keep this file in sync with the backend's response schemas.
// ---------------------------------------------------------------------------

export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export type ProductCategory =
  | "T-Shirts"
  | "Shirts"
  | "Jeans"
  | "Pants"
  | "Dresses"
  | "Jackets"
  | "Shoes"
  | "Knitwear"
  | "Accessories";


export type ProductGender = "Men" | "Women" | "Kids" | "Unisex";

export interface ProductVariant {
  size: string;
  color?: string;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  gender: ProductGender;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  quantity: number;
  sizes: string[];
  colors: string[];
  variants?: ProductVariant[];
  images: ProductImage[];
  material?: string;
  careInstructions?: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}


export interface ProductQuery {
  search?: string;
  category?: ProductCategory;
  gender?: ProductGender;
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "newest" | "price-asc" | "price-desc" | "popular";
  page?: number;
  pageSize?: number;
  collection?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CartItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  size: string;
  color: string;
  quantity: number;
  maxQuantity: number;
  savedForLater?: boolean;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export type PaymentMethod = "UPI" | "CREDIT_CARD" | "DEBIT_CARD" | "COD";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  expectedDelivery: string;
}

export interface CreateOrderPayload {
  userId: string;
  items: OrderItem[];
  shippingAddressId?: string;
  billingAddressId?: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}


export interface AdminDashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  deliveredOrders: number;
  lowStockProducts: number;
  recentOrders: Order[];
  recentUsers: User[];
  revenueByMonth: { month: string; revenue: number }[];
  ordersByMonth: { month: string; orders: number }[];
  topProducts: { product: Product; unitsSold: number }[];
}

export interface AdminUserRow extends User {
  orderCount: number;
  totalSpent: number;
}

export type AsyncStatus = "idle" | "loading" | "success" | "error" | "empty";
