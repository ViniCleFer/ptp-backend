import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsMimeType,
  IsNumber,
} from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ description: 'Nome do arquivo' })
  @MinLength(2)
  @IsString()
  @IsOptional()
  key?: string;

  @ApiProperty({ description: 'Nome do arquivo' })
  @MinLength(2)
  @MaxLength(250)
  @IsString()
  @IsOptional()
  original_name?: string;

  @ApiProperty({ description: 'URL do arquivo' })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ description: 'Tipo do arquivo. (Ex: PDF, PNG, etc)' })
  @IsMimeType()
  @IsString()
  @IsOptional()
  mimetype?: string;

  @ApiProperty({ description: 'Tamanho do arquivo. (Ex: PDF, PNG, etc)' })
  @IsNumber()
  @IsOptional()
  size?: number;

  @ApiProperty({ description: 'Privacidade do arquivo' })
  @IsBoolean()
  @IsNotEmpty()
  is_public: boolean;

  @ApiProperty({ description: 'ID do usuário que criou o arquivo' })
  @IsString()
  @IsOptional()
  user_id: string;
}
