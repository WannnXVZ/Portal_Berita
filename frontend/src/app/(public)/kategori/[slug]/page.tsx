import Link from "next/link";
import { NewsCard, PopularList } from "@/components/news/NewsCard";
import { articleService } from "@/lib/services/article-service";
import { categoryService } from "@/lib/services/category-service";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await categoryService.getBySlug(slug);
  if (!category) return { title: "Kategori Tidak Ditemukan" };
  return {
    title: `${category.name} — Berita Terbaru`,
    description: category.description || `Berita terbaru kategori ${category.name} di Tanah Merah News!`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [category, allCategories, popular] = await Promise.all([
    categoryService.getBySlug(slug),
    categoryService.getAll(),
    articleService.getPopular(5),
  ]);

  if (!category) notFound();

  const displayArticles = await articleService.getByCategory(slug, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Beranda</Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {category.icon && <span className="text-2xl">{category.icon}</span>}
          <h1 className="font-serif text-2xl sm:text-3xl font-black">{category.name}</h1>
        </div>
        {category.description && (
          <p className="text-muted-foreground text-sm max-w-2xl">{category.description}</p>
        )}
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs font-semibold text-brand bg-brand-light px-3 py-1 rounded-full">
            {category.articleCount} artikel
          </span>
        </div>
      </div>

      {/* Category Nav */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none pb-2">
        {allCategories.slice(0, 12).map((cat) => (
          <Link
            key={cat.id}
            href={`/kategori/${cat.slug}`}
            className={`flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
              cat.slug === slug
                ? "bg-brand text-white border-brand"
                : "bg-background text-muted-foreground border-border hover:border-brand hover:text-brand"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Articles Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {displayArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination placeholder */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`h-9 w-9 rounded-lg text-sm font-semibold transition-all ${
                  page === 1
                    ? "bg-brand text-white"
                    : "bg-muted text-muted-foreground hover:bg-brand-light hover:text-brand"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="h-9 px-4 rounded-lg text-sm font-semibold bg-muted text-muted-foreground hover:bg-brand-light hover:text-brand transition-all">
              Selanjutnya →
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <PopularList articles={popular} />
          <div className="bg-muted rounded-xl border border-border flex items-center justify-center h-64 text-xs text-muted-foreground uppercase tracking-widest">
            Iklan / Ad Space
          </div>
        </aside>
      </div>
    </div>
  );
}
