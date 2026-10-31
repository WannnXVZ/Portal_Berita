"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, FileText, FolderOpen, Tags, Image as ImageIcon,
  Users, BarChart3, Settings, LogOut, Menu, X, Newspaper,
  Megaphone, MessageSquare, ChevronLeft,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Artikel", icon: FileText },
  { href: "/admin/categories", label: "Kategori", icon: FolderOpen },
  { href: "/admin/tags", label: "Tag", icon: Tags },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/breaking-news", label: "Breaking News", icon: Megaphone },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

import { logoutAction } from "../actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    try {
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin_user="));
      if (match) {
        const parsed = JSON.parse(decodeURIComponent(match.split("=")[1]));
        setCurrentUser(parsed);
      }
    } catch {
      // Fallback
    }
  }, []);

  const roleDisplayMap: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    editor: "Editor",
    reviewer: "Reviewer",
    author: "Penulis",
  };

  const displayName = currentUser?.name || "Admin User";
  const displayRole = currentUser?.role ? (roleDisplayMap[currentUser.role] || currentUser.role) : "Super Admin";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AU";

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#0F0F0F] text-white flex flex-col transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-14 border-b border-white/8 flex items-center px-4 justify-between flex-shrink-0">
          {!collapsed && (
            <Link href="/admin/dashboard" className="font-serif text-sm font-black truncate">
              Tanah Merah <span className="text-[#C8102E]">News</span>
              <span className="text-[#D4A843]">!</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-3">
          <nav className="px-2 space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#C8102E] text-white shadow-lg shadow-[#C8102E]/20"
                      : "text-white/50 hover:text-white hover:bg-white/8"
                  } ${collapsed ? "justify-center px-0" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Bottom */}
        <div className="border-t border-white/8 p-2 flex-shrink-0">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/8 transition-all ${
              collapsed ? "justify-center px-0" : ""
            }`}
            title="Lihat Portal"
          >
            <Newspaper className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Lihat Portal</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-red-400 hover:bg-white/8 transition-all ${
              collapsed ? "justify-center px-0" : ""
            }`}
            title="Logout"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "lg:ml-16" : "lg:ml-60"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-border flex items-center px-4 sm:px-6 gap-4">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground capitalize">
              {navItems.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.label || "Admin"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold">{displayName}</div>
              <div className="text-[10px] text-muted-foreground">{displayRole}</div>
            </div>
            <div
              className="w-8 h-8 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-xs font-bold shadow-sm"
              title={`${displayName} (${displayRole})`}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
