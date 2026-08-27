import { CategoryScroller } from "@/components/home/CategoryScroller";
import { ProductRail } from "./_home/ProductRail";
import { PromoBanner } from "./_home/PromoBanner";
import { productService } from "@/services/productService";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [shirts, tshirts, pants, jeans, dresses, newArrivals, saleProducts] = await Promise.all([
    productService.getProducts({ category: "Shirts", pageSize: 4 }),
    productService.getProducts({ category: "T-Shirts", pageSize: 4 }),
    productService.getProducts({ category: "Pants", pageSize: 4 }),
    productService.getProducts({ category: "Jeans", pageSize: 4 }),
    productService.getProducts({ category: "Dresses", pageSize: 4 }),
    productService.getProducts({ collection: "new-arrivals", pageSize: 4 }),
    productService.getProducts({ collection: "sale", pageSize: 4 }),
  ]);

  return (
    <div>
      {/* Category Scroller Bar */}
      <CategoryScroller />

      {/* Product-First Category Rails */}
      <ProductRail title="Shirts" eyebrow="Wardrobe Essentials" products={shirts.items} viewAllHref="/products?category=Shirts" />
      <ProductRail title="T-Shirts" eyebrow="Everyday Comfort" products={tshirts.items} viewAllHref="/products?category=T-Shirts" />
      <ProductRail title="Pants & Trousers" eyebrow="Tailored Fits" products={pants.items} viewAllHref="/products?category=Pants" />
      <ProductRail title="Denim & Jeans" eyebrow="Premium Selvedge" products={jeans.items} viewAllHref="/products?category=Jeans" />
      <ProductRail title="Dresses" eyebrow="Couture Styles" products={dresses.items} viewAllHref="/products?category=Dresses" />
      
      {/* Secondary Promo Cards */}
      <PromoBanner />

      <ProductRail title="New Arrivals" eyebrow="Just Dropped" products={newArrivals.items} viewAllHref="/new-arrivals" />
      <ProductRail title="Special Offers" eyebrow="Limited Sale" products={saleProducts.items} viewAllHref="/products?collection=sale" />
    </div>
  );
}

