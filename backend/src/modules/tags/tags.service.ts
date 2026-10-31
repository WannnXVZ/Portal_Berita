import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find({
      order: { name: 'ASC' },
    });
  }

  async create(data: Partial<Tag>): Promise<Tag> {
    const tag = this.tagRepository.create(data);
    return this.tagRepository.save(tag);
  }

  async remove(id: string): Promise<void> {
    await this.tagRepository.delete(id);
  }

  async findTrending(limit: number = 10): Promise<any[]> {
    // Simulasi trending logic (bisa diperdalam dengan query relasi)
    return this.tagRepository.find({ take: limit });
  }
}
