import { ApiProperty } from '@nestjs/swagger';
import { Task } from '@prisma/client';

export class PaginatedTaskDto {
  @ApiProperty()
  tasks: Task[];

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  pageSize: number;
}
