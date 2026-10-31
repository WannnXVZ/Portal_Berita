import { Eye, TrendingUp, FileText, Users } from "lucide-react";
import { categories, articles, getPopularArticles } from "@/lib/mock-data";

export default function AnalyticsPage() {
  const popular = getPopularArticles(10);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-serif">Analytics</h1>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Views Hari Ini", value: "12,450", icon: Eye, color: "text-brand bg-brand/10" },
          { label: "Views Minggu Ini", value: "84,230", icon: TrendingUp, color: "text-blue-600 bg-blue-50" },
          { label: "Artikel Bulan Ini", value: "42", icon: FileText, color: "text-green-600 bg-green-50" },
          { label: "Penulis Aktif", value: "8", icon: Users, color: "text-amber-600 bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color} mb-3`}><s.icon className="h-5 w-5" /></div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-bold text-sm mb-4">📈 Traffic 7 Hari Terakhir</h3>
          <div className="h-48 flex items-end gap-2">
            {[12450, 10200, 15600, 13800, 11900, 16200, 14500].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-brand/15 hover:bg-brand/30 rounded-t-md transition-colors group relative" style={{ height: `${(v / 16200) * 100}%` }}>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-brand opacity-0 group-hover:opacity-100">{(v/1000).toFixed(1)}K</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{["5/5", "6/5", "7/5", "8/5", "9/5", "10/5", "11/5"][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-bold text-sm mb-4">📊 Views per Kategori</h3>
          <div className="space-y-3">
            {categories.slice(0, 6).map((cat) => {
              const pct = Math.min(100, Math.floor((cat.articleCount! / 312) * 100));
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{cat.icon} {cat.name}</span>
                    <span className="text-xs text-muted-foreground">{cat.articleCount} artikel</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Articles */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="font-bold text-sm mb-4">🔥 Top 10 Artikel</h3>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            <th className="text-left pb-2 text-xs text-muted-foreground uppercase">#</th>
            <th className="text-left pb-2 text-xs text-muted-foreground uppercase">Judul</th>
            <th className="text-left pb-2 text-xs text-muted-foreground uppercase hidden sm:table-cell">Kategori</th>
            <th className="text-left pb-2 text-xs text-muted-foreground uppercase hidden md:table-cell">Penulis</th>
            <th className="text-right pb-2 text-xs text-muted-foreground uppercase">Views</th>
          </tr></thead>
          <tbody>
            {popular.map((a, i) => (
              <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="py-2.5 text-brand font-bold">{i + 1}</td>
                <td className="py-2.5 font-medium line-clamp-1">{a.title}</td>
                <td className="py-2.5 hidden sm:table-cell text-xs text-muted-foreground">{a.category.name}</td>
                <td className="py-2.5 hidden md:table-cell text-xs text-muted-foreground">{a.author.name}</td>
                <td className="py-2.5 text-right text-xs font-semibold">{a.viewCount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
