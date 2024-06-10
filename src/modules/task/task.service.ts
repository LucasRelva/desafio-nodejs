import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './task.repository';
import { PaginatedTaskDto } from './dto/paginated-task.dto';
import { JwtService } from '@nestjs/jwt';
import { AddTagsDto } from './dto/add-tags.dto';
import { UserService } from '../user/user.service';
import { AddAssigneeDto } from './dto/add-assignee.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
  }

  async findAll(page: number, pageSize: number): Promise<PaginatedTaskDto> {
    if (page <= 0) {
      throw new BadRequestException('Invalid page number');
    }

    const tasks = await this.taskRepository.findAllTasks(page, pageSize);

    return {
      tasks,
      currentPage: page,
      pageSize: tasks.length,
    };
  }

  async create(createTaskDto: CreateTaskDto, token: string) {
    if (!token) {
      throw new BadRequestException(`A token is required for this request`);
    }

    token = token.split(' ')[1];
    let userId;

    try {
      const decodedToken = this.jwtService.decode(token);
      userId = decodedToken.sub;
    } catch (error) {
      throw new BadRequestException(`Invalid token format`);
    }

    const isMember = await this.taskRepository.checkProjectMembership(createTaskDto.projectId, userId);
    if (!isMember) {
      throw new BadRequestException(`Only project members can create tasks`);
    }

    if (!createTaskDto.tags || createTaskDto.tags.length === 0) {
      throw new BadRequestException('Tasks must have at least one tag');
    }

    return await this.taskRepository.createTask(createTaskDto);
  }


  async findOne(id: number) {
    const task = await this.taskRepository.getTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.getTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (task.status === 'COMPLETED') {
      throw new BadRequestException('Completed tasks cannot be edited');
    }

    return await this.taskRepository.updateTask(id, updateTaskDto);
  }

  async remove(id: number) {
    const task = await this.taskRepository.getTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return await this.taskRepository.deleteTask(id);
  }

  async addTagsToTask(taskId: number, addTagsDto: AddTagsDto) {
    const task = await this.taskRepository.getTaskById(taskId);

    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    return await this.taskRepository.addTagsToTask(taskId, addTagsDto.tagIds);
  }

  async addAssignee(taskId: number, addAssigneeDto: AddAssigneeDto): Promise<void> {
    const { userId } = addAssigneeDto;
    const user = await this.userService.findOne(userId);

    await this.taskRepository.addAssignee(taskId, user.id);
  }
}
