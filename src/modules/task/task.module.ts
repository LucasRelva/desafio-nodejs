import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TaskRepository } from './task.repository';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, PrismaService, JwtService, UserService, UserRepository],
})
export class TaskModule {}
