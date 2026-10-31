import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query, 
  Request 
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleStatus } from './entities/article.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Public Endpoints
  @Get()
  findAll(
    @Query('status') status?: ArticleStatus,
    @Query('category') category?: string,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
    @Query('sortBy') sortBy?: string,
    @Query('isFeatured') isFeatured?: string,
  ) {
    return this.articlesService.findAll({ status, category, tag, search, limit, offset, sortBy, isFeatured: isFeatured === 'true' });
  }

  @Get('slug/:slug')
  findOne(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  // Admin/Management Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.SUPER_ADMIN)
  getStats() {
    return this.articlesService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.articlesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(UserRole.AUTHOR, UserRole.EDITOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  create(@Body() body: any, @Request() req) {
    return this.articlesService.create(body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(UserRole.AUTHOR, UserRole.EDITOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() body: any) {
    return this.articlesService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
