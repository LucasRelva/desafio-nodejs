import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginatedProjectDto } from './dto/paginated-project.dto';
import { AddMembersDto } from './dto/add-members.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {
  }

  @Post()
  @ApiBody({ type: CreateProjectDto })
  @ApiBearerAuth()
  @ApiResponse({
    type: CreateProjectDto,
    status: HttpStatus.CREATED,
    description: 'The project has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return await this.projectService.create(createProjectDto, req.headers.authorization);
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: true, description: 'Page number', type: Number })
  @ApiQuery({ name: 'size', required: true, description: 'Page size', type: Number })
  @ApiResponse({ type: PaginatedProjectDto, status: HttpStatus.OK, description: 'Successfully fetched projects.' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async findAll(@Query('page') page: number, @Query('size') size: number) {
    return await this.projectService.findAll(page, size);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Project ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully fetched project.' })
  @ApiNotFoundResponse({ description: 'Project not found.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async findOne(@Param('id') id: number) {
    return await this.projectService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Project ID' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully updated project.' })
  @ApiNotFoundResponse({ description: 'Project not found.' })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async update(@Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return await this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Project ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Successfully deleted project.' })
  @ApiNotFoundResponse({ description: 'Project not found.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async remove(@Param('id') id: number) {
    return await this.projectService.remove(+id);
  }

  @Post(':id/members')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Project ID' })
  @ApiBody({ type: AddMembersDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Members successfully added to the project.' })
  @ApiNotFoundResponse({ description: 'Project not found.' })
  @ApiBadRequestResponse({ description: 'Invalid data or unauthorized action.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async addMembers(@Param('id') id: number, @Body() addMembersDto: AddMembersDto, @Request() req) {
    return await this.projectService.addMembers(+id, addMembersDto, req.headers.authorization);
  }
}
