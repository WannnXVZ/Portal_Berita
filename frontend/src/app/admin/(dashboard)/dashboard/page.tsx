"use client";

import {
  FileText, Eye, Users, TrendingUp, Clock, ArrowUp, ArrowDown, Loader2
} from "lucide-react";
import Link from "next/link";
import { articles as mockArticles, getPopularArticles, formatRelativeTime, categories as mockCategories } from "@/lib/mock-data";
import useSWR from "swr";
import { Article, Category } from "@/types";

export default function DashboardPage() {
  const { data: articlesData, isLoading: articlesLoading } = useSWR<[Article[], number]>("/articles");
  const { data: categoriesData } = useSWR<Category[]>("/categories");

  const articles = articlesData?.[0] || (mockArticles as Article[]);
  const categories = categoriesData || mockCategories;
  const popular = articlesData ? [...articles].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5) : getPopularArticles(5);
  const recentArticles = articles.slice(0, 5);

  const stats = [
    { label: "Total Artikel", value: articles.length, change: "+12", up: true, icon: FileText, color: "bg-brand/10 text-brand" },
    { label: "Total Views", value: `${Math.round(articles.reduce((sum, article) => sum + article.viewCount, 0) / 1000)}K`, change: "+18%", up: true, icon: Eye, color: "bg-blue-500/10 text-blue-600" },
    { label: "User Aktif", value: "8", change: "+2", up: true, icon: Users, color: "bg-green-500/10 text-green-600" },
    { label: "Pending Review", value: articles.filter(a => a.status === 'pending_review').length, change: "-3", up: false, icon: Clock, color: "bg-amber-500/10 text-amber-600" },
  ];

  const statusBreakdown = [
    { label: "Published", count: articles.filter(a => a.status === 'published').length, color: "bg-green-500" },
    { label: "Draft", count: articles.filter(a => a.status === 'draft').length, color: "bg-gray-400" },
    { label: "Pending Review", count: articles.filter(a => a.status === 'pending_review').length, color: "bg-amber-500" },
    { label: "Scheduled", count: articles.filter(a => a.status === 'scheduled').length, color: "bg-blue-500" },
    { label: "Rejected", count: articles.filter(a => a.status === 'rejected').length, color: "bg-red-500" },
  ].map(item => ({
    ...item,
    pct: articles.length > 0 ? Math.round((item.count / articles.length) * 100) : 0
  }));

  const loading = articlesLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Selamat datang kembali, Admin.</p>
        </div>
        <Link
          href="/admin/articles/create"
          className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <FileText className="h-4 w-4" /> Tulis Artikel
        </Link>
      </div>

      {loading && !articlesData ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Memuat data statistik...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${stat.up ? "text-green-600" : "text-amber-600"}`}>
                    {stat.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Article Overview Chart Placeholder */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand" /> Artikel per Minggu
              </h3>
              <div className="h-48 flex items-end gap-2 px-2">
                {[35, 52, 41, 68, 55, 72, 63].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-brand/15 hover:bg-brand/30 rounded-t-md transition-colors relative group"
                      style={{ height: `${(val / 72) * 100}%` }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                        {val}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-bold text-sm mb-4">Status Artikel</h3>
              <div className="space-y-3">
                {statusBreakdown.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-foreground">{item.label}</span>
                      <span className="text-muted-foreground text-xs">{item.count} ({item.pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Articles */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                🔥 Artikel Terpopuler
              </h3>
              <div className="space-y-3">
                {popular.map((article, idx) => (
                  <div key={article.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                    <span className="text-lg font-black text-brand/20 font-serif w-5 text-right flex-shrink-0">{idx + 1}</span>
                    <div className="min-w-0 flex-1">
                      <Link href={`/admin/articles`} className="text-sm font-semibold text-foreground hover:text-brand transition-colors line-clamp-1">
                        {article.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
                        <span>{article.category?.name || "Tanpa Kategori"}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.viewCount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                ⏱️ Artikel Terbaru
              </h3>
              <div className="space-y-3">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      article.status === "published" ? "bg-green-500" : article.status === "draft" ? "bg-gray-400" : "bg-amber-500"
                    }`} />
                    <div className="min-w-0 flex-1">
                      <Link href={`/admin/articles`} className="text-sm font-semibold text-foreground hover:text-brand transition-colors line-clamp-1">
                        {article.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
                        <span>{article.author?.name || "Admin"}</span>
                        <span>·</span>
                        <span>{formatRelativeTime(article.publishedAt || article.createdAt)}</span>
                        <span className={`font-semibold capitalize ${
                          article.status === "published" ? "text-green-600" : article.status === "draft" ? "text-gray-500" : "text-amber-600"
                        }`}>
                          {article.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Category Stats */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-bold text-sm mb-4">Artikel per Kategori</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.slice(0, 12).map((cat) => (
                <div key={cat.id} className="text-center p-3 bg-muted/50 rounded-lg hover:bg-brand-light transition-colors">
                  <span className="text-xl">{cat.icon}</span>
                  <div className="text-lg font-bold text-foreground mt-1">{cat.articleCount}</div>
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{cat.name}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
