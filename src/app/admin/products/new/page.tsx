"use client";

import { useRouter } from "next/navigation";
import {
  ProductForm,
  ProductFormValues,
} from "@/components/admin/ProductForm";
import { productService } from "@/services/productService";
import { useToastStore } from "@/store/toastStore";

export default function NewProductPage() {
  const router = useRouter();
  const push = useToastStore((state) => state.push);

  async function handleSubmit(values: ProductFormValues) {
    try {
      await productService.createProduct(values);

      push("Product created successfully");

      router.push("/admin/products");
    } catch (error) {
      console.error("Create product failed:", error);

      push(
        error instanceof Error
          ? error.message
          : "Could not create product",
        "error"
      );
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">
          Add Product
        </h1>

        <p className="mt-2 text-sm text-graphite">
          Create a new product and upload its images.
        </p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="Create Product"
      />
    </div>
  );
}