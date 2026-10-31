import Link from "next/link";
import { NewsCard, PopularList } from "@/components/news/NewsCard";
import { articleService } from "@/lib/services/article-service";
import { tagService } from "@/lib/services/tag-service";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await tagService.getBySlug(slug);
  if (!tag) return { title: "Tag Tidak Ditemukan" };
  return { title: `#${tag.name} — Berita Terkait`, description: `Kumpulan berita dengan tag ${tag.name}` };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const [tag, trendingTags, popular] = await Promise.all([
    tagService.getBySlug(slug),
    tagService.getTrending(12),
    articleService.getPopular(5),
  ]);

  if (!tag) notFound();

  const displayArticles = await articleService.getByTag(slug, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Beranda</Link>
        <span>/</span>
        <span className="text-foreground">#{tag.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-black">#{tag.name}</h1>
        {tag.description && <p className="text-muted-foreground text-sm mt-2">{tag.description}</p>}
        <span className="text-xs font-semibold text-brand bg-brand-light px-3 py-1 rounded-full mt-3 inline-block">
          {tag.articleCount} artikel
        </span>
      </div>

      {/* Other Tags */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none pb-2">
        {trendingTags.map((t) => (
          <Link key={t.id} href={`/tag/${t.slug}`}
            className={`flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
              t.slug === slug ? "bg-brand text-white border-brand" : "bg-background text-muted-foreground border-border hover:border-brand hover:text-brand"
            }`}>
            #{t.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {displayArticles.map((article) => (<NewsCard key={article.id} article={article} />))}
          </div>
        </div>
        <aside className="space-y-6">
          <PopularList articles={popular} />
        </aside>
      </div>
    </div>
  );
}
