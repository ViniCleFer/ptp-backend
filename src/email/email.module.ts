import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './email.controller';
import { EmailsService } from './email.service';
import { EmailsRepository } from './repositories/emails.repositories';

@Module({
  imports: [ConfigModule],
  controllers: [EmailController],
  providers: [EmailsService, EmailsRepository],
  exports: [EmailsService],
})
export class EmailModule {}
