import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { PaginatedUserDto } from './dto/paginated-user.dto';
import * as bcrypt from 'bcrypt';
import { SimpleUserDto } from './dto/simple-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const userFound = await this.userRepository.getUserByEmail(
      createUserDto.email,
    );

    if (userFound) {
      this.logger.warn(`User with email ${createUserDto.email} already exists`);
      throw new BadRequestException(
        userFound.email,
        'There is already a user with this email',
      );
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = await this.userRepository.createUser(createUserDto);

    this.logger.log(
      `User with email ${createUserDto.email} created successfully`,
    );

    return new SimpleUserDto(
      createdUser.id,
      createdUser.name,
      createdUser.email,
    );
  }

  async findAll(page: number, size: number): Promise<PaginatedUserDto> {
    if (page <= 0) {
      this.logger.error(`Invalid page number: ${page}`);
      throw new BadRequestException(page, 'Invalid page number');
    }

    const response = await this.userRepository.getUsers(page, size);
    let users = response.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    this.logger.log(`Fetched ${response.length} users from page ${page}`);

    return {
      users: users,
      currentPage: page,
      pageSize: response.length,
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const { password, ...userWithoutPassword } = user;

    this.logger.log(`User with id ${id} fetched successfully`);

    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedUser = await this.userRepository.updateUser(id, updateUserDto);
    const { password, ...userWithoutPassword } = updatedUser;

    this.logger.log(`User with id ${id} updated successfully`);

    return userWithoutPassword;
  }

  async remove(id: number) {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }

    this.logger.log(`User with id ${id} removed successfully`);

    return await this.userRepository.deleteUser(id);
  }

  async getUserByEmail(email: string) {
    const userFound = await this.userRepository.getUserByEmail(email);

    if (!userFound) {
      this.logger.error(`User with email ${email} does not exist`);
      throw new NotFoundException('User with email does not exist');
    }

    this.logger.log(`User with email ${email} fetched successfully`);

    return userFound;
  }
}
