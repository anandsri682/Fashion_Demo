"use client";

import { ProductImage } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Modal } from "@/components/ui/Modal";
import { Expand } from "lucide-react";
import { getImageUrl } from "@/lib/api";

export function ProductGallery({ images, title }: { images: ProductImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      <div className="flex shrink-0 gap-3 md:flex-col overflow-x-auto pb-2 md:pb-0">
        {images.map((img, i) => (
          <button
            key={img.id || i}
            onClick={() => setActive(i)}
            className={cn(
              "relative h-20 w-16 shrink-0 overflow-hidden border transition-all duration-200",
              active === i ? "border-brass ring-1 ring-brass scale-[1.02]" : "border-stone hover:border-graphite/50 opacity-80 hover:opacity-100"
            )}
          >
            <Image src={getImageUrl(img.url)} alt={img.alt || title} fill className="object-cover" sizes="64px" />
          </button>
        ))}
      </div>

      {/* Main Image Display */}
      <div className="relative flex-1">
        <button
          onClick={() => setFullscreen(true)}
          className="group relative block aspect-[3/4] max-h-[520px] w-full overflow-hidden rounded-xl bg-stone border border-stone/50 shadow-subtle"
          aria-label="View gallery image fullscreen"
        >
          <Image
            src={getImageUrl(images[active]?.url || "")}
            alt={images[active]?.alt || title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-700 ease-smooth group-hover:scale-105"
          />
          <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 backdrop-blur-xs text-ink transition-transform group-hover:scale-110 shadow-sm">
            <Expand className="h-4 w-4 text-graphite group-hover:text-primary" />
          </span>
        </button>
      </div>


      {/* Fullscreen Lightbox Modal */}
      <Modal open={fullscreen} onClose={() => setFullscreen(false)} title={title}>
        <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-stone border border-stone/40">
          <Image
            src={getImageUrl(images[active]?.url || "")}
            alt={title}
            fill
            className="object-contain"
            sizes="90vw"
          />
        </div>
      </Modal>
    </div>
  );
}

