"use client";

import { useEffect, useState } from "react";
import { bannerService, BannerItem } from "@/services/bannerService";
import { getImageUrl } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";
import { Image as ImageIcon, Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const push = useToastStore((s) => s.push);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    ctaText: "Shop Now",
    ctaLink: "/products",
    image: "",
    bannerType: "HERO" as "HERO" | "PROMO" | "CATEGORY",
  });

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    try {
      setLoading(true);
      const data = await bannerService.listAllAdminBanners();
      setBanners(data);
    } catch {
      push("Failed to load banners");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBanner() {
    if (!form.title || !form.image) {
      push("Title and Image URL are required");
      return;
    }
    try {
      await bannerService.createBanner({
        ...form,
        isActive: true,
      });
      push("Homepage banner created in MongoDB!");
      setModal(false);
      setForm({ title: "", subtitle: "", ctaText: "Shop Now", ctaLink: "/products", image: "", bannerType: "HERO" });
      await loadBanners();
    } catch {
      push("Failed to create banner");
    }
  }

  async function handleDeleteBanner(id: string) {
    if (!confirm("Delete this banner?")) return;
    try {
      await bannerService.deleteBanner(id);
      push("Banner deleted");
      await loadBanners();
    } catch {
      push("Failed to delete banner");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone/50 pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">HOMEPAGE CONTENT</span>
          <h1 className="font-editorial text-3xl font-bold text-ink">Banners &amp; Promotional Highlights ({banners.length})</h1>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-crimson transition-all w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-xs text-ash font-mono animate-pulse">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-ash font-mono">No banners created yet. Click &quot;Add New Banner&quot; to add your first campaign.</div>
        ) : (

          banners.map((b) => {
            const id = b.id || b._id || "";
            return (
              <div key={id} className="rounded-xl border border-stone/60 bg-paper-pure overflow-hidden shadow-subtle flex flex-col justify-between">
                <div className="relative h-40 w-full bg-stone">
                  <Image src={getImageUrl(b.image)} alt={b.title} fill className="object-cover" />
                  <span className="absolute top-3 left-3 rounded-full bg-ink/80 backdrop-blur-xs px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                    {b.bannerType}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-editorial text-lg font-bold text-ink">{b.title}</h3>
                  {b.subtitle && <p className="text-xs text-ash leading-snug">{b.subtitle}</p>}
                  <p className="text-[11px] font-mono text-primary font-bold">CTA: {b.ctaText} &rarr; {b.ctaLink}</p>
                </div>
                <div className="p-4 border-t border-stone/50 flex items-center justify-between bg-stone/20">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Active on Storefront
                  </span>
                  <button onClick={() => handleDeleteBanner(id)} className="p-1 text-ash hover:text-error transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Banner Creation Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-editorial text-lg font-bold text-ink">Create Homepage Banner</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-ash font-mono">Title / Heading</label>
                <input
                  type="text"
                  placeholder="e.g. New Autumn Atelier Drop"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-ash font-mono">Subheading</label>
                <input
                  type="text"
                  placeholder="e.g. Crafted with 100% fine Italian wool"
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-ash font-mono">Image URL / Path</label>
                <input
                  type="text"
                  placeholder="/uploads/products/example.jpg or image URL"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-ash font-mono">CTA Button Text</label>
                  <input
                    type="text"
                    value={form.ctaText}
                    onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))}
                    className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-ash font-mono">CTA Link</label>
                  <input
                    type="text"
                    value={form.ctaLink}
                    onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))}
                    className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-ash font-mono">Banner Type</label>
                <select
                  value={form.bannerType}
                  onChange={(e) => setForm((f) => ({ ...f, bannerType: e.target.value as any }))}
                  className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono focus:border-primary focus:outline-none"
                >
                  <option value="HERO">Hero Banner</option>
                  <option value="PROMO">Promotional Banner</option>
                  <option value="CATEGORY">Category Strip</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-xs font-bold text-ash hover:text-ink">
                Cancel
              </button>
              <button
                onClick={handleCreateBanner}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-crimson"
              >
                Save Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
