import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';

export class AddTagsDto {
  @ApiProperty({ isArray: true })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  tagIds: number[];
}
