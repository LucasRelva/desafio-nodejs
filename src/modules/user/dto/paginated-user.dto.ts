import { User } from '@prisma/client';
import { SimpleUserDto } from './simple-user.dto';

export class PaginatedUserDto {
  users: SimpleUserDto[]
  currentPage: number
  pageSize: number
}
