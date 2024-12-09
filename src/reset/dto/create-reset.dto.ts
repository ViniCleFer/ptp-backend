import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateResetDto {
  @ApiProperty({ description: 'Data e hora que expira o token' })
  @IsDateString()
  @IsNotEmpty()
  expires_date: Date;

  @ApiProperty({ description: 'ID do usuário que quer resetar a senha' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'Token gerado' })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
