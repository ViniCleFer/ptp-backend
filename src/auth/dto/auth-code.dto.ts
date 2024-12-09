import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthCodeDto {
  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
