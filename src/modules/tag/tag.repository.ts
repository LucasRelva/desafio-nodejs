import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Tag } from '@prisma/client';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllTags(page: number, pageSize: number): Promise<Tag[]> {
    try {
      pageSize = parseInt(pageSize as any, 10);
      const offset = (page - 1) * pageSize;
      return await this.prisma.tag.findMany({
        take: pageSize,
        skip: offset,
      });
    } catch (error) {
      console.error('Error occurred while fetching tags:', error);
      throw error;
    }
  }

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      return await this.prisma.tag.create({
        data: createTagDto,
      });
    } catch (error) {
      console.error('Error occurred while creating tag:', error);
      throw error;
    }
  }

  async getTagById(id: number): Promise<Tag | null> {
    try {
      return await this.prisma.tag.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('Error occurred while fetching tag by ID:', error);
      throw error;
    }
  }

  async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<Tag | null> {
    try {
      return await this.prisma.tag.update({
        where: { id },
        data: updateTagDto,
      });
    } catch (error) {
      console.error('Error occurred while updating tag:', error);
      throw error;
    }
  }

  async deleteTag(id: number): Promise<Tag | null> {
    try {
      return await this.prisma.tag.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error occurred while deleting tag:', error);
      throw error;
    }
  }
}
