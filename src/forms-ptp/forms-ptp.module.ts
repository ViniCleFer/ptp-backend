import { Module } from '@nestjs/common';
import { FormsPtpService } from './forms-ptp.service';
import { FormsPtpController } from './forms-ptp.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppLogsModule } from 'src/app-logs/app-logs.module';
import { FormsPtpRepository } from './repositories/forms-ptp.repository';

@Module({
  imports: [PrismaModule, AppLogsModule],
  controllers: [FormsPtpController],
  providers: [FormsPtpService, FormsPtpRepository],
  exports: [FormsPtpService],
})
export class FormsPtpModule {}
