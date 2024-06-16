import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { NotFoundException } from '@nestjs/common';
import { AddAssigneeDto } from './dto/add-assignee.dto';
import { AddTagsDto } from './dto/add-tags.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            addTagsToTask: jest.fn(),
            addAssignee: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = { title: 'Test Task', description: 'Test Description', status:  'PENDING', projectId: 1, tags: [1, 2]};
      const req = { headers: { authorization: 'Bearer token' } };

      await controller.create(createTaskDto, req);

      expect(service.create).toHaveBeenCalledWith(createTaskDto, req.headers.authorization);
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const page = 1;
      const size = 10;
      const paginatedTasks = { tasks: [], currentPage: page, pageSize: size };

      (service.findAll as jest.Mock).mockResolvedValue(paginatedTasks);

      const result = await controller.findAll(page, size, 'IN_PROGRESS', 1);

      expect(result).toEqual(paginatedTasks);
      expect(service.findAll).toHaveBeenCalledWith(page, size, 'IN_PROGRESS', 1);
    });
  });

  describe('findOne', () => {
    it('should return a task when found', async () => {
      const id = 1;
      const task = { id, title: 'Test Task', description: 'Test Description' };

      (service.findOne as jest.Mock).mockResolvedValue(task);

      const result = await controller.findOne(id);

      expect(result).toEqual(task);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw an error when task is not found', async () => {
      const id = 999;

      (service.findOne as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const id = 1;
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task', description: 'Updated Description' };

      await controller.update(id, updateTaskDto);

      expect(service.update).toHaveBeenCalledWith(id, updateTaskDto);
    });

    it('should throw an error when task is not found', async () => {
      const id = 999;
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task', description: 'Updated Description' };

      (service.update as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(controller.update(id, updateTaskDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const id = 1;

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should throw an error when task is not found', async () => {
      const id = 999;

      (service.remove as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addTags', () => {
    it('should add tags to a task', async () => {
      const id = 1;
      const addTagsDto: AddTagsDto = { tagIds: [1, 2] };

      await controller.addTags(id, addTagsDto);

      expect(service.addTagsToTask).toHaveBeenCalledWith(id, addTagsDto);
    });

    it('should throw an error when task is not found', async () => {
      const id = 999;
      const addTagsDto: AddTagsDto = { tagIds: [1, 2] };

      (service.addTagsToTask as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(controller.addTags(id, addTagsDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addAssignee', () => {
    it('should add an assignee to a task', async () => {
      const id = 1;
      const addAssigneeDto: AddAssigneeDto = { userId: 1 };

      await controller.addAssignee(id, addAssigneeDto);

      expect(service.addAssignee).toHaveBeenCalledWith(id, addAssigneeDto);
    });

    it('should throw an error when task or user is not found', async () => {
      const id = 999;
      const addAssigneeDto: AddAssigneeDto = { userId: 1 };

      (service.addAssignee as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(controller.addAssignee(id, addAssigneeDto)).rejects.toThrow(NotFoundException);
    });
  });
});
