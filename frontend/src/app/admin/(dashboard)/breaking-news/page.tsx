"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, GripVertical, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { breakingNews as mockBreakingNews } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

// ── Types ───────────────────────────────────────────────────────────────────
interface BreakingNewsItem {
  id: string;
  text: string;
  link?: string;
  isActive: boolean;
}

// ── Schema ──────────────────────────────────────────────────────────────────
const breakingNewsSchema = z.object({
  text: z.string().min(5, { message: "Teks berita minimal 5 karakter" }),
  link: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
});

type BreakingNewsFormValues = z.infer<typeof breakingNewsSchema>;

// ── Component ───────────────────────────────────────────────────────────────
export default function BreakingNewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState<BreakingNewsItem[]>(mockBreakingNews as BreakingNewsItem[]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BreakingNewsItem | null>(null);
  const [loading, setLoading] = useState(false);

  // ── Form: Tambah ──
  const addForm = useForm<BreakingNewsFormValues>({
    resolver: zodResolver(breakingNewsSchema),
    defaultValues: { text: "", link: "", isActive: true },
  });

  // ── Form: Edit ──
  const editForm = useForm<BreakingNewsFormValues>({
    resolver: zodResolver(breakingNewsSchema),
    defaultValues: { text: "", link: "", isActive: true },
  });

  // ── Buka Dialog Edit ──
  const openEditDialog = (item: BreakingNewsItem) => {
    setEditingItem(item);
    editForm.reset({
      text: item.text,
      link: item.link || "",
      isActive: item.isActive,
    });
    setIsEditDialogOpen(true);
  };

  // ── Handler: Tambah ──
  const onAddSubmit = async (values: BreakingNewsFormValues) => {
    setLoading(true);
    try {
      // TODO: Ganti dengan API call saat backend tersedia
      await new Promise(resolve => setTimeout(resolve, 600));

      const newItem: BreakingNewsItem = {
        id: `bn-${Date.now()}`,
        text: values.text,
        link: values.link || undefined,
        isActive: values.isActive,
      };

      setNews(prev => [newItem, ...prev]);
      toast.success("Breaking news berhasil ditambahkan");
      setIsAddDialogOpen(false);
      addForm.reset();
    } catch (error) {
      toast.error("Gagal menambahkan breaking news");
    } finally {
      setLoading(false);
    }
  };

  // ── Handler: Edit ──
  const onEditSubmit = async (values: BreakingNewsFormValues) => {
    if (!editingItem) return;
    setLoading(true);
    try {
      // TODO: Ganti dengan API call saat backend tersedia
      await new Promise(resolve => setTimeout(resolve, 600));

      setNews(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? { ...item, text: values.text, link: values.link || undefined, isActive: values.isActive }
            : item
        )
      );

      toast.success("Breaking news berhasil diperbarui");
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error("Gagal memperbarui breaking news");
    } finally {
      setLoading(false);
    }
  };

  // ── Handler: Toggle Aktif ──
  const handleToggleActive = (id: string) => {
    setNews(prev =>
      prev.map(item => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
    toast.success("Status berhasil diubah");
  };

  // ── Handler: Hapus ──
  const handleDelete = async (item: BreakingNewsItem) => {
    if (!confirm(`Hapus breaking news "${item.text.slice(0, 50)}..."?`)) return;

    setNews(prev => prev.filter(n => n.id !== item.id));
    toast.success("Breaking news berhasil dihapus");
    // TODO: api.delete(`/breaking-news/${item.id}`) saat backend tersedia
  };

  const filtered = news.filter(b => b.text.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-serif">Breaking News</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Kelola ticker berita berjalan</p>
        </div>

        {/* Dialog Tambah — Base UI DialogTrigger pakai render prop */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger
            render={
              <button className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2" />
            }
          >
            <Plus className="h-4 w-4" /> Ticker Baru
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif">Tambah Ticker Baru</DialogTitle>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4 pt-2">
                <FormField control={addForm.control} name="text" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teks Berita *</FormLabel>
                    <FormControl><Input placeholder="BREAKING: ..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={addForm.control} name="link" render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL / Link (Opsional)</FormLabel>
                    <FormControl><Input placeholder="/artikel/..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={addForm.control} name="isActive" render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <span className="text-sm font-medium">Aktif Tampil</span>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
                <button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-dark text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan
                </button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari teks breaking news..."
            className="max-w-xs"
          />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider w-10">#</th>
              <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Teks Berita</th>
              <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Link</th>
              <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
              <th className="text-right p-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3 text-muted-foreground">
                  <GripVertical className="h-4 w-4 cursor-grab" />
                </td>
                <td className="p-3">
                  <p className="font-medium line-clamp-1">{item.text}</p>
                </td>
                <td className="p-3 hidden sm:table-cell">
                  {item.link ? (
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded truncate max-w-[200px] inline-block">
                      {item.link}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </td>
                <td className="p-3">
                  {/* Toggle langsung dari tabel */}
                  <button
                    onClick={() => handleToggleActive(item.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                      item.isActive
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                        : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                    }`}
                    title="Klik untuk toggle"
                  >
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </button>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => openEditDialog(item)}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-sm text-muted-foreground">
                  Tidak ada breaking news ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog Edit */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={open => { setIsEditDialogOpen(open); if (!open) setEditingItem(null); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Ticker</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 pt-2">
              <FormField control={editForm.control} name="text" render={({ field }) => (
                <FormItem>
                  <FormLabel>Teks Berita *</FormLabel>
                  <FormControl><Input placeholder="BREAKING: ..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="link" render={({ field }) => (
                <FormItem>
                  <FormLabel>URL / Link (Opsional)</FormLabel>
                  <FormControl><Input placeholder="/artikel/..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <span className="text-sm font-medium">Aktif Tampil</span>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />
              <button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-dark text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
