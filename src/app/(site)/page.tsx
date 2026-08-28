import { CategoryScroller } from "@/components/home/CategoryScroller";
import { ProductRail } from "./_home/ProductRail";
import { PromoBanner } from "./_home/PromoBanner";
import { productService } from "@/services/productService";

export const dynamic = "force-dynamic";


export default async function HomePage() {
  // Fetch products from MongoDB Atlas
  const allResult = await productService.getProducts({ pageSize: 50 });
  const allProducts = allResult.items || [];

  // Group products dynamically by category
  const categories = Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean)));

  return (
    <div>
      {/* Category Scroller Bar */}
      <CategoryScroller />

      {/* Dynamic Category Rails from MongoDB Atlas */}
      {categories.map((cat) => {
        const catProducts = allProducts.filter((p) => p.category === cat);
        return (
          <ProductRail
            key={cat}
            title={cat}
            eyebrow="Collection"
            products={catProducts}
            viewAllHref={`/products?category=${encodeURIComponent(cat)}`}
          />
        );
      })}
    </div>
  );
}



