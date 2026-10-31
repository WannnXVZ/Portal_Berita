"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import useSWR from "swr";
import { Upload, Grid, List, Search, Trash2, Copy, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

interface MediaItem {
  id?: string;
  filename: string;
  originalname?: string;
  size: number;
  mimetype?: string;
  mimeType?: string;
  url: string;
  createdAt: string;
}

const mockMedia: MediaItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  filename: `image-sample-${i + 1}.jpg`,
  originalname: `Sample Image ${i + 1}`,
  url: `https://picsum.photos/seed/media${i + 1}/600/400`,
  mimeType: "image/jpeg",
  size: Math.floor(Math.random() * 2000000) + 100000,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

function formatFileSize(bytes: number): string {
  if (!bytes) return "0 B";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function MediaPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: mediaData, isLoading, mutate } = useSWR<MediaItem[]>("/media");
  const mediaList = mediaData && mediaData.length > 0 ? mediaData : (mediaData ? [] : mockMedia);

  const filtered = mediaList.filter((m) =>
    m.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.originalname && m.originalname.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 5MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format tidak didukung. Harap upload JPEG, PNG, WebP, atau GIF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const tokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_client_token="));
    const token = tokenCookie ? decodeURIComponent(tokenCookie.split("=")[1]) : null;

    setUploading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/media/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) throw new Error("Gagal mengunggah file");

      const uploadedItem = await response.json();
      mutate([uploadedItem, ...mediaList], false);
      mutate();
      toast.success("Gambar berhasil diunggah ke server!");
    } catch {
      toast.error("Gagal mengunggah media. Pastikan backend aktif.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL media berhasil disalin ke clipboard!");
    } catch {
      toast.error("Gagal menyalin URL");
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus file "${filename}"?`)) return;

    const previousList = [...mediaList];
    mutate(mediaList.filter((m) => m.filename !== filename), false);

    try {
      await api.delete(`/media/${filename}`);
      toast.success("File media berhasil dihapus");
      mutate();
    } catch {
      mutate(previousList, false);
      toast.error("Gagal menghapus file media");
    }
  };

  return (
    <div className="space-y-5">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-serif">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading ? "Memuat media..." : `${mediaList.length} file media tersedia`}
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Mengunggah..." : "Upload Media"}
        </button>
      </div>

      {/* Upload Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFileUpload(file);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`bg-white rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          isDragOver
            ? "border-brand bg-brand-light/30 scale-[1.01]"
            : "border-border hover:border-brand hover:bg-brand-light/20"
        }`}
      >
        <Upload className={`h-8 w-8 mx-auto mb-2 ${isDragOver ? "text-brand" : "text-muted-foreground"}`} />
        <p className="text-sm font-medium">
          {uploading ? "Sedang memproses upload..." : "Drag & drop gambar ke sini, atau klik untuk memilih"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Mendukung JPEG, PNG, WebP, GIF. Maksimum 5MB per file
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari file media..."
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "grid" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
            }`}
            title="Grid View"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "list" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
            }`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Media Grid / List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {filtered.map((media, idx) => (
            <div
              key={media.filename || idx}
              className="group bg-white rounded-lg border border-border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={media.url}
                  alt={media.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(media.url);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-brand-light transition-colors text-foreground shadow"
                    title="Salin URL"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(media.filename);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors text-red-500 shadow"
                    title="Hapus"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate" title={media.filename}>
                  {media.filename}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatFileSize(media.size)}
                </p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-muted-foreground">
              Tidak ada file media yang sesuai dengan pencarian.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Preview</th>
                <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Nama File</th>
                <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Ukuran</th>
                <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Tanggal</th>
                <th className="text-right p-3 w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((media, idx) => (
                <tr key={media.filename || idx} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 w-16">
                    <div className="relative w-12 h-9 rounded overflow-hidden bg-muted flex-shrink-0">
                      <Image src={media.url} alt="" fill className="object-cover" sizes="48px" />
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-sm font-medium truncate max-w-xs">{media.filename}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate max-w-xs">{media.url}</p>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-xs text-muted-foreground">
                    {formatFileSize(media.size)}
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs text-muted-foreground">
                    {new Date(media.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleCopyUrl(media.url)}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        title="Salin URL"
                      >
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(media.filename)}
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
                  <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    Tidak ada media ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
