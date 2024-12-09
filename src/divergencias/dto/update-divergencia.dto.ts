import { PartialType } from '@nestjs/swagger';
import { CreateDivergenciaDto } from './create-divergencia.dto';

export class UpdateDivergenciaDto extends PartialType(CreateDivergenciaDto) {}
