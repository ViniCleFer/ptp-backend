import { Module } from '@nestjs/common';
import { LaudosCrmService } from './laudos-crm.service';
import { LaudosCrmController } from './laudos-crm.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppLogsModule } from 'src/app-logs/app-logs.module';
import { LaudosCrmRepository } from './repositories/laudos-crm.repository';

@Module({
  imports: [PrismaModule, AppLogsModule],
  controllers: [LaudosCrmController],
  providers: [LaudosCrmService, LaudosCrmRepository],
  exports: [LaudosCrmService],
})
export class LaudosCrmModule {}
