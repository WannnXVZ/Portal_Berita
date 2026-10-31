import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleStatus } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async findAll(options: { 
    status?: ArticleStatus, 
    category?: string, 
    tag?: string,
    authorId?: string,
    search?: string,
    limit?: number,
    offset?: number,
    sortBy?: string,
    isFeatured?: boolean,
  } = {}): Promise<[Article[], number]> {
    const { status, category, tag, authorId, search, limit = 10, offset = 0, sortBy, isFeatured } = options;
    
    const query = this.articleRepository.createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tag')
      .leftJoinAndSelect('article.author', 'author')
      .orderBy('article.publishedAt', 'DESC')
      .addOrderBy('article.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    if (status) {
      query.andWhere('article.status = :status', { status });
    }

    if (category) {
      query.andWhere('category.slug = :category', { category });
    }

    if (tag) {
      query.andWhere('tag.slug = :tag', { tag });
    }

    if (authorId) {
      query.andWhere('author.id = :authorId', { authorId });
    }

    if (isFeatured !== undefined) {
      query.andWhere('article.isFeatured = :isFeatured', { isFeatured });
    }

    if (search) {
      query.andWhere('(article.title ILIKE :search OR article.content ILIKE :search)', { 
        search: `%${search}%` 
      });
    }

    // Override default ordering if sortBy is specified
    if (sortBy === 'viewCount') {
      query.orderBy('article.viewCount', 'DESC');
    }

    return query.getManyAndCount();
  }

  async findBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['category', 'tags', 'author'],
    });

    if (!article) throw new NotFoundException('Article not found');
    
    // Increment view count
    article.viewCount += 1;
    await this.articleRepository.save(article);
    
    return article;
  }

  async findById(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['category', 'tags', 'author'],
    });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async create(data: any, authorId: string): Promise<Article> {
    const { category, tags, ...rest } = data;
    const categoryId = typeof category === 'object' ? category?.id : category;
    const tagIds = Array.isArray(tags)
      ? tags.map((tag) => (typeof tag === 'object' ? tag?.id : tag)).filter(Boolean)
      : [];
    
    const article = this.articleRepository.create({
      ...rest,
      category: categoryId ? { id: categoryId } : null,
      tags: tagIds.map((id) => ({ id })),
      author: { id: authorId },
      publishedAt: data.status === ArticleStatus.PUBLISHED
        ? new Date()
        : data.status === ArticleStatus.SCHEDULED && data.scheduledAt
          ? new Date(data.scheduledAt)
          : null,
    });
    return this.articleRepository.save(article as any);
  }

  async update(id: string, data: any): Promise<Article> {
    const article = await this.articleRepository.findOne({ 
      where: { id },
      relations: ['tags'] 
    });
    if (!article) throw new NotFoundException('Article not found');

    const { category, tags, ...rest } = data;

    if (data.status === ArticleStatus.PUBLISHED && !article.publishedAt) {
      article.publishedAt = new Date();
    }

    if (category) article.category = { id: category } as any;
    if (tags) article.tags = tags.map(tid => ({ id: tid })) as any;

    Object.assign(article, rest);
    return this.articleRepository.save(article);
  }

  async remove(id: string): Promise<void> {
    await this.articleRepository.delete(id);
  }

  async getStats() {
    const total = await this.articleRepository.count();
    const published = await this.articleRepository.count({ where: { status: ArticleStatus.PUBLISHED } });
    const draft = await this.articleRepository.count({ where: { status: ArticleStatus.DRAFT } });
    const pendingReview = await this.articleRepository.count({ where: { status: ArticleStatus.PENDING_REVIEW } });
    const approved = await this.articleRepository.count({ where: { status: ArticleStatus.APPROVED } });
    const scheduled = await this.articleRepository.count({ where: { status: ArticleStatus.SCHEDULED } });
    const rejected = await this.articleRepository.count({ where: { status: ArticleStatus.REJECTED } });
    const archived = await this.articleRepository.count({ where: { status: ArticleStatus.ARCHIVED } });

    return { total, published, draft, pendingReview, approved, scheduled, rejected, archived };
  }
}
