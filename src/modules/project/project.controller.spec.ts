import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

describe('ProjectController', () => {
  let controller: ProjectController;
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            addMembers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const createProjectDto = {
        name: 'John Doe',
        description: 'John Doe',
        creatorId: 1
      };
      const req = { headers: { authorization: 'Bearer token' } };

      await controller.create(createProjectDto, req);

      expect(service.create).toHaveBeenCalledWith(createProjectDto, 'Bearer token');
    });
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const page = 1;
      const size = 10;

      await controller.findAll(page, size);

      expect(service.findAll).toHaveBeenCalledWith(page, size);
    });
  });

  describe('findOne', () => {
    it('should return a project when found', async () => {
      const id = 1;

      await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw an error when project is not found', async () => {
      const id = 999;
      const errorMessage = `Project with id ${id} not found`;

      service.findOne = jest.fn().mockImplementation(() => {
        throw new NotFoundException(errorMessage);
      });

      await expect(controller.findOne(id)).rejects.toThrow(errorMessage);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const id = 1;
      const updateProjectDto = {
        name: 'Updated Project Name',
        description: 'Updated Project Description'
      };

      await controller.update(id, updateProjectDto);

      expect(service.update).toHaveBeenCalledWith(id, updateProjectDto);
    });

    it('should throw an error when project is not found', async () => {
      const id = 999;
      const updateProjectDto = {
        name: 'Updated Project Name',
        description: 'Updated Project Description'
      };
      const errorMessage = `Project with id ${id} not found`;

      service.update = jest.fn().mockImplementation(() => {
        throw new NotFoundException(errorMessage);
      });

      await expect(controller.update(id, updateProjectDto)).rejects.toThrow(errorMessage);
    });
  });

  describe('remove', () => {
    it('should delete a project', async () => {
      const id = 1;

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should throw an error when project is not found', async () => {
      const id = 999;
      const errorMessage = `Project with id ${id} not found`;

      service.remove = jest.fn().mockImplementation(() => {
        throw new NotFoundException(errorMessage);
      });

      await expect(controller.remove(id)).rejects.toThrow(errorMessage);
    });
  });

  describe('addMembers', () => {
    it('should add members to a project', async () => {
      const id = 1;
      const addMembersDto = {
        memberIds: [1, 2]
      };
      const req = { headers: { authorization: 'Bearer token' } };

      await controller.addMembers(id, addMembersDto, req);

      expect(service.addMembers).toHaveBeenCalledWith(id, addMembersDto, 'Bearer token');
    });

    it('should throw an error when project is not found', async () => {
      const id = 999;
      const addMembersDto = {
        memberIds: [1, 2]
      };
      const errorMessage = `Project with id ${id} not found`;
      const req = { headers: { authorization: 'Bearer token' } };

      service.addMembers = jest.fn().mockImplementation(() => {
        throw new NotFoundException(errorMessage);
      });

      await expect(controller.addMembers(id, addMembersDto, req)).rejects.toThrow(errorMessage);
    });
  });
});
