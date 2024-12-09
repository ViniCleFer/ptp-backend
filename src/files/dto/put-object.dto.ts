import {
  IsNotEmpty,
  IsOptional,
  IsMimeType,
  IsString,
  IsObject,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { SlugTransform } from '../../common/decorators/slug-transform.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectMetadataDto } from './object-metadata.dto';
import { Type } from 'class-transformer';

export class PutObjectDto {
  @ApiProperty({ description: 'filename.pdf' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ description: 'application/pdf' })
  @IsMimeType()
  @IsNotEmpty()
  mimetype: string;

  @ApiPropertyOptional({ description: 'Meu Arquivo' })
  @SlugTransform({ trim: true, lower: true, replacement: '_' })
  @IsOptional()
  newFilename?: string;

  @ApiPropertyOptional({ description: 'minha/pasta/aqui' })
  @SlugTransform({ trim: true, lower: true, replacement: '/' })
  @IsOptional()
  folder?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ObjectMetadataDto)
  metadata?: ObjectMetadataDto;

  @ApiPropertyOptional({ description: 'Arquivo em Base64' })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  file?: string;
}
