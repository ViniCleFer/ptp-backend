import { Module } from '@nestjs/common';
import { ResetService } from './reset.service';
import { ResetController } from './reset.controller';
import { ResetRepository } from './repositories/reset.repositories';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ResetController],
  providers: [ResetService, ResetRepository],
  exports: [ResetService],
})
export class ResetModule {}
