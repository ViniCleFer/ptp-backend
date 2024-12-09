import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateEmailDto } from './dto/create-email.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { EmailsService } from './email.service';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailsService) {}

  @Public()
  @Post()
  sendMail(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.sendMail(createEmailDto);
  }
}
