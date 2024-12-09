import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

import { TextHealthIndicator } from './health.text';
import { PrismaService } from '../prisma/prisma.service';

import { Public } from 'src/common/decorators/public.decorator';

@SkipThrottle()
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private text: TextHealthIndicator,
    private prisma: PrismaHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    const infraEnv = this.configService.get<string>('ENV');
    this.logger.log('Health check');

    const healthCheckName = this.configService.get<string>('HEALTH_CHECK_NAME');

    return this.healthCheckService.check([
      () =>
        this.text.writeInfo('config', { env: infraEnv, app: healthCheckName }),
      () => this.prisma.pingCheck('database', this.prismaService),
      () =>
        this.microservice.pingCheck('queue', {
          transport: Transport.REDIS,
          options: {
            host: this.configService.get<string>('REDIS_HOST'),
            port: this.configService.get<number>('REDIS_PORT'),
            password: this.configService.get<string>('REDIS_PASSWORD'),
          },
        }),
    ]);
  }
}
