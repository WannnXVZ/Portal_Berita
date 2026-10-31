// ============================================
// Tanah Merah News! — Mock Data for Development
// ============================================

import type { Article, Category, Tag, User, BreakingNews } from '@/types';

export const isArticleExpired = (article: Article) => {
  if (!article.expiredAt) return false;
  return new Date(article.expiredAt) < new Date();
};

// ── Authors ──
export const authors: User[] = [
  {
    id: '1', name: 'Ahmad Ridwan', email: 'ahmad@tanahmera.news',
    avatar: 'https://i.pravatar.cc/150?u=ahmad', bio: 'Jurnalis senior dengan pengalaman 10 tahun meliput berita politik dan pemerintahan Kalimantan Timur.',
    role: 'author', isActive: true, createdAt: '2026-01-15', articleCount: 87,
    socialLinks: { twitter: '#', instagram: '#' },
  },
  {
    id: '2', name: 'Siti Nurhaliza', email: 'siti@tanahmera.news',
    avatar: 'https://i.pravatar.cc/150?u=siti', bio: 'Reporter ekonomi dan bisnis. Fokus pada perkembangan IKN dan investasi di Kaltim.',
    role: 'author', isActive: true, createdAt: '2026-02-01', articleCount: 64,
  },
  {
    id: '3', name: 'Budi Santoso', email: 'budi@tanahmera.news',
    avatar: 'https://i.pravatar.cc/150?u=budi', bio: 'Pewarta teknologi dan inovasi digital Indonesia.',
    role: 'author', isActive: true, createdAt: '2026-03-10', articleCount: 45,
  },
  {
    id: '4', name: 'Dewi Lestari', email: 'dewi@tanahmera.news',
    avatar: 'https://i.pravatar.cc/150?u=dewi', bio: 'Jurnalis olahraga dan gaya hidup. Penikmat sepak bola dan kuliner Nusantara.',
    role: 'author', isActive: true, createdAt: '2026-01-20', articleCount: 52,
  },
];

// ── Categories ──
export const categories: Category[] = [
  { id: '1', name: 'Nasional', slug: 'nasional', icon: '🇮🇩', sortOrder: 1, isActive: true, articleCount: 234 },
  { id: '2', name: 'Internasional', slug: 'internasional', icon: '🌍', sortOrder: 2, isActive: true, articleCount: 128 },
  { id: '3', name: 'Politik', slug: 'politik', icon: '🏛️', sortOrder: 3, isActive: true, articleCount: 189 },
  { id: '4', name: 'Ekonomi', slug: 'ekonomi', icon: '📈', sortOrder: 4, isActive: true, articleCount: 156 },
  { id: '5', name: 'Teknologi', slug: 'teknologi', icon: '💻', sortOrder: 5, isActive: true, articleCount: 98 },
  { id: '6', name: 'Olahraga', slug: 'olahraga', icon: '⚽', sortOrder: 6, isActive: true, articleCount: 167 },
  { id: '7', name: 'Hiburan', slug: 'hiburan', icon: '🎬', sortOrder: 7, isActive: true, articleCount: 112 },
  { id: '8', name: 'Lifestyle', slug: 'lifestyle', icon: '✨', sortOrder: 8, isActive: true, articleCount: 87 },
  { id: '9', name: 'Otomotif', slug: 'otomotif', icon: '🚗', sortOrder: 9, isActive: true, articleCount: 56 },
  { id: '10', name: 'Pendidikan', slug: 'pendidikan', icon: '📚', sortOrder: 10, isActive: true, articleCount: 73 },
  { id: '11', name: 'Kesehatan', slug: 'kesehatan', icon: '🏥', sortOrder: 11, isActive: true, articleCount: 64 },
  { id: '12', name: 'Kuliner', slug: 'kuliner', icon: '🍜', sortOrder: 12, isActive: true, articleCount: 45 },
  { id: '13', name: 'Travel', slug: 'travel', icon: '✈️', sortOrder: 13, isActive: true, articleCount: 38 },
  { id: '14', name: 'Daerah', slug: 'daerah', icon: '📍', sortOrder: 14, isActive: true, articleCount: 312 },
  { id: '15', name: 'Opini', slug: 'opini', icon: '💬', sortOrder: 15, isActive: true, articleCount: 52 },
  { id: '16', name: 'Video', slug: 'video', icon: '🎥', sortOrder: 16, isActive: true, articleCount: 34 },
  { id: '17', name: 'Foto', slug: 'foto', icon: '📷', sortOrder: 17, isActive: true, articleCount: 28 },
];

// ── Tags ──
export const tags: Tag[] = [
  { id: '1', name: 'IKN', slug: 'ikn', articleCount: 89 },
  { id: '2', name: 'Pilkada', slug: 'pilkada', articleCount: 67 },
  { id: '3', name: 'Kaltim', slug: 'kaltim', articleCount: 156 },
  { id: '4', name: 'Samarinda', slug: 'samarinda', articleCount: 98 },
  { id: '5', name: 'Balikpapan', slug: 'balikpapan', articleCount: 87 },
  { id: '6', name: 'Infrastruktur', slug: 'infrastruktur', articleCount: 45 },
  { id: '7', name: 'UMKM', slug: 'umkm', articleCount: 34 },
  { id: '8', name: 'Wisata', slug: 'wisata', articleCount: 42 },
  { id: '9', name: 'Pendidikan', slug: 'pendidikan', articleCount: 38 },
  { id: '10', name: 'Lingkungan', slug: 'lingkungan', articleCount: 29 },
];

// ── Breaking News ──
export const breakingNews: BreakingNews[] = [
  { id: '1', text: 'BREAKING: Presiden resmikan jembatan penghubung IKN-Balikpapan sepanjang 12 km', link: '/artikel/presiden-resmikan-jembatan-ikn', isActive: true, sortOrder: 1 },
  { id: '2', text: 'Gempa M5.2 guncang pesisir Berau, tidak berpotensi tsunami', link: '/artikel/gempa-berau', isActive: true, sortOrder: 2 },
  { id: '3', text: 'Tim Persebaya kalahkan Borneo FC 3-1 di Stadion Segiri', link: '/artikel/persebaya-vs-borneo', isActive: true, sortOrder: 3 },
];

// ── Helper for realistic article content ──
const sampleContent = `
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
<h2>Latar Belakang</h2>
<p>Pemerintah Provinsi Kalimantan Timur terus mendorong percepatan pembangunan infrastruktur untuk mendukung pemindahan Ibu Kota Negara (IKN) Nusantara. Berbagai proyek strategis telah dimulai sejak awal tahun 2026.</p>
<blockquote><p>"Pembangunan IKN bukan hanya memindahkan pusat pemerintahan, tapi juga membangun peradaban baru Indonesia," ujar Gubernur Kaltim dalam konferensi pers.</p></blockquote>
<h2>Perkembangan Terkini</h2>
<p>Hingga kuartal kedua 2026, progres fisik pembangunan IKN telah mencapai 68 persen. Beberapa gedung kementerian sudah siap ditempati, sementara infrastruktur jalan dan jembatan terus dikerjakan.</p>
<p>Investasi yang masuk ke Kaltim juga meningkat signifikan. Data BKPM menunjukkan realisasi investasi naik 42 persen dibanding periode yang sama tahun lalu.</p>
<h2>Dampak bagi Masyarakat</h2>
<p>Masyarakat sekitar IKN mulai merasakan dampak positif dari pembangunan. Lapangan kerja baru terbuka, akses pendidikan dan kesehatan membaik, serta konektivitas antar wilayah semakin lancar.</p>
`;

function timeAgo(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

// ── Articles ──
export const articles: Article[] = [
  {
    id: '1', title: 'Presiden Resmikan Jembatan Penghubung IKN–Balikpapan Sepanjang 12 Kilometer',
    slug: 'presiden-resmikan-jembatan-ikn-balikpapan', excerpt: 'Jembatan sepanjang 12 km yang menghubungkan IKN Nusantara dengan Kota Balikpapan resmi beroperasi. Proyek ini menjadi tonggak penting konektivitas ibu kota baru.',
    content: sampleContent, featuredImage: 'https://picsum.photos/seed/bridge/1200/630',
    category: categories[0], tags: [tags[0], tags[4], tags[5]], author: authors[0], status: 'published',
    isFeatured: true, isBreaking: true, isEditorChoice: true, viewCount: 15420, readingTime: 5,
    seoTitle: 'Presiden Resmikan Jembatan IKN-Balikpapan', seoDescription: 'Jembatan 12 km menghubungkan IKN dan Balikpapan resmi beroperasi',
    publishedAt: timeAgo(1), createdAt: timeAgo(3), updatedAt: timeAgo(1),
  },
  {
    id: '2', title: 'Ekonomi Kaltim Tumbuh 6,8% di Kuartal I 2026, Tertinggi di Kalimantan',
    slug: 'ekonomi-kaltim-tumbuh-kuartal-i-2026', excerpt: 'BPS mencatat pertumbuhan ekonomi Kalimantan Timur mencapai 6,8 persen year-on-year pada kuartal pertama 2026, didorong sektor konstruksi dan perdagangan.',
    content: sampleContent, featuredImage: 'https://picsum.photos/seed/economy/1200/630',
    category: categories[3], tags: [tags[2], tags[6]], author: authors[1], status: 'published',
    isFeatured: false, isBreaking: false, isEditorChoice: true, viewCount: 8934, readingTime: 4,
    publishedAt: timeAgo(2), createdAt: timeAgo(5), updatedAt: timeAgo(2),
  },
  {
    id: '3', title: 'Startup Asal Samarinda Raih Pendanaan Seri A Rp150 Miliar dari Investor Singapura',
    slug: 'startup-samarinda-pendanaan-seri-a', excerpt: 'AgriTech Borneo, startup teknologi pertanian dari Samarinda, berhasil mendapatkan pendanaan Seri A senilai Rp150 miliar untuk ekspansi ke seluruh Kalimantan.',
    content: sampleContent, featuredImage: 'https://picsum.photos/seed/startup/1200/630',
    category: categories[4], tags: [tags[3], tags[6]], author: authors[2], status: 'published',
    isFeatured: false, isBreaking: false, isEditorChoice: false, viewCount: 6721, readingTime: 3,
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    expiredAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '4', title: 'Borneo FC Puncaki Klasemen Liga 1 Setelah Menang 3-1 Atas Persebaya',
    slug: 'borneo-fc-puncaki-klasemen-liga-1', excerpt: 'Borneo FC berhasil naik ke puncak klasemen Liga 1 2026 setelah kemenangan meyakinkan 3-1 atas Persebaya di Stadion Segiri, Samarinda.',
    content: sampleContent, featuredImage: 'https://picsum.photos/seed/football/1200/630',
    category: categories[5], tags: [tags[3], tags[2]], author: authors[3], status: 'published',
    isFeatured: false, isBreaking: false, isEditorChoice: false, viewCount: 12301, readingTime: 3,
    publishedAt: timeAgo(4), createdAt: timeAgo(7), updatedAt: timeAgo(4),
  },
  {
    id: '5', title: 'Gubernur Kaltim Dorong Digitalisasi UMKM di 10 Kabupaten/Kota',
    slug: 'gubernur-kaltim-digitalisasi-umkm', excerpt: 'Program digitalisasi UMKM yang diluncurkan Gubernur Kaltim menargetkan 50.000 pelaku usaha mikro untuk go digital pada akhir 2026.',
    content: sampleContent, featuredImage: 'https://picsum.photos/seed/umkm/1200/630',
    category: categories[3], tags: [tags[2], tags[6], tags[3]], author: authors[1], status: 'published',
    isFeatured: false, isBreaking: false, isEditorChoice: true, viewCount: 4523, readingTime: 4,
    publishedAt: timeAgo(5), createdAt: timeAgo(8), updatedAt: timeAgo(5),
  },
  {
    id: '6', title: 'Kawasan Wisata Derawan Targetkan 1 Juta Wisatawan di 2026',
    slug: 'derawan-target-1-juta-wisatawan', excerpt: 'Kabupaten Berau menargetkan kunjungan wisatawan ke Kepulauan Derawan mencapai 1 juta orang pada 2026 dengan berbagai program promosi.',
    content: sampleContent, featuredImage: 'https://picsum.photos/seed/derawan/1200/630',
    category: categories[12], tags: [tags[7], tags[2]], author: authors[3], status: 'published',
    isFeatured: false, isBreaking: false, isEditorChoice: false, viewCount: 7845, readingTime: 3,
    publishedAt: timeAgo(6), createdAt: timeAgo(9), updatedAt: timeAgo(6),
  },
  {
    id: '7', title: 'Universitas Mulawarman Raih Akreditasi Unggul dari BAN-PT',
    slug: 'unmul-akreditasi-unggul', excerpt: 'Universitas Mulawarman resmi meraih akreditasi Unggul dari Badan Akreditasi Nasional Perguruan Tinggi, menjadi universitas pertama di Kaltim dengan predikat tersebut.',
    content: sampleContent, featuredImage: 'https://picsum.photos/seed/university/1200/630',
    category: categories[9], tags: [tags[8], tags[3]], author: authors[0], status: 'published',
    isFeatured: false, isBreaking: false, isEditorChoice: false, viewCount: 5432, readingTime: 4,
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    expiredAt: new Date(Date.now() + 172800000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '8', title: 'Hutan Mangrove Balikpapan Jadi Percontohan Restorasi Nasional',
    slug: 'mangrove-balikpapan-restorasi-nasional', excerpt: 'Kawasan hutan mangrove di Teluk Balikpapan ditetapkan sebagai lokasi percontohan program restorasi mangrove nasional oleh KLHK.',
    content: sampleContent, featuredImage: 'https://picsum.photos/seed/mangrove/1200/630',
    category: categories[0], tags: [tags[9], tags[4]], author: authors[0], status: 'published',
    isFeatured: false, isBreaking: false, isEditorChoice: false, viewCount: 3210, readingTime: 5,
    publishedAt: timeAgo(8), createdAt: timeAgo(12), updatedAt: timeAgo(8),
  },
  {
    id: '9', title: 'Festival Budaya Dayak 2026 Digelar di Tenggarong Selama 5 Hari',
    slug: 'festival-budaya-dayak-2026', excerpt: 'Festival Budaya Dayak tahunan ke-15 akan digelar di Tenggarong, Kutai Kartanegara, menampilkan seni tari, musik tradisional, dan pameran kerajinan.',
    content: sampleContent, featuredImage: 'https://picsum.photos/seed/dayak/1200/630',
    category: categories[6], tags: [tags[2], tags[7]], author: authors[3], status: 'published',
    isFeatured: false, isBreaking: false, isEditorChoice: false, viewCount: 6100, readingTime: 3,
    publishedAt: timeAgo(10), createdAt: timeAgo(14), updatedAt: timeAgo(10),
  },
  {
    id: '10', title: 'Bandara APT Pranoto Samarinda Layani Penerbangan Internasional Perdana',
    slug: 'apt-pranoto-penerbangan-internasional', excerpt: 'Bandara APT Pranoto Samarinda resmi melayani rute internasional perdana menuju Kuala Lumpur, Malaysia, dengan maskapai AirAsia.',
    content: sampleContent, featuredImage: 'https://picsum.photos/seed/airport/1200/630',
    category: categories[0], tags: [tags[3], tags[5]], author: authors[1], status: 'published',
    isFeatured: false, isBreaking: false, isEditorChoice: false, viewCount: 9876, readingTime: 4,
    publishedAt: timeAgo(12), createdAt: timeAgo(16), updatedAt: timeAgo(12),
  },
];

// ── Helpers ──
export const getArticles = (limit?: number) => {
  return articles
    .filter(a => a.status === "published" && !isArticleExpired(a))
    .slice(0, limit);
};

export const getArticleBySlug = (slug: string) => {
  const article = articles.find((a) => a.slug === slug);
  if (article && article.status === "published" && isArticleExpired(article)) {
    return null;
  }
  return article;
};

export const getPopularArticles = (limit: number) => {
  return [...articles]
    .filter(a => a.status === "published" && !isArticleExpired(a))
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
};

export const getArticlesByCategory = (categorySlug: string, limit?: number) => {
  return articles
    .filter((a) => a.category.slug === categorySlug && a.status === "published" && !isArticleExpired(a))
    .slice(0, limit);
};

export function getFeaturedArticle(): Article | undefined {
  return articles.find(a => a.isFeatured && a.status === 'published' && !isArticleExpired(a));
}

export function getEditorChoiceArticles(): Article[] {
  return articles.filter(a => a.isEditorChoice && a.status === 'published' && !isArticleExpired(a));
}

export function getLatestArticles(limit = 10): Article[] {
  return [...articles]
    .filter(a => a.status === 'published' && !isArticleExpired(a))
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
    .slice(0, limit);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getTagBySlug(slug: string): Tag | undefined {
  return tags.find(t => t.slug === slug);
}

export function getAuthorById(id: string): User | undefined {
  return authors.find(a => a.id === id);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return formatDate(dateString);
}
