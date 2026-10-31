"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Send, Eye, ImagePlus, X, Trash2, Clock, Calendar, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { categories, tags as availableTags } from "@/lib/mock-data";
import { api } from "@/lib/api-client";
import Image from "next/image";
import { toast } from "sonner";

const articleSchema = z.object({
  title: z.string().min(5, { message: "Judul minimal 5 karakter" }),
  slug: z.string().min(5, { message: "Slug minimal 5 karakter" }),
  excerpt: z.string().optional(),
  content: z.string().min(20, { message: "Konten minimal 20 karakter" }),
  category: z.string().min(1, { message: "Kategori wajib dipilih" }),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  isFeatured: z.boolean().default(false),
  isBreaking: z.boolean().default(false),
  expiredAt: z.string().optional(),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function CreateArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema) as any,
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      tags: [],
      seoTitle: "",
      seoDescription: "",
      isFeatured: false,
      isBreaking: false,
      expiredAt: "",
    },
  });

  const { watch, setValue } = form;
  const title = watch("title");
  const slug = watch("slug");
  const seoTitle = watch("seoTitle");
  const seoDescription = watch("seoDescription");
  const excerpt = watch("excerpt");
  const selectedTags = watch("tags");

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && value.title) {
        const newSlug = generateSlug(value.title);
        setValue("slug", newSlug, { shouldValidate: true });
        if (!form.getValues("seoTitle")) {
          setValue("seoTitle", value.title.slice(0, 70));
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, form]);

  const toggleTag = (tagId: string) => {
    const currentTags = form.getValues("tags");
    const newTags = currentTags.includes(tagId) 
      ? currentTags.filter((t) => t !== tagId) 
      : [...currentTags, tagId];
    setValue("tags", newTags, { shouldValidate: true });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran gambar maksimal 5MB");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      // Ambil token dari cookie untuk autentikasi upload
      const tokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin_client_token="));
      const token = tokenCookie ? decodeURIComponent(tokenCookie.split("=")[1]) : null;

      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/media/upload`, {
          method: "POST",
          body: formData,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        
        if (!response.ok) throw new Error("Gagal upload");
        
        const data = await response.json();
        setPreviewUrl(data.url);
        toast.success("Gambar berhasil diunggah");
      } catch (error) {
        toast.error("Gagal mengunggah gambar");
      } finally {
        setLoading(false);
      }
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (values: ArticleFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        featuredImage: previewUrl,
        status: "draft", // Default ke draft untuk review
      };

      await api.post("/articles", payload);
      
      toast.success("Artikel berhasil diajukan untuk review!");
      router.push("/admin/articles");
    } catch (error) {
      toast.error("Gagal menyimpan artikel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Link href="/admin/articles" className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold font-serif">Artikel Baru</h1>
                <p className="text-xs text-muted-foreground">Draft otomatis tersimpan</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="text-sm font-semibold px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2">
                <Eye className="h-4 w-4" /> Preview
              </button>
              <button type="button" className="text-sm font-semibold px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2">
                <Save className="h-4 w-4" /> Simpan Draft
              </button>
              <Button type="submit" disabled={loading} className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 h-10">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit Review
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title & Slug */}
              <div className="bg-white rounded-xl border border-border p-5 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Judul Artikel *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tulis judul artikel yang menarik..."
                          className="text-lg font-bold h-12"
                          {...field}
                        />
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
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug URL</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden h-10">
                          <span className="bg-muted px-3 h-full flex items-center text-xs text-muted-foreground border-r border-border flex-shrink-0">/artikel/</span>
                          <input
                            className="flex-1 px-3 py-2 text-sm focus:outline-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Featured Image */}
              <div className="bg-white rounded-xl border border-border p-5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Gambar Utama</Label>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange}
                />

                {previewUrl ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-border group">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-white rounded-full hover:bg-brand-light transition-colors"
                      >
                        <ImagePlus className="h-5 w-5 text-foreground" />
                      </button>
                      <button 
                        type="button"
                        onClick={removeImage}
                        className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-brand hover:bg-brand-light/30 transition-all cursor-pointer"
                  >
                    <ImagePlus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Klik atau drag & drop gambar</p>
                    <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, atau WebP. Maks 5MB</p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="bg-white rounded-xl border border-border p-5">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Isi Artikel *</FormLabel>
                      <FormControl>
                        <RichTextEditor 
                          value={field.value} 
                          onChange={field.onChange} 
                          placeholder="Tulis isi artikel di sini..." 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-xl border border-border p-5">
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ringkasan / Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ringkasan singkat artikel untuk card preview dan meta description..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-5">
              {/* Category */}
              <div className="bg-white rounded-xl border border-border p-5">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kategori *</FormLabel>
                      <FormControl>
                        <select
                          className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
                          {...field}
                        >
                          <option value="">Pilih kategori...</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl border border-border p-5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Tag</Label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                        selectedTags.includes(tag.id)
                          ? "bg-brand text-white border-brand"
                          : "bg-background text-muted-foreground border-border hover:border-brand"
                      }`}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flags */}
              <div className="bg-white rounded-xl border border-border p-5 space-y-4">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Pengaturan</Label>
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <span className="text-sm font-medium">Artikel Unggulan</span>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isBreaking"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <span className="text-sm font-medium">Breaking News</span>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="pt-2 border-t border-border mt-2 space-y-2">
                  <FormField
                    control={form.control}
                    name="expiredAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" /> Jadwal Expired (Opsional)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            className="text-xs h-9"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[10px] italic">
                          Kosongkan jika artikel tidak pernah kadaluarsa.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* SEO */}
              <div className="bg-white rounded-xl border border-border p-5 space-y-4">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">SEO</Label>
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">SEO Title ({field.value?.length || 0}/70)</FormLabel>
                      <FormControl>
                        <Input placeholder="Title untuk search engine" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Meta Description ({field.value?.length || 0}/160)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Deskripsi untuk search engine" className="min-h-[60px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Preview */}
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Pratinjau Google</p>
                  <p className="text-sm font-medium text-blue-700 line-clamp-1">{seoTitle || title || "Judul Artikel"} | Tanah Merah News!</p>
                  <p className="text-xs text-green-700">tanahmera.news/artikel/{slug || "..."}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{seoDescription || excerpt || "Meta description akan muncul di sini..."}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
