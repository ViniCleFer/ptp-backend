import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppLogDto {
  @ApiProperty({ description: 'Nome do usuário registrado no log' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Id do usuário registrado no log' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'Local da ação realizada' })
  @IsString()
  @IsNotEmpty()
  local: string;

  @ApiProperty({ description: 'Ação realizada' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ description: 'Descrição da ação realizada' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Descrição da ação realizada' })
  @IsString()
  @IsOptional()
  id_entity?: string;

  @ApiProperty({ description: 'Valor antigo' })
  @IsString()
  @IsOptional()
  old_value?: any;

  @ApiProperty({ description: 'Valor novo' })
  @IsString()
  @IsOptional()
  new_value?: any;

  @ApiProperty({ description: 'Valor novo' })
  @IsString()
  @IsOptional()
  ip?: string;
}
