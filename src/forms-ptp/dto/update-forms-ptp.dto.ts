import { PartialType } from '@nestjs/swagger';
import { CreateFormPtpDto } from './create-forms-ptp.dto';

export class UpdateFormPtpDto extends PartialType(CreateFormPtpDto) {}
