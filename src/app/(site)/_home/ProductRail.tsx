import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ProductRail({
  title,
  eyebrow,
  products,
  viewAllHref,
}: {
  title: string;
  eyebrow: string;
  products: Product[];
  viewAllHref: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="container-x py-14 border-t border-stone/40">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-primary font-mono font-bold">{eyebrow}</span>
          <h2 className="mt-1 font-editorial text-2xl sm:text-3xl text-ink font-bold">{title}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="group hidden items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-dark transition-colors sm:flex hover-underline-crimson"
        >
          <span>Explore Collection</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>


      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          href={viewAllHref}
          className="group flex items-center gap-2 border border-stone bg-paper px-6 py-3 text-xs uppercase tracking-luxury font-medium text-ink hover:bg-ink hover:text-paper transition-all w-full justify-center"
        >
          <span>Explore Collection</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

