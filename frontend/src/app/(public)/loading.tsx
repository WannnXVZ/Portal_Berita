import { NewsCardSkeleton, NewsCardHorizontalSkeleton } from "@/components/news/NewsCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

export default function PublicLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* ── Hero Section Skeleton ── */}
      <section className="bg-[#0F0F0F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Featured Article Skeleton */}
            <div className="lg:col-span-2 relative rounded-xl overflow-hidden aspect-[16/9] lg:aspect-auto lg:min-h-[420px] bg-gray-800/50 animate-pulse">
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 space-y-4">
                <Skeleton className="h-5 w-24 bg-white/10" />
                <Skeleton className="h-10 w-3/4 bg-white/20" />
                <Skeleton className="h-10 w-1/2 bg-white/20" />
                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-4 w-32 bg-white/10" />
                  <Skeleton className="h-4 w-20 bg-white/10" />
                </div>
              </div>
            </div>

            {/* Editor's Choice Skeleton */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-4 w-28 bg-white/10" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative rounded-lg overflow-hidden aspect-[16/7] bg-gray-800/50 flex-1 animate-pulse">
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 space-y-2">
                    <Skeleton className="h-3 w-16 bg-white/10" />
                    <Skeleton className="h-4 w-full bg-white/20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trending Tags Skeleton ── */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <Skeleton className="h-3 w-16" />
            </div>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content Skeleton ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Left: Latest News Skeleton */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <aside className="space-y-6">
            <div className="bg-white rounded-xl border border-border p-5">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <NewsCardHorizontalSkeleton key={i} />
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-border p-5">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-7 w-24 rounded-full" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
