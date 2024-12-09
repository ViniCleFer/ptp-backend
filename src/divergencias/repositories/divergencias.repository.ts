import { Injectable, Logger } from '@nestjs/common';

import { NotFoundError } from 'src/common/errors/types/NotFoundError';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateDivergenciaDto } from '../dto/create-divergencia.dto';
import { UpdateDivergenciaDto } from '../dto/update-divergencia.dto';
import { DivergenciaEntity } from '../entities/divergencia.entity';

import { AppLogsService } from 'src/app-logs/app-logs.service';

@Injectable()
export class DivergenciasRepository {
  private readonly logger = new Logger(DivergenciasRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly appLogsService: AppLogsService,
  ) {}

  async create(
    createDivergenciaDto: CreateDivergenciaDto,
    files: Express.Multer.File[],
    userId: string,
    ip: string,
  ): Promise<DivergenciaEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const divergencia = await this.prisma.divergencia.create({
        data: { ...(createDivergenciaDto as any) },
      });

      await this.appLogsService.createLog({
        name: user.name,
        user_id: userId,
        local: 'Divergencia',
        action: 'Criou',
        description: `Criou um Divergência de ID "${divergencia?.id}"`,
        ip,
        id_entity: divergencia?.id,
      });

      return divergencia as any;
    } catch (error) {
      this.logger.error(error, 'Create Divergência Error');
      throw error;
    }
  }

  async findAll(search: string, page: string, size: string, userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const limit = Number(size);
      const pgNumber = Number(page) + 1;
      const offSet = Number(pgNumber) > 1 ? limit * (Number(pgNumber) - 1) : 0;

      const divergencias = await this.prisma.divergencia.findMany({
        where: {
          OR: [
            {
              skuFaltandoFisicamente: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              skuSobrandoFisicamente: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              skuRecebemosFisicamente: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              skuNotaFiscal: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: {
          created_at: 'asc',
        },
        take: limit,
        skip: offSet,
      });

      const divergenciasCount = divergencias.length;

      const data = {
        divergencias,
        divergenciasCount,
      };

      return data;
    } catch (error) {
      this.logger.error(error, 'FindAll Divergência Error');
      throw error;
    }
  }

  async findById(id: string, userId: string): Promise<DivergenciaEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const divergencia = await this.prisma.divergencia.findUnique({
        where: {
          id,
        },
      });

      if (!divergencia) {
        throw new NotFoundError('Divergência não encontrada.');
      }

      return divergencia as any;
    } catch (error) {
      this.logger.error(error, 'FindById Divergência Error');
      throw error;
    }
  }

  async update(
    id: string,
    updateDivergenciaDto: UpdateDivergenciaDto,
    userId: string,
    ip: string,
  ): Promise<DivergenciaEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const divergenciaFounded = await this.prisma.divergencia.findUnique({
        where: { id },
      });

      if (!divergenciaFounded) {
        throw new NotFoundError('Divergência não encontrada.');
      }

      const divergencia = await this.prisma.divergencia.update({
        where: {
          id,
        },
        data: { ...(updateDivergenciaDto as any) },
      });

      await this.appLogsService.createLog({
        name: user.name,
        user_id: userId,
        local: 'Divergencia',
        action: 'Alterou',
        description: `Alterou a Divergência de ID "${divergencia?.id}"`,
        ip,
        id_entity: divergencia?.id,
      });

      return divergencia as any;
    } catch (error) {
      this.logger.error(error, 'Update Divergência Error');
      throw error;
    }
  }

  async remove(
    id: string,
    userId: string,
    ip: string,
  ): Promise<DivergenciaEntity> {
    try {
      const divergenciaFounded = await this.prisma.divergencia.findUnique({
        where: { id },
      });

      if (!divergenciaFounded) {
        throw new NotFoundError('Divergência não encontrada.');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const divergencia = await this.prisma.divergencia.update({
        where: {
          id,
        },
        data: {
          canceled_at: new Date(),
        },
      });

      await this.appLogsService.createLog({
        name: user.name,
        user_id: userId,
        local: 'Divergencia',
        action: 'Deletou',
        description: `Removeu a Divergência de ID "${divergencia?.id}"`,
        ip,
        id_entity: divergencia?.id,
      });

      return divergencia as any;
    } catch (error) {
      this.logger.error(error, 'Remove Divergência Error');
      throw error;
    }
  }

  async delete(
    id: string,
    userId: string,
    ip: string,
  ): Promise<DivergenciaEntity> {
    try {
      const divergenciaFounded = await this.prisma.divergencia.findUnique({
        where: { id },
      });

      if (!divergenciaFounded) {
        throw new NotFoundError('Divergência não encontrada.');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const divergencia = await this.prisma.divergencia.delete({
        where: {
          id,
        },
      });

      await this.appLogsService.createLog({
        name: user.name,
        user_id: userId,
        local: 'Divergencia',
        action: 'Deletou',
        description: `Excluiu a Divergência de ID "${divergencia?.id}"`,
        ip,
        id_entity: divergencia?.id,
      });

      return divergencia as any;
    } catch (error) {
      this.logger.error(error, 'Delete Divergência Error');
      throw error;
    }
  }
}
