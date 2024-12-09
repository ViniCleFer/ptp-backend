import { ApiProperty } from '@nestjs/swagger';
import { UserNivel, UserStatus } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'E-mail do usuário' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Celular do usuário' })
  @IsString()
  @IsOptional()
  phone?: string | null;

  @ApiProperty({
    description: 'Tipo do status do usuário',
    enum: UserStatus,
    default: 'US1',
  })
  @IsString()
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({
    description: 'Tipo do perfil do usuário',
    enum: UserNivel,
    default: 'UN2 - Membro',
  })
  @IsString()
  @IsOptional()
  profile?: UserNivel;

  @ApiProperty({ description: 'ID do usuário que está criando o usuário' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
