import { Module } from '@nestjs/common';
import { DivergenciasService } from './divergencias.service';
import { DivergenciasController } from './divergencias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppLogsModule } from 'src/app-logs/app-logs.module';
import { DivergenciasRepository } from './repositories/divergencias.repository';

@Module({
  imports: [PrismaModule, AppLogsModule],
  controllers: [DivergenciasController],
  providers: [DivergenciasService, DivergenciasRepository],
  exports: [DivergenciasService],
})
export class DivergenciasModule {}
