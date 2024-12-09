import { Module } from '@nestjs/common';
import { AppLogsService } from './app-logs.service';
import { AppLogsController } from './app-logs.controller';
import { AppLogsRepository } from './repositories/app-logs.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppLogsHelper } from './helpers/app-logs.helper';
import { HttpHelper } from './helpers/http.helper';

@Module({
  exports: [AppLogsService, HttpHelper],
  imports: [PrismaModule],
  controllers: [AppLogsController],
  providers: [AppLogsService, AppLogsRepository, AppLogsHelper, HttpHelper],
})
export class AppLogsModule {}
