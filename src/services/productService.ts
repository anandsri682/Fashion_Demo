// ---------------------------------------------------------------------------
// productService
//
// Frontend product service connected to the real Express backend.
//
// Backend:
// GET    /api/products
// GET    /api/products/:id
// GET    /api/products/slug/:slug
// GET    /api/products/category/:category
// POST   /api/products              -> ADMIN
// PUT    /api/products/:id          -> ADMIN
// DELETE /api/products/:id          -> ADMIN
// ---------------------------------------------------------------------------
import type { ProductFormValues } from "@/components/admin/ProductForm";
import { apiFetch } from "@/lib/api";
import { MOCK_PRODUCTS } from "@/data/mockData";
import {
  PaginatedResult,
  Product,
  ProductQuery,
} from "@/types";


interface BackendProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}

interface BackendProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  gender: "men" | "women" | "unisex" | "kids";
  price: number;
  originalPrice?: number;
  discount: number;
  stock: number;
  sizes: string[];
  colors: string[];
  images: BackendProductImage[];
  featured: boolean;
  newArrival: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface BackendPagination {
  page?: number;
  limit?: number;
  total?: number;
  totalItems?: number;
  totalPages?: number;
}

interface ProductListResponse {
  success: boolean;
  message: string;
  products: BackendProduct[];
  pagination?: BackendPagination;
}

interface ProductResponse {
  success: boolean;
  message: string;
  product: BackendProduct;
}

// ---------------------------------------------------------------------------
// Backend -> Frontend product conversion
// ---------------------------------------------------------------------------

function mapProduct(product: BackendProduct & { variants?: any[] }): Product {
  return {
    id: product._id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory,
    gender: normalizeGender(product.gender),
    price: product.price,
    originalPrice: product.originalPrice,
    discountPercent:
      product.discount !== undefined
        ? product.discount
        : undefined,
    quantity: product.stock,
    sizes: product.sizes || [],
    colors: product.colors || [],
    variants: product.variants || [],
    images: (product.images || []).map(
      (image, index) => ({
        id: `${product._id}-image-${index}`,
        url: image.url,
        alt:
          image.alt ||
          `${product.title} image ${index + 1}`,
      })
    ),
    material: undefined,
    careInstructions: undefined,
    isFeatured: product.featured,
    isNewArrival: product.newArrival,
    isActive: product.isActive,
    rating: undefined,
    reviewCount: undefined,
    createdAt: product.createdAt,
  };
}


// ---------------------------------------------------------------------------
// Category conversion
// ---------------------------------------------------------------------------

function normalizeCategory(
  category: string
): Product["category"] {
  const value = category.toLowerCase();

  const categoryMap: Record<
    string,
    Product["category"]
  > = {
    "t-shirts": "T-Shirts",
    tshirts: "T-Shirts",

    shirts: "Shirts",

    jeans: "Jeans",

    dresses: "Dresses",

    jackets: "Jackets",

    shoes: "Shoes",

    knitwear: "Knitwear",

    accessories: "Accessories",
  };

  return (
    categoryMap[value] ||
    ("Accessories" as Product["category"])
  );
}

// ---------------------------------------------------------------------------
// Gender conversion
// ---------------------------------------------------------------------------

function normalizeGender(
  gender: BackendProduct["gender"]
): Product["gender"] {
  switch (gender.toLowerCase()) {
    case "men":
      return "Men";

    case "women":
      return "Women";

    case "unisex":
      return "Unisex";

    default:
      return "Unisex";
  }
}

// ---------------------------------------------------------------------------
// Build backend query parameters
// ---------------------------------------------------------------------------

function buildQueryParams(
  query: ProductQuery = {}
): URLSearchParams {
  const params = new URLSearchParams();

  if (query.search) {
    params.set("search", query.search);
  }

  if (query.category) {
    params.set(
      "category",
      query.category.toLowerCase()
    );
  }

  if (query.gender) {
    params.set(
      "gender",
      query.gender.toLowerCase()
    );
  }

  if (query.minPrice !== undefined) {
    params.set(
      "minPrice",
      String(query.minPrice)
    );
  }

  if (query.maxPrice !== undefined) {
    params.set(
      "maxPrice",
      String(query.maxPrice)
    );
  }

  if (query.page) {
    params.set(
      "page",
      String(query.page)
    );
  }

  if (query.pageSize) {
    params.set(
      "limit",
      String(query.pageSize)
    );
  }

  // Frontend -> backend sort mapping
  switch (query.sort) {
    case "price-asc":
      params.set("sort", "price_asc");
      break;

    case "price-desc":
      params.set("sort", "price_desc");
      break;

    case "newest":
      params.set("sort", "newest");
      break;

    case "popular":
      // Backend currently doesn't have a popularity field.
      // Use newest as a safe fallback for now.
      params.set("sort", "newest");
      break;

    case "featured":
      params.set("featured", "true");
      break;
  }

  // Collection filters
  if (query.collection === "new-arrivals") {
    params.set("newArrival", "true");
  }

  if (query.collection === "featured") {
    params.set("featured", "true");
  }

  return params;
}

// ---------------------------------------------------------------------------
// Check whether a value looks like a MongoDB ObjectId
// ---------------------------------------------------------------------------

function isMongoId(value: string): boolean {
  return /^[a-f\d]{24}$/i.test(value);
}

// ---------------------------------------------------------------------------
// Product service
// ---------------------------------------------------------------------------

export const productService = {
  // -------------------------------------------------------------------------
  // GET /api/products
  // -------------------------------------------------------------------------

  async getProducts(
    query: ProductQuery = {}
  ): Promise<PaginatedResult<Product>> {
    try {
      const params = buildQueryParams(query);
      const queryString = params.toString();

      const response = await apiFetch<ProductListResponse>(
        `/products${queryString ? `?${queryString}` : ""}`,
        { auth: false }
      );

      const products = (response.products || []).map(mapProduct);
      const pagination = response.pagination || {};
      const page = pagination.page || query.page || 1;
      const pageSize = pagination.limit || query.pageSize || (products.length > 0 ? products.length : 12);
      const total = pagination.total ?? pagination.totalItems ?? products.length;

      return {
        items: products,
        total,
        page,
        pageSize,
      };
    } catch (error) {
      return {
        items: [],
        total: 0,
        page: query.page || 1,
        pageSize: query.pageSize || 12,
      };
    }
  },


  // -------------------------------------------------------------------------
  // GET /api/products/:id
  // OR
  // GET /api/products/slug/:slug
  // -------------------------------------------------------------------------

  async getProduct(
    idOrSlug: string
  ): Promise<Product | null> {
    try {
      let response: ProductResponse;

      if (isMongoId(idOrSlug)) {
        response = await apiFetch<ProductResponse>(`/products/${idOrSlug}`, { auth: false });
      } else {
        response = await apiFetch<ProductResponse>(
          `/products/slug/${encodeURIComponent(idOrSlug)}`,
          { auth: false }
        );
      }

      return response.product ? mapProduct(response.product) : null;
    } catch {
      return null;
    }
  },

  // -------------------------------------------------------------------------
  // Related products
  // -------------------------------------------------------------------------

  async getRelated(
    product: Product,
    limit = 4
  ): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      params.set("category", product.category.toLowerCase());
      params.set("limit", String(limit + 1));

      const response = await apiFetch<ProductListResponse>(
        `/products?${params.toString()}`,
        { auth: false }
      );

      return (response.products || [])
        .map(mapProduct)
        .filter((item) => item.id !== product.id)
        .slice(0, limit);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------------------
  // ADMIN: Create product
  // -------------------------------------------------------------------------

  async createProduct(values: ProductFormValues): Promise<Product> {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.category);
    if (values.subcategory) {
      formData.append("subcategory", values.subcategory);
    }
    formData.append("gender", values.gender.toLowerCase());
    formData.append("price", String(values.price));

    if (values.originalPrice !== undefined) {
      formData.append("originalPrice", String(values.originalPrice));
    }

    formData.append("stock", String(values.quantity));
    formData.append("sizes", JSON.stringify(values.sizes));
    formData.append("colors", JSON.stringify(values.colors));
    formData.append("variants", JSON.stringify(values.variants || []));
    formData.append("featured", String(values.isFeatured));
    formData.append("newArrival", String(values.isNewArrival));
    formData.append("isActive", String(values.isActive));

    values.images.forEach((image) => {
      if (image.file) {
        formData.append("images", image.file);
      }
    });

    const response = await apiFetch<ProductResponse>("/products", {
      method: "POST",
      body: formData,
    });

    return mapProduct(response.product);
  },

  // -------------------------------------------------------------------------
  // ADMIN: Update product
  // -------------------------------------------------------------------------

  async updateProduct(
    id: string,
    payload: Partial<Product>
  ): Promise<Product> {
    const body: Record<string, unknown> = {};

    if (payload.title !== undefined) body.title = payload.title;
    if (payload.description !== undefined) body.description = payload.description;
    if (payload.category !== undefined) body.category = payload.category.toLowerCase();
    if (payload.subcategory !== undefined) body.subcategory = payload.subcategory;
    if (payload.gender !== undefined) body.gender = payload.gender.toLowerCase();
    if (payload.price !== undefined) body.price = payload.price;
    if (payload.originalPrice !== undefined) body.originalPrice = payload.originalPrice;
    if (payload.quantity !== undefined) body.stock = payload.quantity;
    if (payload.sizes !== undefined) body.sizes = payload.sizes;
    if (payload.colors !== undefined) body.colors = payload.colors;
    if (payload.variants !== undefined) body.variants = payload.variants;
    if (payload.isFeatured !== undefined) body.featured = payload.isFeatured;
    if (payload.isNewArrival !== undefined) body.newArrival = payload.isNewArrival;
    if (payload.isActive !== undefined) body.isActive = payload.isActive;


    const response = await apiFetch<ProductResponse>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    return mapProduct(response.product);
  },

  // -------------------------------------------------------------------------
  // ADMIN: Delete/Deactivate product
  // -------------------------------------------------------------------------

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiFetch(`/products/${id}`, {
        method: "DELETE",
      });
    } catch {
      // Fallback for admin endpoint if backend mounts DELETE under /api/admin/products/:id
      await apiFetch(`/admin/products/${id}`, {
        method: "DELETE",
      });
    }
  },


  // -------------------------------------------------------------------------
  // ADMIN: Get all products
  // -------------------------------------------------------------------------

  async getAllForAdmin(): Promise<Product[]> {
    try {
      const response = await apiFetch<ProductListResponse>("/admin/products?limit=100");
      return (response.products || []).map(mapProduct);
    } catch {
      return [];
    }
  },

};