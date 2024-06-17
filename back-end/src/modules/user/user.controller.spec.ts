import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test user',
        email: 'email',
        password: 'password',
      };
      const createdUser = { id: 1, ...createUserDto };

      (userService.create as jest.Mock).mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(createdUser);
    });

    it('should handle error when creating a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test user',
        email: 'email',
        password: 'password',
      };

      (userService.create as jest.Mock).mockRejectedValue(
        new Error('Failed to create user'),
      );

      await expect(controller.create(createUserDto)).rejects.toThrow(
        'Failed to create user',
      );
    });
  });

  describe('login', () => {
    it('should return login successful', async () => {
      const loginDto: LoginDto = { email: 'email', password: 'password' };
      const user = { id: 1, name: 'test user' };
      const token = 'generated_token';

      (authService.login as jest.Mock).mockResolvedValue(token);

      const result = await controller.login({ user });

      expect(result).toEqual(token);
    });

    it('should handle error when login fails', async () => {
      const loginDto: LoginDto = { email: 'email', password: 'password' };
      const user = { id: 1, username: 'test user' };

      (authService.login as jest.Mock).mockRejectedValue(
        new Error('Failed to login'),
      );

      await expect(controller.login({ user })).rejects.toThrow(
        'Failed to login',
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const page = 1;
      const size = 10;
      const users = [
        { id: 1, username: 'user1' },
        { id: 2, username: 'user2' },
      ];

      (userService.findAll as jest.Mock).mockResolvedValue(users);

      const result = await controller.findAll(page, size);

      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const id = '1';
      const user = { id: 1, username: 'testuser' };

      (userService.findOne as jest.Mock).mockResolvedValue(user);

      const result = await controller.findOne(id);

      expect(result).toEqual(user);
    });

    it('should handle error when user is not found', async () => {
      const id = '999';

      (userService.findOne as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = {
        name: 'test user',
        email: 'email',
        password: 'password',
      };
      const updatedUser = { id: 1, ...updateUserDto };

      (userService.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await controller.update(id, updateUserDto);

      expect(result).toEqual(updatedUser);
    });

    it('should handle error when user is not found', async () => {
      const id = '999';
      const updateUserDto: UpdateUserDto = {
        name: 'test user',
        email: 'email',
        password: 'password',
      };

      (userService.update as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.update(id, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const id = '1';

      (userService.remove as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(result).toBeUndefined();
    });

    it('should handle error when user is not found', async () => {
      const id = '999';

      (userService.remove as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
