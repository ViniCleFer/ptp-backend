import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateFormPtpDto {
  @ApiProperty({ description: 'Data da Execução do PTP' })
  @IsDateString()
  @IsNotEmpty()
  dataExecucao: string;

  @ApiProperty({ description: 'Conferente que está preenchendo o PTP' })
  @IsString()
  @IsNotEmpty()
  conferente: string;

  @ApiProperty({
    description: 'Nota Fiscal do produto que está sendo vinculado ao PTP',
  })
  @IsString()
  @IsNotEmpty()
  notaFiscal: string;

  @ApiProperty({ description: 'UP que está ocorrendo o preenchimento do PTP' })
  @IsString()
  @IsNotEmpty()
  opcaoUp: string;
}
