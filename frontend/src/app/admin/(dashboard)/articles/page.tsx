"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Copy, Clock, Calendar, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { articles as mockArticles, categories, formatRelativeTime, formatDate, isArticleExpired } from "@/lib/mock-data";
import type { Article, ArticleStatus } from "@/types";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

const statusConfig: Record<ArticleStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700 border-gray-200" },
  pending_review: { label: "Pending Review", className: "bg-amber-50 text-amber-700 border-amber-200" },
  revision_needed: { label: "Revisi", className: "bg-blue-50 text-blue-700 border-blue-200" },
  approved: { label: "Approved", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  scheduled: { label: "Scheduled", className: "bg-sky-50 text-sky-700 border-sky-200" },
  published: { label: "Published", className: "bg-green-50 text-green-700 border-green-200" },
  unpublished: { label: "Unpublished", className: "bg-gray-50 text-gray-600 border-gray-200" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border-red-200" },
  archived: { label: "Archived", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

export default function ArticlesPage() {
  const { data: swrData, error, isLoading: loading, mutate } = useSWR<any>("/articles");
  
  // NestJS return [Article[], count]
  const articles = (Array.isArray(swrData) ? swrData[0] : swrData) || (mockArticles as Article[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  const filteredArticles = articles.filter((a: Article) => {
    const matchesSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedArticles((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map((a: Article) => a.id));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;
    
    // Optimistic Update
    const updatedArticles = articles.filter((a: Article) => a.id !== id);
    mutate(updatedArticles, false);

    try {
      await api.delete(`/articles/${id}`);
      toast.success("Artikel berhasil dihapus");
    } catch (error) {
      // Rollback if failed
      mutate();
      toast.error("Gagal menghapus artikel");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedArticles.length === 0) return;
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedArticles.length} artikel yang dipilih?`)) return;

    const updatedArticles = articles.filter((a: Article) => !selectedArticles.includes(a.id));
    mutate(updatedArticles, false);

    try {
      await Promise.all(selectedArticles.map(id => api.delete(`/articles/${id}`)));
      toast.success(`${selectedArticles.length} artikel berhasil dihapus`);
      setSelectedArticles([]);
    } catch (error) {
      mutate();
      toast.error("Gagal menghapus beberapa artikel. Silakan coba lagi.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-serif">Manajemen Artikel</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{articles.length} artikel total</p>
        </div>
        <Link
          href="/admin/articles/create"
          className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Artikel Baru
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul artikel..."
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
            {["all", "published", "draft", "pending_review", "scheduled", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  statusFilter === status
                    ? "bg-brand text-white border-brand"
                    : "bg-background text-muted-foreground border-border hover:border-brand"
                }`}
              >
                {status === "all" ? "Semua" : statusConfig[status as ArticleStatus]?.label || status}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedArticles.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{selectedArticles.length} dipilih</span>
            <button
              onClick={handleBulkDelete}
              className="text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" /> Hapus
            </button>
            <button onClick={() => setSelectedArticles([])} className="text-xs font-semibold text-muted-foreground hover:bg-muted px-3 py-1 rounded-lg transition-colors">
              Batal
            </button>
          </div>
        )}
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          {loading && !swrData ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
              <p className="text-sm text-muted-foreground">Memuat artikel...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Artikel</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Kategori</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Penulis</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Views</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Tanggal</th>
                  <th className="text-right p-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article: Article) => {
                  const sc = statusConfig[article.status as ArticleStatus] || statusConfig.draft;
                  const expired = isArticleExpired(article);
                  const willExpireSoon = article.expiredAt && !expired && (new Date(article.expiredAt).getTime() - Date.now() < 172800000); // 2 days

                  return (
                    <tr key={article.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(article.id)}
                          onChange={() => toggleSelect(article.id)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {article.featuredImage && (
                            <div className="relative w-12 h-8 rounded overflow-hidden bg-muted flex-shrink-0 hidden sm:block">
                              <Image src={article.featuredImage} alt="" fill className="object-cover" sizes="48px" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link href={`/admin/articles/${article.id}`} className="font-semibold text-foreground hover:text-brand transition-colors line-clamp-1">
                              {article.title}
                            </Link>
                            {article.expiredAt && (
                              <div className={`text-[10px] flex items-center gap-1 mt-0.5 ${expired ? "text-red-500" : "text-muted-foreground"}`}>
                                <Clock className="h-3 w-3" />
                                {expired ? "Telah expired" : `Expires: ${formatDate(article.expiredAt)}`}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <span className="text-xs font-medium text-muted-foreground">{article.category.name}</span>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <span className="text-xs font-medium text-muted-foreground">{article.author.name}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border text-center ${sc.className}`}>
                            {sc.label}
                          </span>
                          {expired && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-red-50 text-red-700 border-red-200 text-center uppercase tracking-tighter">
                              Expired
                            </span>
                          )}
                          {willExpireSoon && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200 text-center uppercase tracking-tighter">
                              Akan Expired
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />{article.viewCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">{formatRelativeTime(article.publishedAt || article.createdAt)}</span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Link href={`/artikel/${article.slug}`} className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Preview">
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          </Link>
                          <Link href={`/admin/articles/${article.id}/edit`} className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Edit">
                            <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                          </Link>
                          <button onClick={() => handleDelete(article.id)} className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Hapus">
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">Tidak ada artikel ditemukan.</div>
        )}
      </div>
    </div>
  );
}
