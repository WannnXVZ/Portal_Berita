"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to an error reporting service if needed
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-red-100 p-8 sm:p-12 text-center space-y-8">
        {/* Error Icon */}
        <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center animate-pulse">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold font-serif text-foreground">
            Waduh, Ada Masalah Teknis!
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Sesuatu yang tidak beres terjadi di sistem kami. Tim teknis kami mungkin sedang memperbaikinya saat ini.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-4">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <RefreshCcw className="h-4 w-4" /> Coba Lagi
          </button>
          <Link
            href="/"
            className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Home className="h-4 w-4" /> Balik ke Beranda
          </Link>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Jika masalah berlanjut, hubungi kami melalui{" "}
            <Link href="#" className="text-brand font-semibold hover:underline flex items-center justify-center gap-1 mt-1">
              <MessageSquare className="h-3 w-3" /> Pusat Bantuan
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
