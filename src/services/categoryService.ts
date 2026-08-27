import { api } from '@/lib/api';

export interface CategoryItem {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface SubcategoryItem {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  category: string | { _id: string; name: string };
  displayOrder: number;
  isActive: boolean;
}

export const categoryService = {
  async getPublicCategories(): Promise<{ categories: CategoryItem[]; subcategories: SubcategoryItem[] }> {
    const res = await api.get<{ categories: CategoryItem[]; subcategories: SubcategoryItem[] }>('/categories');
    return res;
  },

  async getAdminCategories(): Promise<{ categories: CategoryItem[]; subcategories: SubcategoryItem[] }> {
    const res = await api.get<{ categories: CategoryItem[]; subcategories: SubcategoryItem[] }>('/admin/categories');
    return res;
  },

  async createCategory(data: Partial<CategoryItem>): Promise<CategoryItem> {
    const res = await api.post<{ category: CategoryItem }>('/admin/categories', data);
    return res.category;
  },

  async updateCategory(id: string, data: Partial<CategoryItem>): Promise<CategoryItem> {
    const res = await api.put<{ category: CategoryItem }>(`/admin/categories/${id}`, data);
    return res.category;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/admin/categories/${id}`);
  },

  async createSubcategory(data: { name: string; categoryId: string; displayOrder?: number; isActive?: boolean }): Promise<SubcategoryItem> {
    const res = await api.post<{ subcategory: SubcategoryItem }>('/admin/subcategories', data);
    return res.subcategory;
  },

  async updateSubcategory(id: string, data: Partial<SubcategoryItem>): Promise<SubcategoryItem> {
    const res = await api.put<{ subcategory: SubcategoryItem }>(`/admin/subcategories/${id}`, data);
    return res.subcategory;
  },

  async deleteSubcategory(id: string): Promise<void> {
    await api.delete(`/admin/subcategories/${id}`);
  },
};
