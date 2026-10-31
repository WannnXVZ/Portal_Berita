"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authors as mockAuthors } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import type { User } from "@/types";
import { api } from "@/lib/api-client";

// ── Schema ──────────────────────────────────────────────────────────────────
const userSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }).optional().or(z.literal("")),
  role: z.enum(["super_admin", "admin", "editor", "reviewer", "author"]),
});

type UserFormValues = z.infer<typeof userSchema>;

const roleLabels: Record<string, { label: string; cls: string }> = {
  super_admin: { label: "Super Admin", cls: "bg-red-50 text-red-700" },
  admin: { label: "Admin", cls: "bg-gray-100 text-gray-700" },
  editor: { label: "Editor", cls: "bg-amber-50 text-amber-700" },
  reviewer: { label: "Reviewer", cls: "bg-blue-50 text-blue-700" },
  author: { label: "Author", cls: "bg-green-50 text-green-700" },
};

// ── Component ───────────────────────────────────────────────────────────────
export default function UsersPage() {
  const { data: usersData, isLoading, mutate } = useSWR<User[]>("/users");
  const users: User[] = usersData || mockAuthors;

  const [q, setQ] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Form: Tambah User ──
  const addForm = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", password: "", role: "author" },
  });

  // ── Form: Edit User ──
  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", password: "", role: "author" },
  });

  // ── Buka Dialog Edit ──
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    editForm.reset({
      name: user.name,
      email: user.email || "",
      password: "",
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  // ── Handler: Tambah User ──
  const onAddSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const optimisticUser: User = {
        id: `temp-${Date.now()}`,
        name: values.name,
        email: values.email,
        role: values.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.name}`,
        articleCount: 0,
        bio: "",
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      mutate([optimisticUser, ...users], false);
      await api.post("/users", values);
      toast.success("Pengguna berhasil ditambahkan");
      setIsAddDialogOpen(false);
      addForm.reset();
      mutate();
    } catch (error) {
      mutate();
      toast.error("Gagal menambahkan pengguna");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Handler: Edit User ──
  const onEditSubmit = async (values: UserFormValues) => {
    if (!editingUser) return;
    setIsSubmitting(true);
    try {
      const payload: Record<string, any> = {
        name: values.name,
        email: values.email,
        role: values.role,
      };
      if (values.password) payload.password = values.password;

      const updatedUsers = users.map(u =>
        u.id === editingUser.id ? { ...u, ...payload } : u
      );
      mutate(updatedUsers, false);

      await api.patch(`/users/${editingUser.id}`, payload);
      toast.success("Pengguna berhasil diperbarui");
      setIsEditDialogOpen(false);
      setEditingUser(null);
      mutate();
    } catch (error) {
      mutate();
      toast.error("Gagal memperbarui pengguna");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Handler: Hapus User ──
  const handleDelete = async (user: User) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.name}"?`)) return;

    const updatedUsers = users.filter(u => u.id !== user.id);
    mutate(updatedUsers, false);

    try {
      await api.delete(`/users/${user.id}`);
      toast.success("Pengguna berhasil dihapus");
    } catch (error) {
      mutate();
      toast.error("Gagal menghapus pengguna");
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.email?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif">Pengguna</h1>

        {/* Dialog Tambah User — Base UI DialogTrigger pakai render prop */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger
            render={
              <button className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors" />
            }
          >
            <Plus className="h-4 w-4" /> Tambah User
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif">Tambah Pengguna Baru</DialogTitle>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4 pt-2">
                <FormField control={addForm.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl><Input placeholder="Nama..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={addForm.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="email@tanahmera.news" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={addForm.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" placeholder="Min 8 karakter" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={addForm.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <select className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" {...field}>
                        <option value="author">Author</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <button type="submit" disabled={isSubmitting} className="w-full bg-brand hover:bg-brand-dark text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
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
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari pengguna..." className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading && !usersData ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
              <p className="text-sm text-muted-foreground">Memuat pengguna...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Pengguna</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Email</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Role</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Artikel</th>
                  <th className="text-right p-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {user.avatar && (
                          <Image src={user.avatar} alt={user.name} width={32} height={32} className="rounded-full flex-shrink-0" />
                        )}
                        <span className="font-semibold">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-3 hidden sm:table-cell text-xs text-muted-foreground">{user.email}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleLabels[user.role]?.cls ?? "bg-gray-100 text-gray-500"}`}>
                        {roleLabels[user.role]?.label ?? user.role}
                      </span>
                    </td>
                    <td className="p-3 hidden md:table-cell text-xs text-muted-foreground">{user.articleCount ?? 0}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openEditDialog(user)}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-sm text-muted-foreground">Tidak ada pengguna ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Dialog Edit User */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={open => { setIsEditDialogOpen(open); if (!open) setEditingUser(null); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Pengguna</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 pt-2">
              <FormField control={editForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl><Input placeholder="Nama..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="email@tanahmera.news" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password Baru{" "}
                    <span className="text-xs font-normal text-muted-foreground">(kosongkan jika tidak ingin mengubah)</span>
                  </FormLabel>
                  <FormControl><Input type="password" placeholder="Min 8 karakter" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" {...field}>
                      <option value="author">Author</option>
                      <option value="reviewer">Reviewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <button type="submit" disabled={isSubmitting} className="w-full bg-brand hover:bg-brand-dark text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
