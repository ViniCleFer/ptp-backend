import { IsBooleanString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ObjectMetadataDto {
  @ApiPropertyOptional({ default: 'true' })
  @IsOptional()
  @IsBooleanString()
  public?: string;
}
