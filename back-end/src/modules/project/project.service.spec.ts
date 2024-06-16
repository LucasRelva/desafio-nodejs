import { Test } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AddMembersDto } from './dto/add-members.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

describe('ProjectService', () => {
  let service: ProjectService;
  let projectRepository: ProjectRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: ProjectRepository,
          useValue: {
            createProject: jest.fn(),
            getProjects: jest.fn(),
            getProjectById: jest.fn(),
            updateProject: jest.fn(),
            deleteProject: jest.fn(),
            addMembers: jest.fn(),
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

    service = moduleRef.get<ProjectService>(ProjectService);
    projectRepository = moduleRef.get<ProjectRepository>(ProjectRepository);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const page = 1;
      const size = 10;
      const projects = [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }];

      (projectRepository.getProjects as jest.Mock).mockResolvedValue(projects);

      const result = await service.findAll(page, size, 1);

      expect(result.projects).toEqual(projects);
      expect(result.currentPage).toEqual(page);
      expect(result.pageSize).toEqual(projects.length);
      expect(projectRepository.getProjects).toHaveBeenCalledWith(page, size, 1);
    });

    it('should throw BadRequestException when page number is invalid', async () => {
      const page = 0;
      const size = 10;

      await expect(service.findAll(page, size, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a project when found', async () => {
      const id = 1;
      const project = { id: 1, name: 'Project 1' };

      (projectRepository.getProjectById as jest.Mock).mockResolvedValue(project);

      const result = await service.findOne(id);

      expect(result).toEqual(project);
      expect(projectRepository.getProjectById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when project is not found', async () => {
      const id = 999;

      (projectRepository.getProjectById as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const id = 1;
      const updateProjectDto: UpdateProjectDto = { name: 'Updated Project Name' , description: "Updates Project Description" };
      const project = { id: 1, name: 'Project 1' };

      (projectRepository.getProjectById as jest.Mock).mockResolvedValue(project);
      (projectRepository.updateProject as jest.Mock).mockResolvedValue(project);

      await expect(service.update(id, updateProjectDto)).resolves.toEqual(project);
      expect(projectRepository.getProjectById).toHaveBeenCalledWith(id);
      expect(projectRepository.updateProject).toHaveBeenCalledWith(id, updateProjectDto);
    });

    it('should throw NotFoundException when project is not found', async () => {
      const id = 999;
      const updateProjectDto: UpdateProjectDto = { name: 'Updated Project Name', description: "Updates Project Description" };

      (projectRepository.getProjectById as jest.Mock).mockResolvedValue(null);

      await expect(service.update(id, updateProjectDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a project', async () => {
      const id = 1;
      const project = { id: 1, name: 'Project 1' };

      (projectRepository.getProjectById as jest.Mock).mockResolvedValue(project);
      (projectRepository.deleteProject as jest.Mock).mockResolvedValue(undefined);

      await expect(service.remove(id)).resolves.toBeUndefined();
      expect(projectRepository.getProjectById).toHaveBeenCalledWith(id);
      expect(projectRepository.deleteProject).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when project is not found', async () => {
      const id = 999;

      (projectRepository.getProjectById as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addMembers', () => {
    it('should add members to a project', async () => {
      const projectId = 1;
      const addMembersDto: AddMembersDto = { memberIds: [2, 3] };
      const token = 'Bearer token';
      const decodedToken = { sub: 1 };
      const project = { id: 1, name: 'Project 1', creatorId: 1 };

      (jwtService.decode as jest.Mock).mockReturnValue(decodedToken);
      (projectRepository.getProjectById as jest.Mock).mockResolvedValue(project);
      (projectRepository.addMembers as jest.Mock).mockResolvedValue(undefined);

      await expect(service.addMembers(projectId, addMembersDto, token)).resolves.toBeUndefined();
      expect(jwtService.decode).toHaveBeenCalledWith('token');
      expect(projectRepository.getProjectById).toHaveBeenCalledWith(projectId);
      expect(projectRepository.addMembers).toHaveBeenCalledWith(projectId, addMembersDto.memberIds);
    });

    it('should throw BadRequestException when token is not provided', async () => {
      const projectId = 1;
      const addMembersDto: AddMembersDto = { memberIds: [2, 3] };

      await expect(service.addMembers(projectId, addMembersDto, '')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when token format is invalid', async () => {
      const projectId = 1;
      const addMembersDto: AddMembersDto = { memberIds: [2, 3] };
      const token = 'invalidToken';

      (jwtService.decode as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      await expect(service.addMembers(projectId, addMembersDto, token)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when user is not the creator of the project', async () => {
      const projectId = 1;
      const addMembersDto: AddMembersDto = { memberIds: [2, 3] };
      const token = 'Bearer token';
      const decodedToken = { sub: 2 };
      const project = { id: 1, name: 'Project 1', creatorId: 1 };

      (jwtService.decode as jest.Mock).mockReturnValue(decodedToken);
      (projectRepository.getProjectById as jest.Mock).mockResolvedValue(project);

      await expect(service.addMembers(projectId, addMembersDto, token)).rejects.toThrow(BadRequestException);
    });
  });
})
