import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative flex min-h-[85vh] lg:min-h-[90vh] items-center overflow-hidden bg-paper">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#C41E3A_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      <div className="container-x relative z-10 py-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-crimson-soft px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary animate-slideUp">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span>OFFER &middot; DISCOVER THE LATEST IN FASHION</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-ink tracking-tight animate-slideUp">
              Discover the Latest in <span className="text-primary italic font-normal">Fashion</span> &amp; Accessories
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-graphite font-body leading-relaxed animate-slideUp">
              Elevate your personal aesthetic with our curated autumn-winter apparel — masterfully tailored in small ateliers from organic cotton, selvedge denim, and pure wool.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 animate-slideUp">
              <Link href="/products">
                <Button variant="primary" size="lg" className="group rounded-full px-8 shadow-crimson">
                  <span>Shop Collection</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/products?collection=new-arrivals">
                <Button variant="outline" size="lg" className="rounded-full px-8 border-ink text-ink hover:bg-ink hover:text-white font-bold">
                  <span>New Arrivals</span>
                </Button>
              </Link>
            </div>

            {/* Sub-Badges */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-stone/60 max-w-md font-mono text-xs text-graphite">
              <div>
                <span className="font-bold text-ink text-sm block">100%</span>
                <span className="text-ash text-[10px]">Pure Fabrics</span>
              </div>
              <div>
                <span className="font-bold text-ink text-sm block">Express</span>
                <span className="text-ash text-[10px]">Fast Shipping</span>
              </div>
              <div>
                <span className="font-bold text-ink text-sm block">30-Day</span>
                <span className="text-ash text-[10px]">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Editorial Image Column with Crimson Curve Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-elevation border border-primary/20">
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80"
                alt="Maison Noir Autumn Winter Fashion Editorial"
                fill
                priority
                className="object-cover transition-transform duration-1000 ease-smooth hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

              {/* Floating Highlight Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-paper-pure/95 backdrop-blur-md p-4 rounded-xl shadow-dropdown border border-stone/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-primary">FEATURED ITEM</span>
                  <p className="font-editorial text-sm font-bold text-ink">Structured Wool Trench Coat</p>
                </div>
                <Link href="/products" className="h-9 w-9 rounded-full bg-crimson-gradient text-white flex items-center justify-center shadow-xs hover:scale-110 transition-transform">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


