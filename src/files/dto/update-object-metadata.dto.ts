import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectMetadataDto } from './object-metadata.dto';

export class UpdateObjectMetadataDto {
  @ApiProperty({ default: 'file/path.pdf' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmptyObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ObjectMetadataDto)
  metadata: ObjectMetadataDto;
}
