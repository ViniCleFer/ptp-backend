import { Injectable } from '@nestjs/common';

import { CreateEmailDto } from './dto/create-email.dto';
import { EmailsRepository } from './repositories/emails.repositories';

@Injectable()
export class EmailsService {
  constructor(private readonly repository: EmailsRepository) {}

  async sendMail(createEmailDto: CreateEmailDto): Promise<boolean> {
    return this.repository.sendMail(createEmailDto);
  }
}
