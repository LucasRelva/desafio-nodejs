import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AddTagsDto } from './dto/add-tags.dto';
import { AddAssigneeDto } from './dto/add-assignee.dto';
import { TaskStatus } from '@prisma/client';

describe('TaskService', () => {
  let service: TaskService;
  let repository: TaskRepository;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepository,
          useValue: {
            findAllTasks: jest.fn(),
            createTask: jest.fn(),
            getTaskById: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
            checkProjectMembership: jest.fn(),
            addTagsToTask: jest.fn(),
            addAssignee: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            decode: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<TaskRepository>(TaskRepository);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return tasks', async () => {
      const page = 1;
      const size = 10;
      const tasks = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
      ];

      (repository.findAllTasks as jest.Mock).mockResolvedValue(tasks);

      const result = await service.findAll(
        page,
        size,
        TaskStatus.IN_PROGRESS,
        1,
      );

      expect(result.tasks).toEqual(tasks);
      expect(result.currentPage).toEqual(page);
      expect(result.pageSize).toEqual(tasks.length);
    });

    it('should throw BadRequestException for invalid page number', async () => {
      const page = 0;
      const size = 10;

      await expect(
        service.findAll(page, size, TaskStatus.IN_PROGRESS, 1),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        projectId: 1,
        tags: [1, 2],
        status: 'PENDING',
        description: '',
      };
      const token = 'Bearer token';

      (jwtService.decode as jest.Mock).mockReturnValue({ sub: 1 });
      (repository.checkProjectMembership as jest.Mock).mockResolvedValue(true);
      (repository.createTask as jest.Mock).mockResolvedValue(createTaskDto);

      const result = await service.create(createTaskDto, token);

      expect(result).toEqual(createTaskDto);
    });

    it('should throw BadRequestException if token is missing', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        projectId: 1,
        tags: [1, 2],
        status: 'PENDING',
        description: '',
      };

      await expect(service.create(createTaskDto, '')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a task when found', async () => {
      const id = 1;
      const task = { id: 1, title: 'Task 1' };

      (repository.getTaskById as jest.Mock).mockResolvedValue(task);

      const result = await service.findOne(id);

      expect(result).toEqual(task);
    });

    it('should throw NotFoundException when task is not found', async () => {
      const id = 999;

      (repository.getTaskById as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const id = 1;
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      const updatedTask = { id, ...updateTaskDto };

      (repository.getTaskById as jest.Mock).mockResolvedValue(updatedTask);
      (repository.updateTask as jest.Mock).mockResolvedValue(updatedTask);

      const result = await service.update(id, updateTaskDto);

      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFoundException when task is not found', async () => {
      const id = 999;
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };

      (repository.getTaskById as jest.Mock).mockResolvedValue(null);

      await expect(service.update(id, updateTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const id = 1;

      (repository.getTaskById as jest.Mock).mockResolvedValue({ id });
      (repository.deleteTask as jest.Mock).mockResolvedValue({});

      const result = await service.remove(id);

      expect(result).toEqual(undefined);
    });

    it('should throw NotFoundException when task is not found', async () => {
      const id = 999;

      (repository.getTaskById as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addTagsToTask', () => {
    it('should add tags to a task', async () => {
      const taskId = 1;
      const addTagsDto: AddTagsDto = { tagIds: [1, 2] };

      (repository.getTaskById as jest.Mock).mockResolvedValue({});
      (repository.addTagsToTask as jest.Mock).mockResolvedValue({});

      const result = await service.addTagsToTask(taskId, addTagsDto);

      expect(result).toEqual(undefined);
    });

    it('should throw NotFoundException when task is not found', async () => {
      const taskId = 999;
      const addTagsDto: AddTagsDto = { tagIds: [1, 2] };

      (repository.getTaskById as jest.Mock).mockResolvedValue(null);

      await expect(service.addTagsToTask(taskId, addTagsDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addAssignee', () => {
    it('should add an assignee to a task', async () => {
      const taskId = 1;
      const addAssigneeDto: AddAssigneeDto = { userId: 1 };

      (userService.findOne as jest.Mock).mockResolvedValue({ id: 1 });
      (repository.addAssignee as jest.Mock).mockResolvedValue({});

      const result = await service.addAssignee(taskId, addAssigneeDto);

      expect(result).toBeUndefined();
    });
  });
});
