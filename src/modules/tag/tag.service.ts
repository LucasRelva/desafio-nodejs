import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {
  }

  async findAll(page: number, size: number) {
    return await this.tagRepository.findAllTags(page, size);
  }

  async create(createTagDto: CreateTagDto) {
    return await this.tagRepository.createTag(createTagDto);
  }

  async findOne(id: number) {
    const tag = await this.tagRepository.getTagById(id);

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.tagRepository.getTagById(id);

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    return await this.tagRepository.updateTag(id, updateTagDto);
  }

  async remove(id: number) {
    const tag = await this.tagRepository.getTagById(id);

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    return await this.tagRepository.deleteTag(id);
  }
}
