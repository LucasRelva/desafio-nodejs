import { PrismaService } from '../../prisma.service';
import { Prisma, Project } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectRepository {
  constructor(private prisma: PrismaService) {}

  async getProjects(
    page: number,
    pageSize: number,
    creatorId: number,
  ): Promise<Project[]> {
    try {
      pageSize = parseInt(pageSize as any, 10);
      const offset = (page - 1) * pageSize;

      let where: Prisma.ProjectWhereInput = {};

      if (creatorId) {
        where = {
          ...where,
          creatorId: {
            equals: creatorId,
          },
        };
      }

      return await this.prisma.project.findMany({
        take: pageSize,
        skip: offset,
        include: {
          tasks: true,
        },
        where,
      });
    } catch (error) {
      console.error('Error occurred while fetching projects:', error);
      throw error;
    }
  }

  async getProjectById(id: number): Promise<Project | null> {
    try {
      return await this.prisma.project.findUnique({
        where: { id },
        include: {
          creator: true,
          members: true,
          tasks: true,
        },
      });
    } catch (error) {
      console.error('Error occurred while fetching project by ID:', error);
      throw error;
    }
  }

  async createProject(data: CreateProjectDto): Promise<Project> {
    try {
      return await this.prisma.project.create({
        data,
      });
    } catch (error) {
      console.error('Error occurred while creating project:', error);
      throw error;
    }
  }

  async updateProject(
    id: number,
    data: Partial<Project>,
  ): Promise<Project | null> {
    try {
      return await this.prisma.project.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error occurred while updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: number): Promise<Project | null> {
    try {
      return await this.prisma.project.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error occurred while deleting project:', error);
      throw error;
    }
  }

  async addMembers(
    projectId: number,
    memberIds: number[],
  ): Promise<Project | null> {
    try {
      return await this.prisma.project.update({
        where: { id: projectId },
        data: {
          members: {
            connect: memberIds.map((id) => ({ id })),
          },
        },
        include: { members: true },
      });
    } catch (error) {
      console.error('Error occurred while adding members to project:', error);
      throw error;
    }
  }
}
