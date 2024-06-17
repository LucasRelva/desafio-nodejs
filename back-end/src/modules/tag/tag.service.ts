import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(private readonly tagRepository: TagRepository) {}

  async findAll(page: number, size: number) {
    const tags = await this.tagRepository.findAllTags(page, size);
    this.logger.log(`Fetched ${tags.length} tags from page ${page}`);
    return tags;
  }

  async create(createTagDto: CreateTagDto) {
    const tag = await this.tagRepository.createTag(createTagDto);
    this.logger.log(`Tag created successfully with id ${tag.id}`);
    return tag;
  }

  async findOne(id: number) {
    const tag = await this.tagRepository.getTagById(id);

    if (!tag) {
      this.logger.error(`Tag with id ${id} not found`);
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    this.logger.log(`Fetched tag with id ${id}`);
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.tagRepository.getTagById(id);

    if (!tag) {
      this.logger.error(`Tag with id ${id} not found`);
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    const updatedTag = await this.tagRepository.updateTag(id, updateTagDto);
    this.logger.log(`Tag with id ${id} updated successfully`);
    return updatedTag;
  }

  async remove(id: number) {
    const tag = await this.tagRepository.getTagById(id);

    if (!tag) {
      this.logger.error(`Tag with id ${id} not found`);
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    await this.tagRepository.deleteTag(id);
    this.logger.log(`Tag with id ${id} removed successfully`);
  }
}
