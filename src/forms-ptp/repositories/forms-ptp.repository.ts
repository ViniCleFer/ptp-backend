import { Injectable, Logger } from '@nestjs/common';

import { NotFoundError } from 'src/common/errors/types/NotFoundError';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateFormPtpDto } from '../dto/create-forms-ptp.dto';
import { UpdateFormPtpDto } from '../dto/update-forms-ptp.dto';
import { FormPtpEntity } from '../entities/forms-ptp.entity';

import { AppLogsService } from 'src/app-logs/app-logs.service';

@Injectable()
export class FormsPtpRepository {
  private readonly logger = new Logger(FormsPtpRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly appLogsService: AppLogsService,
  ) {}

  async create(
    createFormPtpDto: CreateFormPtpDto,
    userId: string,
    ip: string,
  ): Promise<FormPtpEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      // const formPtpExists = await this.prisma.formPtp.findUnique({
      //   where: { slug: createFormPtpDto.slug },
      // });

      // if (formPtpExists) {
      //   throw new NotFoundError('formPtpo já cadastrado');
      // }

      const formPtp = await this.prisma.formPtp.create({
        data: { ...createFormPtpDto },
      });

      await this.appLogsService.createLog({
        name: user.name,
        user_id: userId,
        local: 'PTP',
        action: 'Criou',
        description: `Criou um PTP para a Nota Fiscal "${formPtp.notaFiscal}"`,
        ip,
        id_entity: formPtp.id,
      });

      return formPtp;
    } catch (error) {
      this.logger.error(error, 'Create Form Ptp Error');
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

      const formsPtp = await this.prisma.formPtp.findMany({
        where: {
          OR: [
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
              opcaoUp: {
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

      const formsPtpCount = formsPtp.length;

      const data = {
        formsPtp,
        formsPtpCount,
      };

      return data;
    } catch (error) {
      this.logger.error(error, 'FindAll formPtp Error');
      throw error;
    }
  }

  async findById(id: string, userId: string): Promise<FormPtpEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const formPtp = await this.prisma.formPtp.findUnique({
        where: {
          id,
        },
      });

      if (!formPtp) {
        throw new NotFoundError('PTP não encontrado.');
      }

      return formPtp;
    } catch (error) {
      this.logger.error(error, 'FindById formPtp Error');
      throw error;
    }
  }

  async update(
    id: string,
    updateFormPtpDto: UpdateFormPtpDto,
    userId: string,
    ip: string,
  ): Promise<FormPtpEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const formPtpFounded = await this.prisma.formPtp.findUnique({
        where: { id },
      });

      if (!formPtpFounded) {
        throw new NotFoundError('PTP não encontrado.');
      }

      // const formPtpExists = await this.prisma.formPtp.findUnique({
      //   where: { slug: updateFormPtpDto.slug },
      // });

      // if (formPtpExists.id !== formPtpFounded.id) {
      //   throw new NotFoundError('formPtpo já cadastrado');
      // }

      const formPtp = await this.prisma.formPtp.update({
        where: {
          id,
        },
        data: { ...updateFormPtpDto },
      });

      await this.appLogsService.createLog({
        name: user.name,
        user_id: userId,
        local: 'PTP',
        action: 'Alterou',
        description: `Alterou o PTP de ID "${formPtp.id}"`,
        ip,
        id_entity: formPtp.id,
      });

      return formPtp;
    } catch (error) {
      this.logger.error(error, 'Update formPtp Error');
      throw error;
    }
  }

  async remove(id: string, userId: string, ip: string): Promise<FormPtpEntity> {
    try {
      const formPtpFounded = await this.prisma.formPtp.findUnique({
        where: { id },
      });

      if (!formPtpFounded) {
        throw new NotFoundError('PTP não encontrado.');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const formPtp = await this.prisma.formPtp.update({
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
        local: 'PTP',
        action: 'Deletou',
        description: `Removeu o PTP de ID "${formPtp.id}"`,
        ip,
        id_entity: formPtp.id,
      });

      return formPtp;
    } catch (error) {
      this.logger.error(error, 'Remove FormPtp Error');
      throw error;
    }
  }

  async delete(id: string, userId: string, ip: string): Promise<FormPtpEntity> {
    try {
      const formPtpFounded = await this.prisma.formPtp.findUnique({
        where: { id },
      });

      if (!formPtpFounded) {
        throw new NotFoundError('PTP não encontrado.');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const formPtp = await this.prisma.formPtp.delete({
        where: {
          id,
        },
      });

      await this.appLogsService.createLog({
        name: user.name,
        user_id: userId,
        local: 'PTP',
        action: 'Deletou',
        description: `Excluiu o PTP de ID "${formPtp.id}"`,
        ip,
        id_entity: formPtp.id,
      });

      return formPtp;
    } catch (error) {
      this.logger.error(error, 'Delete FormPtp Error');
      throw error;
    }
  }
}
