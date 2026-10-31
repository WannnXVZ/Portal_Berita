"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, X, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { categories } from "@/lib/mock-data";

const mainCategories = categories.slice(0, 10);

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand via-gold to-brand animate-shimmer" />

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger className="lg:hidden p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
            <div className="p-6 border-b border-border">
              <Link href="/" className="font-serif text-xl font-black">
                Tanah Merah <span className="text-brand">News</span>
                <span className="text-gold">!</span>
              </Link>
            </div>
            <nav className="p-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/kategori/${cat.slug}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="font-serif text-lg sm:text-xl font-black tracking-tight">
          Tanah Merah <span className="text-brand">News</span>
          <span className="text-gold">!</span>
        </Link>

        {/* Search */}
        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2 animate-in slide-in-from-right-5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berita..."
                className="w-40 sm:w-64 h-9 px-3 rounded-lg border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
          )}
          <Link href="/admin/login" className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-brand" title="Panel Redaksi">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav className="border-t border-border bg-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {mainCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="flex-shrink-0 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-brand hover:bg-brand-light rounded-md transition-all"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/kategori"
              className="flex-shrink-0 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand hover:bg-brand-light rounded-md transition-all"
            >
              Semua →
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
