import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { FilesModule } from '../files/files.module';
import { PrismaModule } from '../prisma/prisma.module';
import { HealthController } from './health.controller';
import { TextHealthIndicator } from './health.text';

@Module({
  imports: [TerminusModule, ConfigModule, PrismaModule, FilesModule],
  controllers: [HealthController],
  providers: [TextHealthIndicator],
})
export class HealthModule {}
