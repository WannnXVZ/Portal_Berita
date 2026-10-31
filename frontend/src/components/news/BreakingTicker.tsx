"use client";

import Link from "next/link";
import { breakingNews } from "@/lib/mock-data";

export function BreakingTicker() {
  const activeNews = breakingNews.filter((n) => n.isActive);
  if (activeNews.length === 0) return null;

  // Double the items for seamless loop
  const items = [...activeNews, ...activeNews];

  return (
    <div className="bg-brand text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-9">
        <span className="flex-shrink-0 bg-white text-brand text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded mr-3">
          Breaking
        </span>
        <div className="overflow-hidden flex-1 relative">
          <div className="animate-ticker flex whitespace-nowrap">
            {items.map((news, idx) => (
              <span key={`${news.id}-${idx}`} className="inline-flex items-center mx-8">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mr-3 flex-shrink-0" />
                {news.link ? (
                  <Link href={news.link} className="text-xs font-medium hover:underline underline-offset-2">
                    {news.text}
                  </Link>
                ) : (
                  <span className="text-xs font-medium">{news.text}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
