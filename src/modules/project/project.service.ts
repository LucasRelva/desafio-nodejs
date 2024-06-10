import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepository } from './project.repository';
import { PaginatedProjectDto } from './dto/paginated-project.dto';
import { AddMembersDto } from './dto/add-members.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProjectService {
  constructor(
    private projectRepository: ProjectRepository,
    private jwtService: JwtService,
  ) {
  }

  async create(createProjectDto: CreateProjectDto, token: string) {
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

    createProjectDto.creatorId = userId;
    return await this.projectRepository.createProject(createProjectDto);
  }

  async findAll(page: number, size: number): Promise<PaginatedProjectDto> {
    if (page <= 0) {
      throw new BadRequestException('Invalid page number');
    }

    const response = await this.projectRepository.getProjects(page, size);
    return {
      projects: response,
      currentPage: page,
      pageSize: response.length,
    };
  }

  async findOne(id: number) {
    const project = await this.projectRepository.getProjectById(id);

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.getProjectById(id);

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return await this.projectRepository.updateProject(id, updateProjectDto);
  }

  async remove(id: number) {
    const project = await this.projectRepository.getProjectById(id);

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return await this.projectRepository.deleteProject(id);
  }

  async addMembers(projectId: number, addMembersDto: AddMembersDto, token: string) {
    if (!token) {
      throw new BadRequestException(`A token is required for this request`);
    }
    token = token.split(' ')[1];
    let userId: number;

    try {
      const decodedToken = this.jwtService.decode(token);
      userId = decodedToken.sub;

    } catch (error) {
      throw new BadRequestException(`Invalid token format`);
    }

    const project = await this.projectRepository.getProjectById(projectId);

    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    if (project.creatorId !== userId) {
      throw new BadRequestException(`Only the creator of the project can add members`);
    }

    return await this.projectRepository.addMembers(projectId, addMembersDto.memberIds);
  }
}
