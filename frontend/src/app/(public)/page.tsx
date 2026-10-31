import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, ArrowRight, TrendingUp } from "lucide-react";
import { NewsCard, PopularList } from "@/components/news/NewsCard";
import { formatRelativeTime } from "@/lib/mock-data";
import { articleService } from "@/lib/services/article-service";
import { tagService } from "@/lib/services/tag-service";
import { categoryService } from "@/lib/services/category-service";

export default async function HomePage() {
  const [featured, editorChoice, popular, latest, trendingTags, categories] = await Promise.all([
    articleService.getFeatured(),
    articleService.getEditorChoice(4), // get 4 to exclude featured later
    articleService.getPopular(5),
    articleService.getLatest(10),
    tagService.getTrending(8),
    categoryService.getAll(),
  ]);

  const filteredEditorChoice = editorChoice.filter((a) => a.id !== featured?.id).slice(0, 3);

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="bg-[#0F0F0F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Featured Article */}
            {featured && (
              <Link
                href={`/artikel/${featured.slug}`}
                className="lg:col-span-2 group relative rounded-xl overflow-hidden aspect-[16/9] lg:aspect-auto lg:min-h-[420px] bg-gray-800"
              >
                {featured.featuredImage && (
                  <Image
                    src={featured.featuredImage}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-brand text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {featured.category?.name || "Umum"}
                    </span>
                    {featured.isBreaking && (
                      <span className="bg-gold text-[#0F0F0F] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full animate-pulse">
                        Breaking
                      </span>
                    )}
                  </div>
                  <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-black leading-tight group-hover:text-brand-muted transition-colors">
                    {featured.title}
                  </h1>
                  <p className="text-white/60 text-sm sm:text-base mt-2 max-w-2xl line-clamp-2">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-white/50">
                    <div className="flex items-center gap-2">
                      {featured.author?.avatar && (
                        <Image
                          src={featured.author.avatar}
                          alt={featured.author.name || "Penulis"}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      <span className="font-medium text-white/70">{featured.author?.name || "Redaksi"}</span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(featured.publishedAt!)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {featured.viewCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Editor's Choice */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gold text-sm">⭐</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/60">
                  Pilihan Editor
                </h2>
              </div>
              {filteredEditorChoice.map((article) => (
                <Link
                  key={article.id}
                  href={`/artikel/${article.slug}`}
                  className="group relative rounded-lg overflow-hidden aspect-[16/7] bg-gray-800 flex-1"
                >
                  {article.featuredImage && (
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                      {article.category?.name || "Umum"}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug mt-0.5 line-clamp-2 group-hover:text-brand-muted transition-colors">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trending Tags ── */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <TrendingUp className="h-3.5 w-3.5 text-brand" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Trending</span>
            </div>
            {trendingTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="flex-shrink-0 text-xs font-semibold text-muted-foreground bg-background border border-border rounded-full px-3 py-1 hover:border-brand hover:text-brand transition-all"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Left: Latest News */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold flex items-center gap-2">
                <span className="text-brand">⏱️</span> Berita Terbaru
              </h2>
              <Link href="/search" className="text-xs font-semibold text-brand hover:text-brand-dark flex items-center gap-1 transition-colors">
                Lihat Semua <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {latest.slice(0, 6).map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {/* Category Section Previews */}
            {await Promise.all(["nasional", "ekonomi", "teknologi"].map(async (catSlug) => {
              const cat = categories.find((c) => c.slug === catSlug);
              const catArticles = await articleService.getByCategory(catSlug, 3);
              if (!cat || catArticles.length === 0) return null;
              return (
                <div key={catSlug} className="mt-10">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-serif text-lg sm:text-xl font-bold flex items-center gap-2">
                      <span>{cat.icon}</span> {cat.name}
                    </h2>
                    <Link
                      href={`/kategori/${cat.slug}`}
                      className="text-xs font-semibold text-brand hover:text-brand-dark flex items-center gap-1 transition-colors"
                    >
                      Selengkapnya <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="space-y-0">
                    {catArticles.map((article) => (
                      <NewsCard key={article.id} article={article} variant="horizontal" />
                    ))}
                  </div>
                </div>
              );
            }))}
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            <PopularList articles={popular} />

            {/* Tag Cloud */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                <span>🏷️</span> Topik Populer
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-brand-light hover:text-brand transition-all"
                  >
                    #{tag.name}
                    <span className="text-[10px] ml-1 opacity-50">
                      {tag.articleCount}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Ad Placeholder */}
            <div className="bg-muted rounded-xl border border-border flex items-center justify-center h-64 text-xs text-muted-foreground uppercase tracking-widest">
              Iklan / Ad Space
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
