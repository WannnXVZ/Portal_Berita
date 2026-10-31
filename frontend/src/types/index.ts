// ============================================
// Tanah Merah News! — TypeScript Interfaces
// ============================================

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'reviewer' | 'author';

export type ArticleStatus =
  | 'draft'
  | 'pending_review'
  | 'revision_needed'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'unpublished'
  | 'rejected'
  | 'archived';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  articleCount?: number;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  articleCount?: number;
  children?: Category[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: Category;
  tags: Tag[];
  author: User;
  editor?: User;
  status: ArticleStatus;
  isFeatured: boolean;
  isBreaking: boolean;
  isEditorChoice: boolean;
  viewCount: number;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  expiredAt?: string | null;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BreakingNews {
  id: string;
  text: string;
  link?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Ad {
  id: string;
  title: string;
  position: 'header' | 'sidebar' | 'in_article' | 'homepage' | 'footer';
  imageUrl: string;
  link: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface Media {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  altText?: string;
  caption?: string;
  credit?: string;
  uploadedBy: User;
  createdAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  name: string;
  email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  parentId?: string;
  createdAt: string;
}

export interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
}

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  pendingReview: number;
  totalViews: number;
  activeUsers: number;
  todayViews: number;
  popularArticles: Article[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta?: {
    pagination: PaginationMeta;
  };
}
