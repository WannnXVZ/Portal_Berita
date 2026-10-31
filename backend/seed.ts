import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/modules/users/users.service';
import { CategoriesService } from './src/modules/categories/categories.service';
import { TagsService } from './src/modules/tags/tags.service';
import { ArticlesService } from './src/modules/articles/articles.service';
import { UserRole } from './src/modules/users/entities/user.entity';
import { ArticleStatus } from './src/modules/articles/entities/article.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const categoriesService = app.get(CategoriesService);
  const tagsService = app.get(TagsService);
  const articlesService = app.get(ArticlesService);

  console.log('🌱 Starting Seeding...');

  // 1. Seed Admin User
  let admin = await usersService.findByEmail('admin@tanahmera.news');
  if (!admin) {
    admin = await usersService.create({
      name: 'Super Admin',
      email: 'admin@tanahmera.news',
      password: 'password',
      role: UserRole.SUPER_ADMIN,
      slug: 'super-admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    });
    console.log('✅ Admin User Created');
  } else {
    console.log('ℹ️ Admin User already exists');
  }

  // 2. Seed Categories
  const categories = [
    { name: 'Politik', slug: 'politik', icon: '⚖️' },
    { name: 'Ekonomi', slug: 'ekonomi', icon: '💰' },
    { name: 'Teknologi', slug: 'teknologi', icon: '💻' },
    { name: 'Olahraga', slug: 'olahraga', icon: '⚽' },
    { name: 'Hiburan', slug: 'hiburan', icon: '🎭' },
  ];

  const existingCategories = await categoriesService.findAll();
  const createdCategories: any[] = [];
  for (const cat of categories) {
    let existing = existingCategories.find((c) => c.slug === cat.slug);
    if (!existing) {
      existing = await categoriesService.create(cat);
    }
    createdCategories.push(existing);
  }
  console.log('✅ Categories Ready');

  // 3. Seed Tags
  const tags = ['IKN', 'Kalimantan', 'Nusantara', 'PWI', 'Breaking'];
  const existingTags = await tagsService.findAll();
  const createdTags: any[] = [];
  for (const tagName of tags) {
    const slug = tagName.toLowerCase();
    let existing = existingTags.find((t) => t.slug === slug);
    if (!existing) {
      existing = await tagsService.create({ name: tagName, slug });
    }
    createdTags.push(existing);
  }
  console.log('✅ Tags Ready');

  // 4. Seed Articles
  const articles = [
    {
      title: 'Pembangunan IKN Terus Dikebut, Target Upacara 17 Agustus Tercapai',
      slug: 'pembangunan-ikn-terus-dikebut',
      content: '<p>Pembangunan Ibu Kota Nusantara (IKN) di Kalimantan Timur terus menunjukkan progres signifikan. Berbagai infrastruktur utama mulai dari Istana Presiden, kantor kementerian koordinator, hingga fasilitas air minum dan kelistrikan telah memasuki tahap finalisasi.</p><p>Pemerintah optimis bahwa upacara peringatan HUT RI ke-79 dapat terselenggara dengan lancar dan khidmat di ibu kota baru tersebut.</p>',
      excerpt: 'Progres pembangunan infrastruktur inti IKN kini telah mencapai 80% menjelang upacara kemerdekaan.',
      status: ArticleStatus.PUBLISHED,
      isFeatured: true,
      category: createdCategories[0],
      tags: [createdTags[0], createdTags[1]],
      featuredImage: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=800',
    },
    {
      title: 'Teknologi AI Mulai Merambah Sektor Pertanian di Kalimantan',
      slug: 'teknologi-ai-pertanian-kalimantan',
      content: '<p>Petani di Kalimantan kini mulai memanfaatkan sensor berbasis AI untuk memantau kelembapan tanah, kesuburan lahan, dan deteksi hama secara real-time melalui smartphone.</p><p>Program percontohan ini dinilai sukses meningkatkan efisiensi penggunaan pupuk hingga 25% dan mempercepat masa panen.</p>',
      excerpt: 'Implementasi smart farming diharapkan meningkatkan hasil panen hingga 30% dan mendongkrak ketahanan pangan lokal.',
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      category: createdCategories[2],
      tags: [createdTags[2]],
      featuredImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800',
    },
    {
      title: 'Perekonomian Kalimantan Barat Tumbuh Positif Ditopang Hilirisasi Komoditas',
      slug: 'perekonomian-kalbar-tumbuh-positif',
      content: '<p>Badan Pusat Statistik (BPS) mencatat pertumbuhan ekonomi daerah yang mengesankan seiring beroperasinya sejumlah pabrik hilirisasi komoditas tambang dan perkebunan.</p>',
      excerpt: 'Hilirisasi industri memberikan dampak nyata terhadap penciptaan lapangan kerja dan pertumbuhan PDRB daerah.',
      status: ArticleStatus.PUBLISHED,
      isFeatured: false,
      category: createdCategories[1],
      tags: [createdTags[1]],
      featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800',
    }
  ];

  for (const art of articles) {
    try {
      const existing = await articlesService.findBySlug(art.slug);
      if (existing) {
        console.log(`ℹ️ Article "${art.title}" already exists`);
        continue;
      }
    } catch {
      // not found, proceed to create
    }
    await articlesService.create(art, admin.id);
    console.log(`✅ Created article: ${art.title}`);
  }

  console.log('✨ Seeding Completed Successfully!');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
