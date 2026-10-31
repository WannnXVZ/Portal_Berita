import { api } from "@/lib/api-client";
import { Article, ApiResponse } from "@/types";
import { articles as mockArticles } from "@/lib/mock-data";

export const articleService = {
  getLatest: async (limit = 10): Promise<Article[]> => {
    try {
      const response = await api.get<any>("/articles", {
        params: { limit: String(limit), status: "published" }
      });
      // NestJS return [Article[], count]
      return Array.isArray(response) ? response[0] : response;
    } catch (error) {
      console.warn("API Error: Falling back to mock data for latest articles", error);
      return mockArticles.slice(0, limit);
    }
  },

  getFeatured: async (): Promise<Article | null> => {
    try {
      const response = await api.get<any>("/articles", {
        params: { limit: "1", isFeatured: "true", status: "published" }
      });
      const articles = Array.isArray(response) ? response[0] : [];
      return articles[0] || null;
    } catch (error) {
      console.warn("API Error: Falling back to mock data for featured article", error);
      return mockArticles.find(a => a.isFeatured) || mockArticles[0];
    }
  },

  getEditorChoice: async (limit = 3): Promise<Article[]> => {
    try {
      const response = await api.get<any>("/articles", {
        params: { limit: String(limit), status: "published", isFeatured: "true" }
      });
      return Array.isArray(response) ? response[0] : response;
    } catch (error) {
      console.warn("API Error: Falling back to mock data for editor choice articles", error);
      return mockArticles.filter(a => a.isEditorChoice).slice(0, limit);
    }
  },

  getPopular: async (limit = 5): Promise<Article[]> => {
    try {
      const response = await api.get<any>("/articles", {
        params: { limit: String(limit), status: "published", sortBy: "viewCount" }
      });
      return Array.isArray(response) ? response[0] : response;
    } catch (error) {
      console.warn("API Error: Falling back to mock data for popular articles", error);
      return [...mockArticles].sort((a, b) => b.viewCount - a.viewCount).slice(0, limit);
    }
  },

  getByCategory: async (categorySlug: string, limit = 5): Promise<Article[]> => {
    try {
      const response = await api.get<any>("/articles", {
        params: { limit: String(limit), category: categorySlug, status: "published" }
      });
      return Array.isArray(response) ? response[0] : response;
    } catch (error) {
      console.warn(`API Error: Falling back to mock data for category: ${categorySlug}`, error);
      return mockArticles.filter(a => a.category.slug === categorySlug).slice(0, limit);
    }
  },

  getBySlug: async (slug: string): Promise<Article | null> => {
    try {
      const response = await api.get<Article>(`/articles/slug/${slug}`);
      return response;
    } catch (error) {
      console.warn(`API Error: Falling back to mock data for slug: ${slug}`, error);
      return mockArticles.find(a => a.slug === slug) || null;
    }
  },

  getByTag: async (tagSlug: string, limit = 10): Promise<Article[]> => {
    try {
      const response = await api.get<any>("/articles", {
        params: { limit: String(limit), tag: tagSlug, status: "published" }
      });
      return Array.isArray(response) ? response[0] : response;
    } catch (error) {
      console.warn(`API Error: Falling back to mock data for tag: ${tagSlug}`, error);
      return mockArticles.filter(a => a.tags.some(t => t.slug === tagSlug)).slice(0, limit);
    }
  }
};
