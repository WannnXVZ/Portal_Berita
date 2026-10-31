"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import { articleService } from "@/lib/services/article-service";
import { categoryService } from "@/lib/services/category-service";
import { Article, Category } from "@/types";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "relevant">("newest");
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchInitial = async () => {
      const cats = await categoryService.getAll();
      setCategories(cats);
    };
    fetchInitial();
  }, []);

  // Fetch articles based on filters
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        // In a real app, this would be a search endpoint
        // For now, we'll use getLatest or getByCategory and filter locally if needed
        let results: Article[] = [];
        
        if (selectedCategory !== "all") {
          results = await articleService.getByCategory(selectedCategory, 20);
        } else {
          results = await articleService.getLatest(30);
        }

        // Simpan ke state
        setArticles(results);
      } catch (error) {
        console.error("Search fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchArticles();
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [selectedCategory, sortBy]); // Re-fetch when category or sort changes

  // Local filtering for query (to make it feel snappy)
  const filteredArticles = useMemo(() => {
    if (!query.trim()) return articles;
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.name.toLowerCase().includes(q))
    );
  }, [query, articles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-black mb-4">Cari Berita</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik kata kunci berita, topik, atau tag..."
            className="w-full h-12 pl-12 pr-12 rounded-xl border border-border bg-card text-base focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
              selectedCategory === "all"
                ? "bg-brand text-white border-brand"
                : "bg-background text-muted-foreground border-border hover:border-brand"
            }`}
          >
            Semua
          </button>
          {categories.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                selectedCategory === cat.slug
                  ? "bg-brand text-white border-brand"
                  : "bg-background text-muted-foreground border-border hover:border-brand"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="newest">Terbaru</option>
            <option value="popular">Terpopuler</option>
            <option value="relevant">Relevan</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-brand" /> Mencari berita...
            </span>
          ) : query ? (
            <>
              Ditemukan <strong className="text-foreground">{filteredArticles.length}</strong> hasil
              untuk &quot;<strong className="text-brand">{query}</strong>&quot;
            </>
          ) : (
            <>
              Menampilkan <strong className="text-foreground">{filteredArticles.length}</strong> berita
            </>
          )}
        </p>
      </div>

      {!loading && (
        <>
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-foreground mb-2">Tidak Ada Hasil</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Coba kata kunci lain atau hapus filter untuk melihat lebih banyak berita.
              </p>
              <button
                onClick={() => { setQuery(""); setSelectedCategory("all"); }}
                className="bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-dark transition-colors"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
