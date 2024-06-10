import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiTags, ApiBody, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiBadRequestResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiBody({ type: CreateTagDto })
  @ApiBearerAuth()
  @ApiResponse({ type: CreateTagDto, status: HttpStatus.CREATED, description: 'The tag has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: true, description: 'Page number', type: Number })
  @ApiQuery({ name: 'size', required: true, description: 'Page size', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully fetched tags.' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async findAll(@Query('page') page: number, @Query('size') size: number) {
    return this.tagService.findAll(page, size);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Tag ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully fetched tag.' })
  @ApiNotFoundResponse({ description: 'Tag not found.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async findOne(@Param('id') id: number) {
    return this.tagService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Tag ID' })
  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully updated tag.' })
  @ApiNotFoundResponse({ description: 'Tag not found.' })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async update(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'Tag ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Successfully deleted tag.' })
  @ApiNotFoundResponse({ description: 'Tag not found.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  async remove(@Param('id') id: number) {
    return this.tagService.remove(+id);
  }
}
