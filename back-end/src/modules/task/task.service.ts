import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './task.repository';
import { PaginatedTaskDto } from './dto/paginated-task.dto';
import { JwtService } from '@nestjs/jwt';
import { AddTagsDto } from './dto/add-tags.dto';
import { UserService } from '../user/user.service';
import { AddAssigneeDto } from './dto/add-assignee.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async findAll(page: number, pageSize: number, status: TaskStatus, projectId: number): Promise<PaginatedTaskDto> {
    if (page <= 0) {
      this.logger.error('Invalid page number');
      throw new BadRequestException('Invalid page number');
    }

    const tasks = await this.taskRepository.findAllTasks(page, pageSize, status, projectId);
    this.logger.log(`Fetched ${tasks.length} tasks from page ${page}`);

    return {
      tasks,
      currentPage: page,
      pageSize: tasks.length,
    };
  }

  async create(createTaskDto: CreateTaskDto, token: string) {
    if (!token) {
      this.logger.error('A token is required for this request');
      throw new BadRequestException('A token is required for this request');
    }

    token = token.split(' ')[1];
    let userId;

    try {
      const decodedToken = this.jwtService.decode(token);
      userId = decodedToken.sub;
    } catch (error) {
      this.logger.error('Invalid token format');
      throw new BadRequestException('Invalid token format');
    }

    const isMember = await this.taskRepository.checkProjectMembership(createTaskDto.projectId, userId);
    if (!isMember) {
      this.logger.error('Only project members can create tasks');
      throw new BadRequestException('Only project members can create tasks');
    }

    if (!createTaskDto.tags || createTaskDto.tags.length === 0) {
      this.logger.error('Tasks must have at least one tag');
      throw new BadRequestException('Tasks must have at least one tag');
    }

    const task = await this.taskRepository.createTask(createTaskDto);
    this.logger.log(`Task created successfully with id ${task.id}`);
    return task;
  }

  async findOne(id: number) {
    const task = await this.taskRepository.getTaskById(id);

    if (!task) {
      this.logger.error(`Task with id ${id} not found`);
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    this.logger.log(`Fetched task with id ${id}`);
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.getTaskById(id);

    if (!task) {
      this.logger.error(`Task with id ${id} not found`);
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (task.status === 'COMPLETED') {
      this.logger.error('Completed tasks cannot be edited');
      throw new BadRequestException('Completed tasks cannot be edited');
    }

    const updatedTask = await this.taskRepository.updateTask(id, updateTaskDto);
    this.logger.log(`Task with id ${id} updated successfully`);
    return updatedTask;
  }

  async remove(id: number) {
    const task = await this.taskRepository.getTaskById(id);

    if (!task) {
      this.logger.error(`Task with id ${id} not found`);
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    await this.taskRepository.deleteTask(id);
    this.logger.log(`Task with id ${id} removed successfully`);
  }

  async addTagsToTask(taskId: number, addTagsDto: AddTagsDto) {
    const task = await this.taskRepository.getTaskById(taskId);

    if (!task) {
      this.logger.error(`Task with id ${taskId} not found`);
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    await this.taskRepository.addTagsToTask(taskId, addTagsDto.tagIds);
    this.logger.log(`Tags added to task with id ${taskId}`);
  }

  async addAssignee(taskId: number, addAssigneeDto: AddAssigneeDto): Promise<void> {
    const { userId } = addAssigneeDto;
    const user = await this.userService.findOne(userId);

    await this.taskRepository.addAssignee(taskId, user.id);
    this.logger.log(`User with id ${userId} assigned to task with id ${taskId}`);
  }
}
