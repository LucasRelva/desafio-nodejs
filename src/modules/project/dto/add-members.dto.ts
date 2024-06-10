import { ApiProperty } from '@nestjs/swagger';

export class AddMembersDto {
  @ApiProperty({ type: [Number] })
  memberIds: number[];
}
