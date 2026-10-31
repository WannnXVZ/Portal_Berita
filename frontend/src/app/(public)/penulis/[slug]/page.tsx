import Link from "next/link";
import Image from "next/image";
import { NewsCard } from "@/components/news/NewsCard";
import { authors, articles, getAuthorById, isArticleExpired } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorById(slug);
  if (!author) return { title: "Penulis Tidak Ditemukan" };
  return { title: `${author.name} — Profil Penulis`, description: author.bio || `Artikel oleh ${author.name}` };
}

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.id }));
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = getAuthorById(slug);
  if (!author) notFound();

  const authorArticles = articles.filter((a) => a.author.id === author.id && a.status === "published" && !isArticleExpired(a));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Beranda</Link>
        <span>/</span>
        <span className="text-foreground">{author.name}</span>
      </nav>

      {/* Author Profile */}
      <div className="bg-card rounded-xl border border-border p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {author.avatar && (
            <Image src={author.avatar} alt={author.name} width={96} height={96} className="rounded-full border-4 border-brand-light" />
          )}
          <div className="text-center sm:text-left">
            <h1 className="font-serif text-2xl sm:text-3xl font-black">{author.name}</h1>
            <span className="text-xs font-bold uppercase tracking-wider text-brand bg-brand-light px-3 py-1 rounded-full mt-2 inline-block">
              {author.role === "author" ? "Penulis / Jurnalis" : author.role}
            </span>
            {author.bio && <p className="text-muted-foreground text-sm mt-3 max-w-xl leading-relaxed">{author.bio}</p>}
            <div className="flex items-center gap-4 mt-4 justify-center sm:justify-start">
              <span className="text-sm font-semibold text-foreground">{author.articleCount} artikel</span>
              {author.socialLinks && (
                <div className="flex gap-2">
                  {Object.entries(author.socialLinks).map(([platform, url]) => (
                    <a key={platform} href={url} className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full hover:text-brand hover:bg-brand-light transition-all capitalize">
                      {platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Author Articles */}
      <h2 className="font-serif text-xl font-bold mb-5">Artikel oleh {author.name}</h2>
      {authorArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {authorArticles.map((article) => (<NewsCard key={article.id} article={article} />))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm py-10 text-center">Belum ada artikel dari penulis ini.</p>
      )}
    </div>
  );
}
