import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, Task, TaskStatus } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async findAllTasks(page: number, pageSize: number, status?: TaskStatus): Promise<Task[]> {
    try {
      pageSize = parseInt(pageSize as any, 10);
      const offset = (page - 1) * pageSize;

      let where: Prisma.TaskWhereInput = {};

      if (status) {
        where = {
          ...where,
          status: {
            equals: status,
          },
        };
      }

      return await this.prisma.task.findMany({
        take: pageSize,
        skip: offset,
        include: { tags: true, assignees: true },
        where,
      });

    } catch (error) {
      console.error('Error occurred while fetching tasks:', error);
      throw error;
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const { title, description, status, projectId, tags } = createTaskDto;

      return await this.prisma.task.create({
        data: {
          title,
          description,
          status,
          projectId,
          tags: {
            connect: tags.map(tagId => ({ id: tagId })),
          },
        },
        include: {
          tags: true,
        },
      });
    } catch (error) {
      console.error('Error occurred while creating task:', error);
      throw error;
    }
  }

  async checkProjectMembership(projectId: number, userId: number): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          where: { id: userId },
        },
      },
    });
    return !!project;
  }

  async getTaskById(id: number): Promise<Task | null> {
    try {
      return await this.prisma.task.findUnique({
        where: { id },
        include: { tags: true, assignees: true },
      });
    } catch (error) {
      console.error('Error occurred while fetching task by ID:', error);
      throw error;
    }
  }

  async updateTask(id: number, data: Partial<Task>): Promise<Task | null> {
    try {
      return await this.prisma.task.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error occurred while updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: number): Promise<Task | null> {
    try {
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error occurred while deleting task:', error);
      throw error;
    }
  }

  async addTagsToTask(taskId: number, tagIds: number[]): Promise<Task | null> {
    try {
      return await this.prisma.task.update({
        where: { id: taskId },
        data: {
          tags: {
            connect: tagIds.map((id) => ({ id })),
          },
        },
        include: { tags: true },
      });
    } catch (error) {
      console.error('Error occurred while adding tags to task:', error);
      throw error;
    }
  }

  async addAssignee(taskId: number, userId: number): Promise<Task> {
    try {
      return await this.prisma.task.update({
        where: { id: taskId },
        data: {
          assignees: {
            connect: { id: userId },
          },
        },
        include: { assignees: true },
      });
    } catch (error) {
      console.error('Error occurred while adding assignee to task:', error);
      throw error;
    }
  }

}
