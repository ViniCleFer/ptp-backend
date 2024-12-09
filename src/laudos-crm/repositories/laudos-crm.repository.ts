import { Injectable, Logger } from '@nestjs/common';

import { NotFoundError } from 'src/common/errors/types/NotFoundError';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateLaudoCrmDto } from '../dto/create-laudo-crm.dto';
import { UpdateLaudoCrmDto } from '../dto/update-laudo-crm.dto';
import { LaudoCrmEntity } from '../entities/laudos-crm.entity';

import { AppLogsService } from 'src/app-logs/app-logs.service';

@Injectable()
export class LaudosCrmRepository {
  private readonly logger = new Logger(LaudosCrmRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly appLogsService: AppLogsService,
  ) {}

  async create(
    createLaudoCrmDto: CreateLaudoCrmDto,
    files: Express.Multer.File[],
    userId: string,
    ip: string,
  ): Promise<LaudoCrmEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const formPtpExists = await this.prisma.formPtp.findUnique({
        where: { id: createLaudoCrmDto.form_ptp_id },
      });

      if (!formPtpExists) {
        throw new NotFoundError('PTP não encontrado');
      }

      const laudoCrm = await this.prisma.laudoCrm.create({
        data: { ...(createLaudoCrmDto as any) },
      });

      await this.appLogsService.createLog({
        name: user.name,
        user_id: userId,
        local: 'LaudoCrm',
        action: 'Criou',
        description: `Criou um Laudo CRM para a Nota Fiscal "${laudoCrm.notaFiscal}"`,
        ip,
        id_entity: laudoCrm.id,
      });

      return laudoCrm as any;
    } catch (error) {
      this.logger.error(error, 'Create Laudo Crm Error');
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

      const laudosCrm = await this.prisma.laudoCrm.findMany({
        where: {
          OR: [
            {
              documentoTransporte: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              transportador: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              placa: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              notaFiscal: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              conferente: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              origem: {
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

      const laudosCrmCount = laudosCrm.length;

      const data = {
        laudosCrm,
        laudosCrmCount,
      };

      return data;
    } catch (error) {
      this.logger.error(error, 'FindAll Laudo Crm Error');
      throw error;
    }
  }

  async findById(id: string, userId: string): Promise<LaudoCrmEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const laudoCrm = await this.prisma.laudoCrm.findUnique({
        where: {
          id,
        },
      });

      if (!laudoCrm) {
        throw new NotFoundError('Laudo CRM não encontrado.');
      }

      return laudoCrm as any;
    } catch (error) {
      this.logger.error(error, 'FindById Laudo Crm Error');
      throw error;
    }
  }

  async findAllByFormPtpId(
    id: string,
    search: string,
    page: string,
    size: string,
    userId: string,
  ) {
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

      const laudosCrm = await this.prisma.laudoCrm.findMany({
        where: {
          form_ptp_id: id,
          OR: [
            {
              documentoTransporte: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              transportador: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              placa: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              notaFiscal: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              conferente: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              origem: {
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

      const laudosCrmCount = laudosCrm.length;

      const data = {
        laudosCrm,
        laudosCrmCount,
      };

      return data;
    } catch (error) {
      this.logger.error(error, 'FindAll Laudo Crm Error');
      throw error;
    }
  }

  async update(
    id: string,
    updateLaudoCrmDto: UpdateLaudoCrmDto,
    userId: string,
    ip: string,
  ): Promise<LaudoCrmEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const laudoCrmFounded = await this.prisma.laudoCrm.findUnique({
        where: { id },
      });

      if (!laudoCrmFounded) {
        throw new NotFoundError('Laudo Crm não encontrado.');
      }

      const formPtpExists = await this.prisma.formPtp.findUnique({
        where: { id: updateLaudoCrmDto.form_ptp_id },
      });

      if (!formPtpExists) {
        throw new NotFoundError('PTP não encontrado');
      }

      const laudoCrm = await this.prisma.laudoCrm.update({
        where: {
          id,
        },
        data: { ...(updateLaudoCrmDto as any) },
      });

      await this.appLogsService.createLog({
        name: user.name,
        user_id: userId,
        local: 'LaudoCrm',
        action: 'Alterou',
        description: `Alterou o Laudo CRM de ID "${laudoCrm?.id}"`,
        ip,
        id_entity: laudoCrm?.id,
      });

      return laudoCrm as any;
    } catch (error) {
      this.logger.error(error, 'Update Laudo Crm Error');
      throw error;
    }
  }

  async remove(
    id: string,
    userId: string,
    ip: string,
  ): Promise<LaudoCrmEntity> {
    try {
      const laudoCrmFounded = await this.prisma.laudoCrm.findUnique({
        where: { id },
      });

      if (!laudoCrmFounded) {
        throw new NotFoundError('Laudo Crm não encontrado.');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const laudoCrm = await this.prisma.laudoCrm.update({
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
        local: 'LaudoCrm',
        action: 'Deletou',
        description: `Removeu o Laudo CRM de ID "${laudoCrm?.id}"`,
        ip,
        id_entity: laudoCrm?.id,
      });

      return laudoCrm as any;
    } catch (error) {
      this.logger.error(error, 'Remove Laudo Crm Error');
      throw error;
    }
  }

  async delete(
    id: string,
    userId: string,
    ip: string,
  ): Promise<LaudoCrmEntity> {
    try {
      const laudoCrmFounded = await this.prisma.laudoCrm.findUnique({
        where: { id },
      });

      if (!laudoCrmFounded) {
        throw new NotFoundError('Laudo Crm não encontrado.');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const laudoCrm = await this.prisma.laudoCrm.delete({
        where: {
          id,
        },
      });

      await this.appLogsService.createLog({
        name: user.name,
        user_id: userId,
        local: 'LaudoCrm',
        action: 'Deletou',
        description: `Excluiu o Laudo CRM de ID "${laudoCrm?.id}"`,
        ip,
        id_entity: laudoCrm?.id,
      });

      return laudoCrm as any;
    } catch (error) {
      this.logger.error(error, 'Delete Laudo Crm Error');
      throw error;
    }
  }
}
