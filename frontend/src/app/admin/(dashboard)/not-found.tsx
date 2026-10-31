"use client";

import Link from "next/link";
import { Search, LayoutDashboard, ArrowLeft } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-2xl border border-border">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold font-serif mb-2 text-foreground">
        Halaman Panel Tidak Ditemukan
      </h1>
      <p className="text-muted-foreground max-w-sm mb-8">
        Maaf, modul atau halaman manajemen yang Anda cari tidak tersedia atau mungkin Anda tidak memiliki akses.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Link 
          href="/admin"
          className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <LayoutDashboard className="h-4 w-4" /> Balik ke Dashboard
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="bg-muted hover:bg-muted/80 text-foreground px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>
      </div>
    </div>
  );
}
