import { ApiProperty } from '@nestjs/swagger';
import { TipoNaoConformidade, Turno } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateLaudoCrmDto {
  @ApiProperty({ description: 'Número do documento referente ao Transporte' })
  @IsString()
  @IsNotEmpty()
  documentoTransporte: string;

  @ApiProperty({ description: 'Nome do motorista transportador' })
  @IsString()
  @IsNotEmpty()
  transportador: string;

  @ApiProperty({ description: 'Placa do veículo transportador' })
  @IsString()
  @IsNotEmpty()
  placa: string;

  @ApiProperty({
    description: 'Nota Fiscal do produto que está sendo vinculado ao Laudo',
  })
  @IsString()
  @IsNotEmpty()
  notaFiscal: string;

  @ApiProperty({ description: 'Data da Identificação da Não Conformidade' })
  @IsDateString()
  @IsNotEmpty()
  dataIdentificacao: string;

  @ApiProperty({ description: 'Conferente que está preenchendo o Laudo' })
  @IsString()
  @IsNotEmpty()
  conferente: string;

  @ApiProperty({ default: 'Turno que está sendo preenchido o Laudo' })
  @IsEnum(Turno)
  @IsNotEmpty()
  turno: Turno;

  @ApiProperty({
    description: 'UP de origem que está ocorrendo o preenchimento do Laudo',
  })
  @IsString()
  @IsNotEmpty()
  origem: string;

  @ApiProperty({
    default: 'Tipos de Não Conformidades que está sendo preenchido o Laudo',
  })
  @IsEnum(TipoNaoConformidade)
  @IsNotEmpty()
  @IsArray()
  tipsoNaoConformidade: TipoNaoConformidade[];

  @ApiProperty({
    default: 'Evidências encontradas no recebimento',
  })
  @IsArray()
  @IsNotEmpty()
  evidencias: any[];

  @ApiProperty({ description: 'ID do PTP ao qual pertence o Laudo' })
  @IsString()
  @IsNotEmpty()
  form_ptp_id: string;
}
