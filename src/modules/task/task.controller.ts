import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginatedTaskDto } from './dto/paginated-task.dto';
import { ApiTags, ApiBody, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiBadRequestResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AddTagsDto } from './dto/add-tags.dto';
import { AddAssigneeDto } from './dto/add-assignee.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiBody({ type: CreateTaskDto })
  @ApiBearerAuth()
  @ApiResponse({ type: CreateTaskDto, status: HttpStatus.CREATED, description: 'The task has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return await this.taskService.create(createTaskDto, req.headers.authorization);
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: true, description: 'Page number', type: Number })
  @ApiQuery({ name: 'size', required: true, description: 'Page size', type: Number })
  @ApiResponse({ type: PaginatedTaskDto, status: HttpStatus.OK, description: 'Successfully fetched tasks.' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async findAll(@Query('page') page: number, @Query('size') size: number) {
    return await this.taskService.findAll(page, size);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Task ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully fetched task.' })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async findOne(@Param('id') id: number) {
    return await this.taskService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully updated task.' })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Task ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Successfully deleted task.' })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async remove(@Param('id') id: number) {
    return await this.taskService.remove(+id);
  }

  @Post(':id/tags')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Task ID' })
  @ApiBody({ type: AddTagsDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tags successfully added to the task.' })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiBadRequestResponse({ description: 'Invalid data or unauthorized action.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async addTags(@Param('id') id: number, @Body() addTagsDto: AddTagsDto) {
    return await this.taskService.addTagsToTask(+id, addTagsDto);
  }

  @Post(':id/assignees')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Task ID' })
  @ApiBody({ type: AddAssigneeDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Assignee successfully added to the task.' })
  @ApiNotFoundResponse({ description: 'Task or user not found.' })
  @ApiBadRequestResponse({ description: 'Invalid data or unauthorized action.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async addAssignee(@Param('id') id: number, @Body() addAssigneeDto: AddAssigneeDto) {
    return await this.taskService.addAssignee(+id, addAssigneeDto);
  }
}
