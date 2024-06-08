import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async getUsers(page: number, pageSize: number): Promise<User[]> {
    try {
      const offset = (page - 1) * pageSize;
      return await this.prisma.user.findMany({
        skip: offset,
        take: pageSize,
      });
    } catch (error) {
      console.error('Error occurred while fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('Error occurred while fetching user by ID:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error('Error occurred while fetching user by EMAIL:', error);
      throw error;
    }
  }

  async createUser(data: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.user.create({
        data,
      });
    } catch (error) {
      console.error('Error occurred while creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error occurred while updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<User | null> {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error occurred while deleting user:', error);
      throw error;
    }
  }
}
