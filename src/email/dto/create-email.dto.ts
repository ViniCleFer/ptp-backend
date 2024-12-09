import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEmailDto {
  @ApiProperty({ description: 'Destinatário do e-mail' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ description: 'Assunto do e-mail' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Variáveis utilizadas no e-mail' })
  @IsNotEmpty()
  variables: any;

  @ApiProperty({ description: 'Caminho para o template do e-mail' })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({ description: 'Caminho para o template do e-mail' })
  @IsOptional()
  test: string;
}
