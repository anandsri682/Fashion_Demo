"use client";

import { useEffect, useState } from "react";
import { categoryService, CategoryItem, SubcategoryItem } from "@/services/categoryService";
import { useToastStore } from "@/store/toastStore";
import { FolderTree, Plus, Trash2, Edit2, Layers, CheckCircle2, XCircle } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const push = useToastStore((s) => s.push);

  const [categoryModal, setCategoryModal] = useState(false);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState("");

  const [subcategoryModal, setSubcategoryModal] = useState(false);
  const [subName, setSubName] = useState("");
  const [selectedCatId, setSelectedCatId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const res = await categoryService.getAdminCategories();
      setCategories(res.categories);
      setSubcategories(res.subcategories);
    } catch {
      push("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCategory() {
    if (!catName) return;
    try {
      await categoryService.createCategory({ name: catName, description: catDesc, image: catImage });
      push("Category created with image!");
      setCatName("");
      setCatDesc("");
      setCatImage("");
      setCategoryModal(false);
      await loadData();
    } catch {
      push("Failed to create category");
    }
  }


  async function handleCreateSubcategory() {
    if (!subName || !selectedCatId) return;
    try {
      await categoryService.createSubcategory({ name: subName, categoryId: selectedCatId });
      push("Subcategory created in MongoDB!");
      setSubName("");
      setSubcategoryModal(false);
      await loadData();
    } catch {
      push("Failed to create subcategory");
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Are you sure? This will also delete related subcategories.")) return;
    try {
      await categoryService.deleteCategory(id);
      push("Category deleted");
      await loadData();
    } catch {
      push("Failed to delete category");
    }
  }

  async function handleDeleteSubcategory(id: string) {
    if (!confirm("Delete this subcategory?")) return;
    try {
      await categoryService.deleteSubcategory(id);
      push("Subcategory deleted");
      await loadData();
    } catch {
      push("Failed to delete subcategory");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone/50 pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">CATALOG TAXONOMY</span>
          <h1 className="font-editorial text-3xl font-bold text-ink">Categories &amp; Subcategories</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCategoryModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-crimson transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
          <button
            onClick={() => {
              if (categories.length > 0) setSelectedCatId(categories[0].id || categories[0]._id || "");
              setSubcategoryModal(true);
            }}
            className="flex items-center gap-2 rounded-lg border border-primary text-primary px-4 py-2 text-xs font-bold hover:bg-primary/10 transition-all"
          >
            <Layers className="h-4 w-4" />
            <span>Add Subcategory</span>
          </button>
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Categories Card */}
        <div className="rounded-xl border border-stone/60 bg-paper-pure p-6 shadow-subtle space-y-4">
          <h3 className="font-editorial text-lg font-bold text-ink flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-primary" />
            <span>Main Categories ({categories.length})</span>
          </h3>

          {loading ? (
            <div className="p-8 text-center text-xs text-ash font-mono animate-pulse">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-xs text-ash font-mono">No categories found in MongoDB.</div>
          ) : (
            <div className="divide-y divide-stone/50">
              {categories.map((c) => {
                const cid = c.id || c._id || "";
                const subs = subcategories.filter((s) => {
                  const parentId = typeof s.category === "object" ? s.category._id : s.category;
                  return parentId === cid;
                });
                return (
                  <div key={cid} className="flex items-center justify-between py-3.5">
                    <div>
                      <p className="text-sm font-bold text-ink">{c.name}</p>
                      <p className="text-[11px] text-ash font-mono">/products?category={c.slug} &middot; {subs.length} subcategories</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cid)}
                      className="p-1.5 text-ash hover:text-error transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Subcategories Card */}
        <div className="rounded-xl border border-stone/60 bg-paper-pure p-6 shadow-subtle space-y-4">
          <h3 className="font-editorial text-lg font-bold text-ink flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <span>Subcategories ({subcategories.length})</span>
          </h3>

          {loading ? (
            <div className="p-8 text-center text-xs text-ash font-mono animate-pulse">Loading subcategories...</div>
          ) : subcategories.length === 0 ? (
            <div className="p-8 text-center text-xs text-ash font-mono">No subcategories found.</div>
          ) : (
            <div className="divide-y divide-stone/50">
              {subcategories.map((s) => {
                const sid = s.id || s._id || "";
                const parentName = typeof s.category === "object" ? s.category.name : "Category";
                return (
                  <div key={sid} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-xs font-bold text-ink">{s.name}</p>
                      <p className="text-[10px] text-primary font-bold font-mono">Parent: {parentName}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSubcategory(sid)}
                      className="p-1.5 text-ash hover:text-error transition-colors"
                      title="Delete subcategory"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {categoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-editorial text-lg font-bold text-slate-900">Create New Category</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Category Name</label>
                <input
                  type="text"
                  placeholder="Category Name (e.g. Shirts, Sarees)"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Category Image (URL or Path)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or /uploads/category.jpg"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono focus:border-rose-600 focus:outline-none"
                />
                {catImage && (
                  <div className="mt-2 relative h-16 w-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={catImage} alt="Category Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Description</label>
                <textarea
                  placeholder="Description (optional)"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs font-body focus:border-rose-600 focus:outline-none h-16"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setCategoryModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900">
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-md transition-colors"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Add Subcategory Modal */}
      {subcategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-editorial text-lg font-bold text-ink">Create New Subcategory</h3>
            <div className="space-y-3">
              <select
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(e.target.value)}
                className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono focus:border-primary focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id || c._id} value={c.id || c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Subcategory Name (e.g. Cotton Shirts, Trench Coats)"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setSubcategoryModal(false)} className="px-4 py-2 text-xs font-bold text-ash hover:text-ink">
                Cancel
              </button>
              <button
                onClick={handleCreateSubcategory}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-crimson"
              >
                Save Subcategory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
