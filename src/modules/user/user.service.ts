import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { PaginatedUserDto } from './dto/paginated-user.dto';
import * as bcrypt from 'bcrypt';
import { SimpleUserDto } from './dto/simple-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {
  }

  async create(createUserDto: CreateUserDto) {
    const userFound = await this.userRepository.getUserByEmail(createUserDto.email)

    if (userFound) {
      throw new BadRequestException(userFound.email, "There is already a user with this email");
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = await this.userRepository.createUser(createUserDto);

    return new SimpleUserDto(createdUser.id, createdUser.name, createdUser.email);
  }

  async findAll(page: number, size: number): Promise<PaginatedUserDto> {
    if (page <= 0) {
      throw new BadRequestException(page, "Invalid page number");
    }

    const response = await this.userRepository.getUsers(page, size);
    let users = response.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword;
    });

    return {
      users: users,
      currentPage: page,
      pageSize: response.length,
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedUser = await this.userRepository.updateUser(id, updateUserDto);
    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async remove(id: number) {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return await this.userRepository.deleteUser(id);
  }

  async getUserByEmail(email: string) {
    const userFound = await this.userRepository.getUserByEmail(email)

    if (!userFound) {
      throw new NotFoundException("User with email does not exist");
    }

    return userFound
  }
}
