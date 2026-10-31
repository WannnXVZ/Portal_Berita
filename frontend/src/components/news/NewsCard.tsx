import Link from "next/link";
import Image from "next/image";
import { Clock, Eye } from "lucide-react";
import type { Article } from "@/types";
import { formatRelativeTime } from "@/lib/mock-data";

interface NewsCardProps {
  article: Article;
  variant?: "default" | "horizontal" | "compact";
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
  if (variant === "horizontal") {
    return (
      <Link href={`/artikel/${article.slug}`} className="group flex gap-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
        <div className="relative w-28 h-20 sm:w-32 sm:h-22 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          {article.featuredImage && (
            <Image src={article.featuredImage} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="128px" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand">{article.category?.name || "Umum"}</span>
          <h3 className="text-sm font-bold text-foreground leading-snug mt-0.5 line-clamp-2 group-hover:text-brand transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeTime(article.publishedAt!)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/artikel/${article.slug}`} className="group flex items-start gap-3 py-2.5 border-b border-border last:border-0">
        <span className="text-2xl font-black text-muted-foreground/30 font-serif leading-none flex-shrink-0 w-7 text-right">
          {/* Ranking number passed as children or via index */}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-brand transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
            <span className="text-brand font-semibold">{article.category?.name || "Umum"}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.viewCount.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/artikel/${article.slug}`} className="group block rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[16/9] bg-muted overflow-hidden">
        {article.featuredImage && (
          <Image src={article.featuredImage} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        )}
        {article.isBreaking && (
          <span className="absolute top-3 left-3 bg-brand text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            Breaking
          </span>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-brand px-2.5 py-1 rounded-full">
            {article.category?.name || "Umum"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-foreground leading-snug line-clamp-2 group-hover:text-brand transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {article.author?.avatar && (
              <Image src={article.author.avatar} alt={article.author.name || "Penulis"} width={20} height={20} className="rounded-full" />
            )}
            <span className="font-medium">{article.author?.name || "Redaksi"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readingTime} min</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.viewCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface PopularListProps {
  articles: Article[];
  title?: string;
}

export function PopularList({ articles, title = "Terpopuler" }: PopularListProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-brand text-lg">🔥</span>
        <h3 className="font-serif font-bold text-lg">{title}</h3>
      </div>
      <div className="space-y-0">
        {articles.map((article, idx) => (
          <Link key={article.id} href={`/artikel/${article.slug}`} className="group flex items-start gap-3 py-3 border-b border-border last:border-0">
            <span className="text-2xl font-black text-brand/20 font-serif leading-none flex-shrink-0 w-7 text-right">
              {idx + 1}
            </span>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                <span className="text-brand font-semibold">{article.category?.name || "Umum"}</span>
                <span>·</span>
                <span>{article.viewCount.toLocaleString()} views</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
