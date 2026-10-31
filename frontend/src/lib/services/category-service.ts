import { api } from "@/lib/api-client";
import { Category, ApiResponse } from "@/types";
import { categories as mockCategories } from "@/lib/mock-data";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get<Category[]>("/categories");
      return response;
    } catch (error) {
      console.warn("API Error: Falling back to mock data for categories", error);
      return mockCategories;
    }
  },

  getBySlug: async (slug: string): Promise<Category | null> => {
    try {
      const response = await api.get<Category>(`/categories/${slug}`);
      return response;
    } catch (error) {
      console.warn(`API Error: Falling back to mock data for category slug: ${slug}`, error);
      return mockCategories.find(c => c.slug === slug) || null;
    }
  }
};
