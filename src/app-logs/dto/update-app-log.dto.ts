import { PartialType } from '@nestjs/swagger';
import { CreateAppLogDto } from './create-app-log.dto';

export class UpdateAppLogDto extends PartialType(CreateAppLogDto) {}
