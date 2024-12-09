import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';

import { NotFoundError } from 'src/common/errors/types/NotFoundError';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppLogDto } from '../dto/create-app-log.dto';

import { AppLogEntity, LogData } from '../entities/app-log.entity';
import { formatIp } from 'src/utils/format-ip';
import { AppLogsHelper } from '../helpers/app-logs.helper';

@Injectable()
export class AppLogsRepository {
  private logger = new Logger(AppLogsRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly appLogsHelper: AppLogsHelper,
  ) {}

  async create(
    createAppLogDto: CreateAppLogDto,
    ip: string,
  ): Promise<AppLogEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id: createAppLogDto.user_id },
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    const ipFormat = formatIp(ip);
    const newLog = { ...createAppLogDto, ip: ipFormat };

    const log = await this.prisma.log.create({
      data: { ...(newLog as any) },
    });

    return log;
  }

  async createLog(createAppLogDto: CreateAppLogDto) {
    try {
      const ipFormat = formatIp(createAppLogDto.ip);
      const logData = this.appLogsHelper.getLogData(createAppLogDto);
      const newLog = { ...logData, ip: ipFormat };

      return await this.prisma.log.create({
        data: { ...(newLog as any) },
      });
    } catch (error) {
      this.logger.error(error, 'Erro no create log');
      throw error;
    }
  }

  async findAll(
    userId: string,
    search: string,
    name: string,
    action: string,
    date: string,
    local: string,
    page: string,
    size: string,
  ): Promise<Partial<LogData>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const limit = Number(size);
    const pgNumber = Number(page) + 1;
    const offSet = Number(pgNumber) > 1 ? limit * (pgNumber - 1) : 0;

    let inicioDia;
    let finalDia;

    const selectedDate = date.split(' / ');
    const initialDate = selectedDate[0];
    const finalDate = selectedDate[1];

    if (initialDate) {
      inicioDia = dayjs(initialDate)
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .subtract(3, 'hour')
        .toDate();
      finalDia = dayjs(finalDate)
        .set('hour', 23)
        .set('minute', 59)
        .set('second', 59)
        .subtract(3, 'hour')
        .toDate();
    }

    const logs = await this.prisma.log.findMany({
      where: {
        action: {
          contains: action,
          mode: 'insensitive',
        },
        local: {
          contains: local,
          mode: 'insensitive',
        },
        name: {
          contains: name,
          mode: 'insensitive',
        },
        created_at: {
          gt: inicioDia,
          lt: finalDia,
        },
        AND: [
          {
            OR: [
              {
                description: { contains: search, mode: 'insensitive' },
              },
              {
                name: { contains: search, mode: 'insensitive' },
              },
              {
                old_value: { contains: search, mode: 'insensitive' },
              },
              {
                new_value: { contains: search, mode: 'insensitive' },
              },
              {
                id_entity: { contains: search, mode: 'insensitive' },
              },
            ],
          },
        ],
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offSet,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const logsCount = await this.prisma.log.count({
      where: {
        action: {
          contains: action,
          mode: 'insensitive',
        },
        local: {
          contains: local,
          mode: 'insensitive',
        },
        name: {
          contains: name,
          mode: 'insensitive',
        },
        created_at: {
          gt: inicioDia,
          lt: finalDia,
        },
        AND: [
          {
            OR: [
              {
                description: { contains: search, mode: 'insensitive' },
              },
              {
                name: { contains: search, mode: 'insensitive' },
              },
              {
                old_value: { contains: search, mode: 'insensitive' },
              },
              {
                new_value: { contains: search, mode: 'insensitive' },
              },
            ],
          },
        ],
      },
    });

    const logsMapped = logs.map((log: AppLogEntity) => {
      const logData = {
        id: log.id,
        name: log.name,
        user_id: log.user_id,
        local: log.local,
        action: log.action,
        description: log.description,
        id_entity: log.id_entity,
        new_value:
          log.new_value !== null
            ? this.customJSONParse(log.new_value)
            : log.id_entity,
        old_value:
          log.old_value !== null
            ? this.customJSONParse(log.old_value)
            : log.id_entity,
        ip: log.ip,
        created_at: log.created_at,
        formPtpId: log?.formPtpId !== null ? log?.formPtpId : null,
        formPtpQuestionId:
          log?.formPtpQuestionId !== null ? log?.formPtpQuestionId : null,
        laudoCrmId: log?.laudoCrmId !== null ? log?.laudoCrmId : null,
        divergenciaId: log?.divergenciaId !== null ? log?.divergenciaId : null,
      };

      return logData;
    });

    const data = {
      logs: logsMapped,
      logsCount,
    };

    return data;
  }

  customJSONParse = (jsonString = ''): Record<any, any> => {
    const trimmedJson = String(jsonString).trim();

    if (!trimmedJson.length) {
      return {};
    }

    try {
      return JSON.parse(trimmedJson);
    } catch (e) {
      return {};
    }
  };
}
