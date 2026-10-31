"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { tags as mockTags } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Tag } from "@/types";
import { api } from "@/lib/api-client";

const tagSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  slug: z.string().min(2, { message: "Slug minimal 2 karakter" }),
});

type TagFormValues = z.infer<typeof tagSchema>;

export default function TagsPage() {
  const { data: tagsData, isLoading, mutate } = useSWR<Tag[]>("/tags");
  const tags = tagsData || (mockTags as Tag[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const onSubmit = async (values: TagFormValues) => {
    setIsSubmitting(true);
    try {
      const newTag = {
        id: `tag-${Date.now()}`,
        ...values,
        articleCount: 0,
      };
      
      mutate([newTag, ...tags], false);
      
      await api.post("/tags", values);
      
      toast.success("Tag berhasil ditambahkan");
      setIsDialogOpen(false);
      form.reset();
      mutate();
    } catch (error) {
      mutate();
      toast.error("Gagal menambahkan tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = tags.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-serif">Tag</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{tags.length} tag</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={
              <button className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2" />
            }
          >
            <Plus className="h-4 w-4" /> Tag Baru
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-serif">Tambah Tag Baru</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Tag</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama tag..." {...field} />
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
                        <Input placeholder="nama-tag" {...field} />
                      </FormControl>
                      <FormMessage />
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

      <div className="bg-white rounded-xl border border-border p-5">
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari tag..." className="max-w-xs mb-4" />
        
        {isLoading && !tagsData ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Loader2 className="h-4 w-4 animate-spin" /> Memuat daftar tag...
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filtered.map((tag) => (
              <div key={tag.id} className="group flex items-center gap-2 bg-muted rounded-full pl-3 pr-1 py-1 hover:bg-brand-light transition-all">
                <span className="text-sm font-semibold text-foreground">#{tag.name}</span>
                <span className="text-[10px] text-muted-foreground">{tag.articleCount}</span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-white rounded-full transition-colors"><Edit className="h-3 w-3 text-muted-foreground" /></button>
                  <button className="p-1 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="h-3 w-3 text-red-500" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
