"use client";

import { useEffect, useState, FormEvent } from "react";
import { ProductGender, ProductVariant } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { COLORS } from "@/data/mockData";
import { categoryService, CategoryItem, SubcategoryItem } from "@/services/categoryService";
import { X, Upload, Layers, Boxes, Tag } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export interface ProductFormImage {
  id: string;
  url: string;
  alt: string;
  file?: File;
}

export interface ProductFormValues {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  gender: ProductGender;
  price: number;
  originalPrice?: number;
  quantity: number;
  sizes: string[];
  colors: string[];
  variants: ProductVariant[];
  images: ProductFormImage[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
}

const defaultValues: ProductFormValues = {
  title: "",
  description: "",
  category: "apparel",
  subcategory: "",
  gender: "Unisex",
  price: 0,
  originalPrice: undefined,
  quantity: 0,
  sizes: [],
  colors: [],
  variants: [],
  images: [],
  isFeatured: false,
  isNewArrival: false,
  isActive: true,
};

// Smart Size System Presets
const SIZE_PRESETS = [
  { label: "Standard Clothing", id: "apparel", sizes: ["XS", "S", "M", "L", "XL", "XXL"] },
  { label: "Bottomwear / Waist", id: "pants", sizes: ["28", "30", "32", "34", "36", "38", "40", "42"] },
  { label: "Footwear / Shoes", id: "shoes", sizes: ["6", "7", "8", "9", "10", "11", "12"] },
  { label: "Kids Clothing", id: "kids", sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y", "7-8Y", "8-10Y", "10-12Y", "12-14Y"] },
];

export function ProductForm({
  initial,
  onSubmit,
  submitLabel = "Create Product",
}: {
  initial?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<ProductFormValues>({
    ...defaultValues,
    ...initial,
  });

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [activeSizePreset, setActiveSizePreset] = useState("apparel");

  useEffect(() => {
    categoryService.getAdminCategories().then((res) => {
      setCategories(res.categories);
      setSubcategories(res.subcategories);
      if (res.categories.length > 0 && !initial?.category) {
        setValues((v) => ({ ...v, category: res.categories[0].slug || res.categories[0].name.toLowerCase() }));
      }
    }).catch(() => {});
  }, [initial?.category]);

  // Adjust active size preset based on gender or subcategory
  useEffect(() => {
    if (values.gender === "Kids") {
      setActiveSizePreset("kids");
    } else if (values.category.toLowerCase().includes("shoe") || values.subcategory.toLowerCase().includes("shoe") || values.subcategory.toLowerCase().includes("sneaker")) {
      setActiveSizePreset("shoes");
    } else if (values.subcategory.toLowerCase().includes("pant") || values.subcategory.toLowerCase().includes("jean") || values.subcategory.toLowerCase().includes("trouser")) {
      setActiveSizePreset("pants");
    }
  }, [values.gender, values.category, values.subcategory]);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleSize(size: string) {
    setValues((current) => {
      const hasSize = current.sizes.includes(size);
      const updatedSizes = hasSize
        ? current.sizes.filter((s) => s !== size)
        : [...current.sizes, size];

      let updatedVariants = current.variants.filter((v) => updatedSizes.includes(v.size));
      if (!hasSize) {
        updatedVariants.push({ size, stock: 10 });
      }

      const totalStock = updatedVariants.reduce((sum, v) => sum + (v.stock || 0), 0);

      return {
        ...current,
        sizes: updatedSizes,
        variants: updatedVariants,
        quantity: totalStock > 0 ? totalStock : current.quantity,
      };
    });
  }

  function updateVariantStock(size: string, stock: number) {
    setValues((current) => {
      const updatedVariants = current.variants.map((v) =>
        v.size === size ? { ...v, stock: Math.max(0, stock) } : v
      );
      if (!updatedVariants.some((v) => v.size === size)) {
        updatedVariants.push({ size, stock: Math.max(0, stock) });
      }

      const totalStock = updatedVariants.reduce((sum, v) => sum + (v.stock || 0), 0);

      return {
        ...current,
        variants: updatedVariants,
        quantity: totalStock,
      };
    });
  }

  function toggleColor(color: string) {
    setValues((current) => ({
      ...current,
      colors: current.colors.includes(color)
        ? current.colors.filter((c) => c !== color)
        : [...current.colors, color],
    }));
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const newImages: ProductFormImage[] = Array.from(files).map((file, i) => ({
      id: `${Date.now()}-${i}`,
      url: URL.createObjectURL(file),
      alt: values.title || "Product image",
      file,
    }));

    update("images", [...values.images, ...newImages]);
    e.target.value = "";
  }

  function removeImage(id: string) {
    const image = values.images.find((item) => item.id === id);
    if (image?.url.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }
    update("images", values.images.filter((item) => item.id !== id));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  // Filter subcategories belonging to current category
  const selectedCategoryObj = categories.find(
    (c) => c.slug === values.category || c.name.toLowerCase() === values.category.toLowerCase()
  );
  const selectedCatId = selectedCategoryObj?.id || selectedCategoryObj?._id;

  const availableSubcategories = subcategories.filter((s) => {
    const parentId = typeof s.category === "object" ? s.category._id || (s.category as any).id : s.category;
    return parentId === selectedCatId;
  });


  const currentPresetObj = SIZE_PRESETS.find((p) => p.id === activeSizePreset) || SIZE_PRESETS[0];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* BASIC PRODUCT INFORMATION */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Product Title"
            required
            placeholder="e.g. Classic Premium Linen Shirt"
            value={values.title}
            onChange={(event) => update("title", event.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs uppercase tracking-wide font-mono font-bold text-graphite">
            Description
          </label>
          <textarea
            required
            rows={4}
            placeholder="Describe the fabric, fit, and craftsmanship..."
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            className="w-full rounded-lg border border-stone bg-paper px-4 py-3 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Department / Target Audience */}
        <Select
          label="1. Target Department / Audience"
          value={values.gender}
          onChange={(event) => update("gender", event.target.value as ProductGender)}
        >
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids (Boys &amp; Girls)</option>
          <option value="Unisex">Unisex / All</option>
        </Select>

        {/* Main Category */}
        <Select
          label="2. Main Category"
          value={values.category}
          onChange={(event) => {
            const cat = event.target.value;
            update("category", cat);
            update("subcategory", "");
          }}
        >
          {categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat.id || cat._id} value={cat.slug || cat.name.toLowerCase()}>
                {cat.name}
              </option>
            ))
          ) : (
            <>
              <option value="apparel">Apparel</option>
              <option value="footwear">Footwear</option>
              <option value="accessories">Accessories</option>
              <option value="kids">Kids</option>
            </>
          )}
        </Select>

        {/* Subcategory Dropdown */}
        <div className="sm:col-span-2">
          <Select
            label="3. Subcategory (e.g. T-Shirts, Shirts, Jeans, Dresses, Pants)"
            value={values.subcategory}
            onChange={(event) => update("subcategory", event.target.value)}
          >
            <option value="">-- Select Subcategory --</option>
            {availableSubcategories.map((sub) => (
              <option key={sub.id || sub._id} value={sub.name}>
                {sub.name}
              </option>
            ))}
            {/* Fallback default subcategories if database subcategories are empty */}
            {availableSubcategories.length === 0 && (
              <>
                <option value="T-Shirts">T-Shirts</option>
                <option value="Shirts">Shirts</option>
                <option value="Jeans">Jeans / Denim</option>
                <option value="Pants">Pants / Trousers</option>
                <option value="Dresses">Dresses &amp; Gowns</option>
                <option value="Shorts">Shorts</option>
                <option value="Jackets">Jackets &amp; Coats</option>
                <option value="Sneakers">Sneakers &amp; Shoes</option>
              </>
            )}
          </Select>
        </div>

        <Input
          label="Price (₹)"
          type="number"
          min={0}
          required
          value={values.price}
          onChange={(event) => update("price", Number(event.target.value))}
        />

        <Input
          label="Original Price (₹, optional)"
          type="number"
          min={0}
          value={values.originalPrice ?? ""}
          onChange={(event) =>
            update("originalPrice", event.target.value ? Number(event.target.value) : undefined)
          }
        />
      </section>

      {/* SMART SIZE SYSTEM */}
      <section className="rounded-xl border border-stone/60 bg-stone/20 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone/40 pb-3">
          <div>
            <h4 className="text-xs uppercase tracking-widest font-mono font-bold text-ink flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <span>Smart Size System</span>
            </h4>
            <p className="text-[11px] text-ash">Select size preset type or toggle sizes manually:</p>
          </div>

          <div className="flex flex-wrap gap-1 bg-paper p-1 rounded-lg border border-stone/50">
            {SIZE_PRESETS.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setActiveSizePreset(p.id)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-mono font-bold rounded transition-all",
                  activeSizePreset === p.id ? "bg-primary text-white shadow-xs" : "text-graphite hover:text-primary"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentPresetObj.sizes.map((size) => {
            const isSelected = values.sizes.includes(size);
            return (
              <button
                type="button"
                key={size}
                onClick={() => toggleSize(size)}
                className={cn(
                  "border px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg transition-all",
                  isSelected
                    ? "border-primary bg-primary text-white shadow-xs"
                    : "border-stone bg-paper text-ink hover:border-primary"
                )}
              >
                {size}
              </button>
            );
          })}

          {/* Custom Size Addition */}
          <div className="flex items-center gap-1.5 ml-2 border-l border-stone/40 pl-3">
            <input
              type="text"
              id="custom-size-input"
              placeholder="+ Custom Size (e.g. 44)"
              className="w-36 rounded-lg border border-stone bg-white px-2.5 py-1 text-xs font-mono text-ink focus:border-primary focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const target = e.target as HTMLInputElement;
                  const val = target.value.trim().toUpperCase();
                  if (val && !values.sizes.includes(val)) {
                    toggleSize(val);
                    target.value = "";
                  }
                }
              }}
            />
          </div>
        </div>

      </section>

      {/* VARIANT-LEVEL INVENTORY (STOCK PER SIZE) */}
      <section className="rounded-xl border border-stone/60 bg-paper-pure p-5 space-y-4 shadow-subtle">
        <div className="flex items-center justify-between border-b border-stone/40 pb-3">
          <div>
            <h4 className="text-xs uppercase tracking-widest font-mono font-bold text-ink flex items-center gap-2">
              <Boxes className="h-4 w-4 text-primary" />
              <span>Variant-Level Inventory (Stock Per Size)</span>
            </h4>
            <p className="text-[11px] text-ash">Specify exact available stock units for each selected size:</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-ash font-bold">Total Calculated Stock:</span>
            <span className="ml-2 text-sm font-mono font-bold text-primary">{values.quantity} units</span>
          </div>
        </div>

        {values.sizes.length === 0 ? (
          <p className="text-xs font-mono text-ash py-2">Select sizes above to configure size-specific inventory stock.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {values.sizes.map((size) => {
              const variantObj = values.variants.find((v) => v.size === size);
              const currentStock = variantObj ? variantObj.stock : 0;
              return (
                <div key={size} className="rounded-lg border border-stone/50 bg-stone/20 p-3 space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-primary">
                    Size {size} Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentStock}
                    onChange={(e) => updateVariantStock(size, Number(e.target.value))}
                    className="w-full rounded border border-stone/70 bg-white px-2.5 py-1 text-xs font-mono font-bold text-ink focus:border-primary focus:outline-none"
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* COLORS */}
      <section>
        <h4 className="mb-3 text-xs uppercase tracking-widest font-mono font-bold text-graphite">
          Available Colors
        </h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              type="button"
              key={color}
              onClick={() => toggleColor(color)}
              className={cn(
                "border px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                values.colors.includes(color)
                  ? "border-ink bg-ink text-white"
                  : "border-stone bg-paper text-ink hover:border-ink"
              )}
            >
              {color}
            </button>
          ))}
        </div>
      </section>

      {/* IMAGES */}
      <section>
        <h4 className="mb-3 text-xs uppercase tracking-widest font-mono font-bold text-graphite">
          Product Images
        </h4>
        <div className="flex flex-wrap gap-3">
          {values.images.map((image) => (
            <div key={image.id} className="relative h-28 w-24 overflow-hidden rounded-lg border border-stone shadow-xs">
              <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="96px" />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/80 text-white hover:bg-error"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          <label className="flex h-28 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-stone text-ash hover:border-primary hover:text-primary transition-all bg-paper">
            <Upload className="h-5 w-5" />
            <span className="text-[10px] font-bold">Upload</span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleImagePick}
            />
          </label>
        </div>
      </section>

      {/* STATUS SWITCHES */}
      <section className="flex flex-wrap gap-6 border-t border-stone/50 pt-4">
        <label className="flex items-center gap-2 text-xs font-bold text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={values.isFeatured}
            onChange={(event) => update("isFeatured", event.target.checked)}
            className="rounded text-primary focus:ring-primary"
          />
          <span>Featured Product (Homepage Showcase)</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-bold text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={values.isNewArrival}
            onChange={(event) => update("isNewArrival", event.target.checked)}
            className="rounded text-primary focus:ring-primary"
          />
          <span>New Arrival Badge</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-bold text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(event) => update("isActive", event.target.checked)}
            className="rounded text-primary focus:ring-primary"
          />
          <span>Active on Storefront</span>
        </label>
      </section>

      {/* SUBMIT BUTTON */}
      <div>
        <Button type="submit" size="lg" className="shadow-crimson">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}