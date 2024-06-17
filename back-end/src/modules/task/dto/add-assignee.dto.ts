import { ApiProperty } from '@nestjs/swagger';

export class AddAssigneeDto {
  @ApiProperty({ description: 'ID of the user to be assigned to the task' })
  userId: number;
}
