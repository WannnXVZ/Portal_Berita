"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, GripVertical, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { categories as mockCategories } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import useSWR from "swr";
import { Category } from "@/types";
import { api } from "@/lib/api-client";

const categorySchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  slug: z.string().min(2, { message: "Slug minimal 2 karakter" }),
  icon: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const { data: categoriesData, isLoading, mutate } = useSWR<Category[]>("/categories");
  const categories = categoriesData || (mockCategories as Category[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      icon: "📰",
      description: "",
      isActive: true,
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const newCategory = {
        id: `cat-${Date.now()}`,
        ...values,
        articleCount: 0,
        sortOrder: 0,
      };
      
      // Optimistic update
      mutate([newCategory, ...categories], false);
      
      await api.post("/categories", values);
      
      toast.success("Kategori berhasil ditambahkan");
      setIsDialogOpen(false);
      form.reset();
      mutate(); // Revalidate
    } catch (error) {
      mutate(); // Rollback
      toast.error("Gagal menambahkan kategori");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-serif">Kategori</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{categories.length} kategori</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={
              <button className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2" />
            }
          >
            <Plus className="h-4 w-4" /> Kategori Baru
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif">Tambah Kategori Baru</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Kategori</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama kategori..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="nama-kategori" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon (Emoji)</FormLabel>
                      <FormControl>
                        <Input placeholder="📰" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Deskripsi kategori..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <span className="text-sm font-medium">Aktif</span>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand hover:bg-brand-dark text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan
                </button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari kategori..." className="max-w-xs" />
        </div>
        <div className="overflow-x-auto">
          {isLoading && !categoriesData ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
              <p className="text-sm text-muted-foreground">Memuat kategori...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border">
                <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider w-10">#</th>
                <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Kategori</th>
                <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Slug</th>
                <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Artikel</th>
                <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-right p-3 w-20"></th>
              </tr></thead>
              <tbody>
                {filtered.map((cat) => (
                  <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-muted-foreground"><GripVertical className="h-4 w-4 cursor-grab" /></td>
                    <td className="p-3"><div className="flex items-center gap-2"><span className="text-lg">{cat.icon}</span><span className="font-semibold">{cat.name}</span></div></td>
                    <td className="p-3 hidden sm:table-cell"><span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{cat.slug}</span></td>
                    <td className="p-3 hidden md:table-cell"><span className="text-xs text-muted-foreground">{cat.articleCount}</span></td>
                    <td className="p-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.isActive ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-500"}`}>{cat.isActive ? "Aktif" : "Nonaktif"}</span></td>
                    <td className="p-3 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Edit"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Hapus"><Trash2 className="h-3.5 w-3.5 text-red-500" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
