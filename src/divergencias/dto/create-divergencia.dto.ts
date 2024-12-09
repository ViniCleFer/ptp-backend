import { ApiProperty } from '@nestjs/swagger';
import { TipoDivergencia } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDivergenciaDto {
  @ApiProperty({
    default: 'Tipo da divergência encontrada',
  })
  @IsEnum(TipoDivergencia)
  @IsNotEmpty()
  tipoDivergencia: TipoDivergencia;

  @ApiProperty({
    default: 'Evidências encontradas na divergência',
  })
  @IsArray()
  @IsNotEmpty()
  evidencias: any[];

  @ApiProperty({ description: 'Sku do produto que está faltando fisicamente' })
  @IsString()
  @IsOptional()
  skuFaltandoFisicamente: string;

  @ApiProperty({
    description: 'Quantidade do produto que está faltando fisicamente',
  })
  @IsString()
  @IsOptional()
  qtdFaltandoFisicamente: string;

  @ApiProperty({ description: 'Sku do produto que está sobrando fisicamente' })
  @IsString()
  @IsOptional()
  skuSobrandoFisicamente: string;

  @ApiProperty({
    description: 'Quantidade do produto que está sobrando fisicamente',
  })
  @IsString()
  @IsOptional()
  qtdSobrandoFisicamente: string;

  @ApiProperty({ description: 'Sku do produto que recebemos fisicamente' })
  @IsString()
  @IsOptional()
  skuRecebemosFisicamente: string;

  @ApiProperty({
    description: 'Quantidade do produto que recebemos fisicamente',
  })
  @IsString()
  @IsOptional()
  qtdRecebemosFisicamente: string;

  @ApiProperty({ description: 'Sku do produto na Nota Fiscal' })
  @IsString()
  @IsOptional()
  skuNotaFiscal: string;

  @ApiProperty({ description: 'Quantidade do produto na Nota Fiscal' })
  @IsString()
  @IsOptional()
  qtdNotaFiscal: string;

  @ApiProperty({ description: 'Próximos passos' })
  @IsString()
  @IsNotEmpty()
  proximoPasso: string;
}
