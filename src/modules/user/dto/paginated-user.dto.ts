import { User } from '@prisma/client';

export class PaginatedUserDto {
  users: User[]
  currentPage: number
  pageSize: number
}
