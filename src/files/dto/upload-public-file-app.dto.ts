import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsMimeType,
  IsNumber,
} from 'class-validator';

export class UploadPublicFileAppDto {
  @ApiProperty({ description: 'Arquivo em Base64' })
  @IsNotEmpty()
  @IsString()
  base64_file: string;

  @ApiProperty({ description: 'Nome do arquivo' })
  @MinLength(2)
  @MaxLength(250)
  @IsString()
  @IsNotEmpty()
  original_name: string;

  @ApiProperty({
    description: 'Mimetype do arquivo. (Ex: application/pdf, image/png, etc)',
  })
  @IsMimeType()
  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @ApiProperty({ description: 'Tamanho do arquivo em bytes' })
  @IsNumber()
  @IsNotEmpty()
  size: number;
}
