import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { PrismaService } from '../../prisma.service';
import { TagRepository } from './tag.repository';

@Module({
  controllers: [TagController],
  providers: [TagService, TagRepository, PrismaService],
})
export class TagModule {
}
