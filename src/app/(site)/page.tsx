import { CategoryScroller } from "@/components/home/CategoryScroller";
import { ProductRail } from "./_home/ProductRail";
import { PromoBanner } from "./_home/PromoBanner";
import { productService } from "@/services/productService";

export const dynamic = "force-dynamic";


export default async function HomePage() {
  // Fetch ALL products from MongoDB Atlas
  const allResult = await productService.getProducts({ pageSize: 50 });
  const allProducts = allResult.items || [];

  // Group products dynamically by category
  const categories = Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean)));

  return (
    <div>
      {/* Category Scroller Bar */}
      <CategoryScroller />

      {/* Primary Rail: All Products from Database */}
      <ProductRail
        title="All Products"
        eyebrow="Explore Catalogue"
        products={allProducts}
        viewAllHref="/products"
      />

      {/* Dynamic Category Rails from MongoDB Atlas */}
      {categories.map((cat) => {
        const catProducts = allProducts.filter((p) => p.category === cat);
        return (
          <ProductRail
            key={cat}
            title={cat}
            eyebrow="Category Edit"
            products={catProducts}
            viewAllHref={`/products?category=${encodeURIComponent(cat)}`}
          />
        );
      })}

      {/* Secondary Promo Cards */}
      <PromoBanner />
    </div>
  );
}


