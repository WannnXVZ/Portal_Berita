import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { PopularList } from "@/components/news/NewsCard";
import { NewsCard } from "@/components/news/NewsCard";
import { formatDate } from "@/lib/mock-data";
import { articleService } from "@/lib/services/article-service";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await articleService.getBySlug(slug);
  if (!article) return { title: "Artikel Tidak Ditemukan" };
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.featuredImage ? [article.featuredImage] : [],
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author?.name || "Redaksi"],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await articleService.getBySlug(slug);
  if (!article) notFound();

  const [related, popular] = await Promise.all([
    article.category?.slug ? articleService.getByCategory(article.category.slug, 4) : Promise.resolve([]),
    articleService.getPopular(5),
  ]);

  const filteredRelated = related.filter((a) => a.id !== article.id).slice(0, 3);
  const shareUrl = `https://tanahmera.news/artikel/${article.slug}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Beranda</Link>
        {article.category && (
          <>
            <span>/</span>
            <Link href={`/kategori/${article.category.slug}`} className="hover:text-foreground transition-colors">
              {article.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground truncate max-w-xs">{article.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Article Content */}
        <article className="lg:col-span-2">
          {/* Category & Tags */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {article.category && (
              <Link href={`/kategori/${article.category.slug}`} className="text-xs font-bold uppercase tracking-wider text-brand bg-brand-light px-3 py-1 rounded-full hover:bg-brand hover:text-white transition-all">
                {article.category.name}
              </Link>
            )}
            {article.tags?.map((tag) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`} className="text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full hover:text-brand hover:bg-brand-light transition-all">
                #{tag.name}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-foreground">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center flex-wrap gap-4 mt-5 pb-5 border-b border-border">
            <div className="flex items-center gap-2">
              {article.author?.avatar && (
                <Image src={article.author.avatar} alt={article.author.name || "Penulis"} width={36} height={36} className="rounded-full" />
              )}
              <div>
                <Link href={`/penulis/${article.author?.id || "admin"}`} className="text-sm font-semibold text-foreground hover:text-brand transition-colors">
                  {article.author?.name || "Redaksi"}
                </Link>
                {article.editor && (
                  <span className="text-[11px] text-muted-foreground block">
                    Editor: {article.editor.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground ml-auto">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(article.publishedAt!)}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.readingTime} min baca</span>
              <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{article.viewCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mt-6 bg-muted">
              <Image src={article.featuredImage} alt={article.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
            </div>
          )}

          {/* Article Content */}
          <div className="article-content mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

          {/* Share Buttons */}
          <div className="mt-10 pt-6 border-t border-border">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Share2 className="h-4 w-4" /> Bagikan:
              </span>
              {[
                { name: "WhatsApp", color: "bg-green-600", url: `https://wa.me/?text=${encodeURIComponent(article.title + " " + shareUrl)}` },
                { name: "Facebook", color: "bg-blue-600", url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
                { name: "Twitter", color: "bg-black", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${shareUrl}` },
                { name: "Telegram", color: "bg-sky-500", url: `https://t.me/share/url?url=${shareUrl}&text=${encodeURIComponent(article.title)}` },
              ].map((btn) => (
                <a key={btn.name} href={btn.url} target="_blank" rel="noopener noreferrer" className={`${btn.color} text-white text-xs font-bold px-4 py-2 rounded-full hover:opacity-80 transition-opacity`}>
                  {btn.name}
                </a>
              ))}
            </div>
          </div>

          {/* Author Box */}
          <div className="mt-8 bg-muted/50 rounded-xl p-5 border border-border">
            <div className="flex items-start gap-4">
              {article.author.avatar && (
                <Image src={article.author.avatar} alt={article.author.name} width={56} height={56} className="rounded-full" />
              )}
              <div>
                <Link href={`/penulis/${article.author.id}`} className="font-bold text-foreground hover:text-brand transition-colors">
                  {article.author.name}
                </Link>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{article.author.bio}</p>
                <span className="text-xs text-brand font-semibold mt-2 inline-block">
                  {article.author.articleCount} artikel dipublikasi
                </span>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {filteredRelated.length > 0 && (
            <div className="mt-10">
              <h2 className="font-serif text-xl font-bold mb-5">Berita Terkait</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {filteredRelated.map((a) => (
                  <NewsCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          )}
        </article>

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
