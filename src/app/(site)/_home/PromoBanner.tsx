import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Tag } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="container-x py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="relative overflow-hidden rounded-xl bg-ink p-8 text-white flex flex-col justify-between min-h-[220px] shadow-elevation group">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">LIMITED OFFER</span>
            <h3 className="mt-2 font-editorial text-2xl font-bold">Get Exclusive Tailored Suits</h3>
            <p className="mt-1 text-xs font-mono text-ash">Up To <span className="text-primary font-bold">50% OFF</span></p>
          </div>
          <div className="relative z-10 mt-6">
            <Link
              href="/products?category=Jackets"
              className="inline-flex items-center gap-1.5 rounded-full bg-crimson-gradient px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:scale-105 transition-transform"
            >
              <span>Shop Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] h-40 w-40 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all" />
        </div>

        {/* Card 2 */}
        <div className="relative overflow-hidden rounded-xl bg-crimson-gradient p-8 text-white flex flex-col justify-between min-h-[220px] shadow-crimson group">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">BEST VALUE</span>
            <h3 className="mt-2 font-editorial text-2xl font-bold">Autum-Winter Knits &amp; Sweaters</h3>
            <p className="mt-1 text-xs font-mono text-white/90">Starting at <span className="font-bold underline">₹1,499</span></p>
          </div>
          <div className="relative z-10 mt-6">
            <Link
              href="/products?category=Knitwear"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-ink-light transition-all"
            >
              <span>Explore Edit</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative overflow-hidden rounded-xl bg-ink p-8 text-white flex flex-col justify-between min-h-[220px] shadow-elevation group">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">SUMMER CLEARANCE</span>
            <h3 className="mt-2 font-editorial text-2xl font-bold">Premium Cotton T-Shirts</h3>
            <p className="mt-1 text-xs font-mono text-ash">Flat <span className="text-primary font-bold">30% OFF</span></p>
          </div>
          <div className="relative z-10 mt-6">
            <Link
              href="/products?category=T-Shirts"
              className="inline-flex items-center gap-1.5 rounded-full bg-crimson-gradient px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:scale-105 transition-transform"
            >
              <span>Grab Deal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


