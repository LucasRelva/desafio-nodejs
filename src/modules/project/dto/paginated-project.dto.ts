import { ApiProperty } from '@nestjs/swagger';
import { Project } from '@prisma/client';

export class PaginatedProjectDto {
  @ApiProperty()
  projects: Project[];

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  pageSize: number;
}
