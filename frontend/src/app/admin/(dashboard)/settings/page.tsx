"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Globe, Lock, Shield, Settings2, Bell, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

const generalSchema = z.object({
  siteName: z.string().min(3, { message: "Nama website minimal 3 karakter" }),
  tagline: z.string().optional(),
  metaDescription: z.string().min(10, { message: "Meta description minimal 10 karakter" }),
  redactionEmail: z.string().email({ message: "Format email tidak valid" }),
  phone: z.string().optional(),
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  isMaintenanceMode: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  autoModeration: z.boolean().default(true),
});

const securitySchema = z.object({
  currentPassword: z.string().min(1, { message: "Password saat ini wajib diisi" }),
  newPassword: z.string().min(8, { message: "Password baru minimal 8 karakter" }),
  confirmPassword: z.string().min(8, { message: "Konfirmasi password minimal 8 karakter" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

type GeneralFormValues = z.infer<typeof generalSchema>;
type SecurityFormValues = z.infer<typeof securitySchema>;

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const generalForm = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema) as any,
    defaultValues: {
      siteName: "Tanah Merah News!",
      tagline: "Portal Berita Digital Modern — Cepat, Terpercaya, Mudah Dikelola",
      metaDescription: "Portal berita digital modern untuk Kalimantan Timur dan Indonesia. Berita terkini, terpercaya, dan cepat.",
      redactionEmail: "redaksi@tanahmera.news",
      phone: "+62 812-3456-7890",
      facebook: "",
      instagram: "",
      isMaintenanceMode: false,
      allowComments: true,
      autoModeration: true,
    },
  });

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema) as any,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Load saved general settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("site_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        generalForm.reset(parsed);
      }
    } catch {
      // Fallback to defaults
    }
  }, [generalForm]);

  const onSaveGeneral = async (values: GeneralFormValues) => {
    setSaving(true);
    try {
      localStorage.setItem("site_settings", JSON.stringify(values));
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Pengaturan berhasil disimpan!", {
        description: "Semua perubahan konfigurasi website telah disimpan dan diterapkan.",
      });
    } catch {
      toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  const onUpdatePassword = async (values: SecurityFormValues) => {
    setPasswordSaving(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Kata sandi berhasil diperbarui!", {
        description: "Silakan gunakan kata sandi baru Anda pada login berikutnya.",
      });
      securityForm.reset();
    } catch (error: unknown) {
      const err = error as { message?: string };
      const msg = err?.message || "Kata sandi saat ini tidak cocok atau terjadi kesalahan.";
      toast.error(msg);
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Kelola konfigurasi website dan keamanan akun Anda.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" /> Umum
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" /> Keamanan & Akun
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" /> Notifikasi
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6 outline-none">
          <Form {...generalForm}>
            <form onSubmit={generalForm.handleSubmit(onSaveGeneral)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                  <h2 className="font-bold text-sm flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-brand" /> Identitas Website
                  </h2>
                  <div className="grid gap-4">
                    <FormField
                      control={generalForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nama Website</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="tagline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tagline</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meta Description Default</FormLabel>
                          <FormControl>
                            <Textarea rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                  <h2 className="font-bold text-sm flex items-center gap-2">
                    <Bell className="h-4 w-4 text-brand" /> Kontak & Social
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={generalForm.control}
                      name="redactionEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Email Redaksi</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Telepon</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Facebook</FormLabel>
                          <FormControl>
                            <Input placeholder="https://facebook.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Instagram</FormLabel>
                          <FormControl>
                            <Input placeholder="https://instagram.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                  <h2 className="font-bold text-sm">⚙️ Fitur Website</h2>
                  <div className="space-y-4">
                    <FormField
                      control={generalForm.control}
                      name="isMaintenanceMode"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-medium">Maintenance Mode</FormLabel>
                            <FormDescription className="text-xs">Tampilkan halaman perbaikan</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-medium">Komentar</FormLabel>
                            <FormDescription className="text-xs">Izinkan pembaca berkomentar</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="autoModeration"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-medium">Moderasi Otomatis</FormLabel>
                            <FormDescription className="text-xs">Filter keyword terlarang</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-dark text-white font-bold h-11"
                  disabled={saving}
                >
                  {saving ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> Simpan Pengaturan</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        {/* Security Settings / Change Password */}
        <TabsContent value="security" className="space-y-6 outline-none">
          <div className="max-w-2xl bg-white rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/20">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Lock className="h-4 w-4 text-brand" /> Keamanan Akun
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Ganti kata sandi Anda secara berkala untuk menjaga keamanan akun.</p>
            </div>
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(onUpdatePassword)} className="p-6 space-y-4">
                <FormField
                  control={securityForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kata Sandi Saat Ini</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showCurrentPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={securityForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kata Sandi Baru</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showNewPassword ? "text" : "password"} 
                              placeholder="Minimal 8 karakter" 
                              className="pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showNewPassword ? "text" : "password"} 
                              placeholder="Ulangi kata sandi baru" 
                              className="pr-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="bg-brand hover:bg-brand-dark text-white font-bold"
                    disabled={passwordSaving}
                  >
                    {passwordSaving ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memperbarui...</>
                    ) : (
                      "Perbarui Kata Sandi"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="max-w-2xl bg-white rounded-xl border border-border p-6">
            <h2 className="font-bold text-sm text-red-600 flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4" /> Zona Berbahaya
            </h2>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Hapus Akun</p>
                <p className="text-xs text-muted-foreground">Setelah dihapus, akun Anda tidak dapat dikembalikan. Hati-hati.</p>
              </div>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">Hapus Akun</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="outline-none">
          <div className="bg-white rounded-xl border border-border p-10 text-center space-y-4">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
            <h3 className="font-bold">Pengaturan Notifikasi</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">Fitur push notification dan email alert sedang dalam pengembangan.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
