import { PartialType } from '@nestjs/swagger';
import { CreateLaudoCrmDto } from './create-laudo-crm.dto';

export class UpdateLaudoCrmDto extends PartialType(CreateLaudoCrmDto) {}
