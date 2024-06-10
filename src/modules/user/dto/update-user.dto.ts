import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  name: string
  @ApiProperty()
  @IsEmail
  email: string
  @ApiProperty()
  password: string
}
