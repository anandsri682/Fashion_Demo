"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm, ProductFormValues } from "@/components/admin/ProductForm";
import { productService } from "@/services/productService";
import { useToastStore } from "@/store/toastStore";
import { Product } from "@/types";
import { PageLoader } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const push = useToastStore((s) => s.push);
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    productService.getProduct(params.id).then(setProduct);
  }, [params.id]);

  async function handleSubmit(values: ProductFormValues) {
    if (!product) return;
    try {
      const discountPercent =
        values.originalPrice && values.originalPrice > values.price
          ? Math.round(((values.originalPrice - values.price) / values.originalPrice) * 100)
          : undefined;
      await productService.updateProduct(product.id, {
        title: values.title,
        description: values.description,
        category: values.category,
        subcategory: values.category,
        gender: values.gender,
        price: values.price,
        originalPrice: values.originalPrice,
        discountPercent,
        quantity: values.quantity,
        sizes: values.sizes,
        colors: values.colors,
        images: values.images,
        isFeatured: values.isFeatured,
        isNewArrival: values.isNewArrival,
        isActive: values.isActive,
      });
      push("Product updated");
      router.push("/admin/products");
    } catch {
      push("Could not update product", "error");
    }
  }

  if (product === undefined) return <PageLoader />;
  if (product === null) return <ErrorState message="This product could not be found." />;

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 font-display text-3xl text-ink">Edit Product</h1>
      <ProductForm
        initial={{
          title: product.title,
          description: product.description,
          category: product.category,
          gender: product.gender,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: product.quantity,
          sizes: product.sizes,
          colors: product.colors,
          images: product.images,
          isFeatured: product.isFeatured,
          isNewArrival: product.isNewArrival,
          isActive: product.isActive,
        }}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
