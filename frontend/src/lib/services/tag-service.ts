import { api } from "@/lib/api-client";
import { Tag, ApiResponse } from "@/types";
import { tags as mockTags } from "@/lib/mock-data";

export const tagService = {
  getTrending: async (limit = 10): Promise<Tag[]> => {
    try {
      const response = await api.get<Tag[]>("/tags/trending", {
        params: { limit: String(limit) }
      });
      return response;
    } catch (error) {
      console.warn("API Error: Falling back to mock data for tags", error);
      return mockTags.slice(0, limit);
    }
  },

  getBySlug: async (slug: string): Promise<Tag | null> => {
    try {
      const response = await api.get<Tag>(`/tags/${slug}`);
      return response;
    } catch (error) {
      console.warn(`API Error: Falling back to mock data for tag slug: ${slug}`, error);
      return mockTags.find(t => t.slug === slug) || null;
    }
  }
};
