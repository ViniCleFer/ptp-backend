import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import handlebars from 'handlebars';
import { readFileSync } from 'node:fs';

import { CreateEmailDto } from '../dto/create-email.dto';

@Injectable()
export class EmailsRepository {
  constructor(
    private mailService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async sendMail(createEmailDto: CreateEmailDto): Promise<boolean> {
    const templateFile = await readFileSync(createEmailDto.path).toString(
      'utf-8',
    );

    handlebars.registerHelper({
      eq: (v1, v2) => v1 === v2,
      ne: (v1, v2) => v1 !== v2,
      lt: (v1, v2) => v1 < v2,
      gt: (v1, v2) => v1 > v2,
      lte: (v1, v2) => v1 <= v2,
      gte: (v1, v2) => v1 >= v2,
    });

    const templateParse = handlebars.compile(templateFile);

    const templateHTML = templateParse(createEmailDto.variables);

    const emailSended = await this.mailService
      .sendMail({
        to: createEmailDto.to,
        from: `Ten Governance <${this.config.get<string>(
          'SEND_GRID_EMAIL_PROVIDER',
        )}>`,
        subject: createEmailDto.subject,
        html: templateHTML,
      })
      .then(() => {
        return true;
      })
      .catch(err => {
        console.log('erro envio de email', err);
        return false;
      });

    return emailSended;
  }
}
