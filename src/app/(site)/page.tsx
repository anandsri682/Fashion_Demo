import { HomeHero } from "./_home/HomeHero";
import { CategoryStrip } from "./_home/CategoryStrip";
import { ProductRail } from "./_home/ProductRail";
import { PromoBanner } from "./_home/PromoBanner";
import { Newsletter } from "./_home/Newsletter";
import { productService } from "@/services/productService";

export const dynamic = "force-dynamic";

export default async function HomePage() {

  const [newArrivals, trending, featured, bestSellers] = await Promise.all([
    productService.getProducts({ collection: "new-arrivals", pageSize: 8 }),
    productService.getProducts({ sort: "popular", pageSize: 8 }),
    productService.getProducts({ collection: "featured", pageSize: 4 }),
    productService.getProducts({ collection: "best-sellers", pageSize: 8 }),
  ]);

  return (
    <div>
      <HomeHero />
      <CategoryStrip />
      <ProductRail title="New Arrivals" eyebrow="Just In" products={newArrivals.items} viewAllHref="/new-arrivals" />
      <ProductRail title="Trending Now" eyebrow="Editor's Picks" products={trending.items} viewAllHref="/products?sort=popular" />
      <PromoBanner />
      <ProductRail title="Featured Collection" eyebrow="Curated" products={featured.items} viewAllHref="/collections/featured" />
      <ProductRail title="Best Sellers" eyebrow="Most Loved" products={bestSellers.items} viewAllHref="/products" />
      <Newsletter />
    </div>
  );
}
