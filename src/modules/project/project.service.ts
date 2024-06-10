import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepository } from './project.repository';
import { PaginatedProjectDto } from './dto/paginated-project.dto';
import { AddMembersDto } from './dto/add-members.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    private projectRepository: ProjectRepository,
    private jwtService: JwtService,
  ) {}

  async create(createProjectDto: CreateProjectDto, token: string) {
    if (!token) {
      this.logger.error('A token is required for this request');
      throw new BadRequestException(`A token is required for this request`);
    }

    token = token.split(' ')[1];
    let userId;

    try {
      const decodedToken = this.jwtService.decode(token);
      userId = decodedToken.sub;
    } catch (error) {
      this.logger.error('Invalid token format');
      throw new BadRequestException(`Invalid token format`);
    }

    createProjectDto.creatorId = userId;
    const project = await this.projectRepository.createProject(createProjectDto);
    this.logger.log(`Project created successfully with id ${project.id}`);
    return project;
  }

  async findAll(page: number, size: number): Promise<PaginatedProjectDto> {
    if (page <= 0) {
      this.logger.error('Invalid page number');
      throw new BadRequestException('Invalid page number');
    }

    const response = await this.projectRepository.getProjects(page, size);
    this.logger.log(`Fetched ${response.length} projects from page ${page}`);
    return {
      projects: response,
      currentPage: page,
      pageSize: response.length,
    };
  }

  async findOne(id: number) {
    const project = await this.projectRepository.getProjectById(id);

    if (!project) {
      this.logger.error(`Project with id ${id} not found`);
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    this.logger.log(`Fetched project with id ${id}`);
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.getProjectById(id);

    if (!project) {
      this.logger.error(`Project with id ${id} not found`);
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    const updatedProject = await this.projectRepository.updateProject(id, updateProjectDto);
    this.logger.log(`Project with id ${id} updated successfully`);
    return updatedProject;
  }

  async remove(id: number) {
    const project = await this.projectRepository.getProjectById(id);

    if (!project) {
      this.logger.error(`Project with id ${id} not found`);
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    await this.projectRepository.deleteProject(id);
    this.logger.log(`Project with id ${id} removed successfully`);
  }

  async addMembers(projectId: number, addMembersDto: AddMembersDto, token: string) {
    if (!token) {
      this.logger.error('A token is required for this request');
      throw new BadRequestException(`A token is required for this request`);
    }

    token = token.split(' ')[1];
    let userId: number;

    try {
      const decodedToken = this.jwtService.decode(token);
      userId = decodedToken.sub;
    } catch (error) {
      this.logger.error('Invalid token format');
      throw new BadRequestException(`Invalid token format`);
    }

    const project = await this.projectRepository.getProjectById(projectId);

    if (!project) {
      this.logger.error(`Project with id ${projectId} not found`);
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    if (project.creatorId !== userId) {
      this.logger.error(`User with id ${userId} is not the creator of project ${projectId}`);
      throw new BadRequestException(`Only the creator of the project can add members`);
    }

    await this.projectRepository.addMembers(projectId, addMembersDto.memberIds);
    this.logger.log(`Members added to project ${projectId} successfully`);
  }
}
