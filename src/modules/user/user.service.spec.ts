import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaginatedUserDto } from './dto/paginated-user.dto';
import { SimpleUserDto } from './dto/simple-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  async hash(password: string, saltOrRounds: number): Promise<string> {
    return 'hashedPassword';
  },
}));

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            getUserByEmail: jest.fn(),
            getUsers: jest.fn(),
            getUserById: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = { name: "Test user", email: 'test@test.com', password: 'password' };
      const createdUser = { id: 1, ...createUserDto };
      const hashedPassword = 'hashedPassword';

      (repository.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (repository.createUser as jest.Mock).mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(new SimpleUserDto(createdUser.id, createdUser.name, createdUser.email));
      expect(repository.createUser).toHaveBeenCalledWith({ ...createUserDto, password: hashedPassword });
    });

    it('should throw BadRequestException when user email already exists', async () => {
      const createUserDto: CreateUserDto = {  name: "Test user", email: 'test@test.com', password: 'password' };

      (repository.getUserByEmail as jest.Mock).mockResolvedValue(createUserDto);

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const page = 1;
      const size = 10;
      const users = [{ id: 1, name: "Test user 1", email: 'user1@test.com' }, { id: 2, name: "Test user 2", email: 'user2@test.com' }];
      const paginatedResponse: PaginatedUserDto = {
        users: users.map(user => new SimpleUserDto(user.id, user.name, user.email)),
        currentPage: page,
        pageSize: users.length,
      };

      (repository.getUsers as jest.Mock).mockResolvedValue(users);

      const result = await service.findAll(page, size);

      expect(result).toEqual(paginatedResponse);
    });

    it('should throw BadRequestException when page number is invalid', async () => {
      const page = 0;
      const size = 10;

      await expect(service.findAll(page, size)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const id = 1;
      const user = { id, email: 'test@test.com', name: "Test name" };

      (repository.getUserById as jest.Mock).mockResolvedValue(user);

      const result = await service.findOne(id);

      expect(result).toEqual(new SimpleUserDto(user.id, user.name, user.email));
    });

    it('should throw NotFoundException when user is not found', async () => {
      const id = 999;

      (repository.getUserById as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = { email: 'updated@test.com', name: "test name", password: "password" };
      const updatedUser = { id, ...updateUserDto };

      (repository.getUserById as jest.Mock).mockResolvedValue(updatedUser);
      (repository.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(id, updateUserDto);

      expect(result).toEqual(new SimpleUserDto(updatedUser.id, updatedUser.name, updatedUser.email));
    });

    it('should throw NotFoundException when user is not found', async () => {
      const id = 999;
      const updateUserDto: UpdateUserDto = { email: 'updated@test.com', name: "test name", password: "password" };

      (repository.getUserById as jest.Mock).mockResolvedValue(null);

      await expect(service.update(id, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const id = 1;

      (repository.getUserById as jest.Mock).mockResolvedValue({ id });
      (repository.deleteUser as jest.Mock).mockResolvedValue({});

      const result = await service.remove(id);

      expect(result).toEqual({});
    });

    it('should throw NotFoundException when user is not found', async () => {
      const id = 999;

      (repository.getUserById as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@test.com';
      const user = { id: 1, email };

      (repository.getUserByEmail as jest.Mock).mockResolvedValue(user);

      const result = await service.getUserByEmail(email);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user with email is not found', async () => {
      const email = 'test@test.com';

      (repository.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.getUserByEmail(email)).rejects.toThrow(NotFoundException);
    });
  });
});
