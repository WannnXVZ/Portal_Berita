"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft, Newspaper } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Decorative Element */}
        <div className="relative">
          <div className="text-[12rem] font-black text-brand/5 select-none leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-brand text-white p-4 rounded-2xl shadow-2xl rotate-3 animate-bounce-slow">
              <Newspaper className="h-12 w-12" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold font-serif text-foreground">
            Berita Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Sepertinya halaman yang Anda cari telah dipindahkan, dihapus, atau memang tidak pernah ada sejak awal.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Home className="h-4 w-4" /> Kembali ke Beranda
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Search className="h-4 w-4" /> Cari Berita Lain
          </Link>
        </div>

        {/* Footer Link */}
        <button
          onClick={() => window.history.back()}
          className="text-sm text-muted-foreground hover:text-brand flex items-center justify-center gap-1 mx-auto transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Kembali ke Halaman Sebelumnya
        </button>
      </div>
    </div>
  );
}
