import Link from "next/link";
import { categories } from "@/lib/mock-data";

export function Footer() {
  const mainCats = categories.slice(0, 8);

  return (
    <footer className="bg-[#0F0F0F] text-white/50 mt-auto">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand via-gold to-brand" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="font-serif text-xl font-black text-white inline-block">
              Tanah Merah <span className="text-brand">News</span>
              <span className="text-gold">!</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              Portal berita digital modern, cepat, dan terpercaya untuk Kalimantan Timur dan Nusantara.
            </p>
            <div className="flex gap-3 mt-4">
              {["Facebook", "Twitter", "Instagram", "YouTube"].map((social) => (
                <a key={social} href="#" className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/10 hover:border-brand hover:text-brand transition-all">
                  {social.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/80 mb-4">Kategori</h3>
            <nav className="flex flex-col gap-2">
              {mainCats.map((cat) => (
                <Link key={cat.id} href={`/kategori/${cat.slug}`} className="text-sm hover:text-white transition-colors">
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Redaksi */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/80 mb-4">Redaksi</h3>
            <nav className="flex flex-col gap-2">
              {["Tentang Kami", "Susunan Redaksi", "Pedoman Media Siber", "Kode Etik"].map((item) => (
                <Link key={item} href="#" className="text-sm hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/80 mb-4">Kontak</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <span>📍 Samarinda, Kalimantan Timur</span>
              <span>📧 redaksi@tanahmera.news</span>
              <span>📱 +62 812-3456-7890</span>
              <div className="flex flex-col gap-2 mt-2">
                <Link href="#" className="text-brand hover:text-brand-muted transition-colors font-medium">
                  Pasang Iklan →
                </Link>
                <Link href="/admin/login" className="text-xs text-white/30 hover:text-white transition-colors">
                  Panel Redaksi
                </Link>
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs">© 2026 Tanah Merah News! — All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
            <Link href="#" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
