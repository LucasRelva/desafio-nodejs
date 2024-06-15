import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ProjectRepository } from './project.repository';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, PrismaService, JwtService],
})
export class ProjectModule {
}
