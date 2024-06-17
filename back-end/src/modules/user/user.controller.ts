import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SimpleUserDto } from './dto/simple-user.dto';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful.' })
  @ApiBadRequestResponse({ description: 'Invalid email or password.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    type: SimpleUserDto,
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data.' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'size',
    required: true,
    description: 'Page size',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched users.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error.',
  })
  findAll(@Query('page') page: number, @Query('size') size: number) {
    return this.userService.findAll(page, size);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched user.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error.',
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated user.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data.' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error.',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully deleted user.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error.',
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
