import { Module } from '@nestjs/common';
import { join } from 'node:path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { TerminusModule } from '@nestjs/terminus';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './auth/guards/access-token.guard';
import { ResetModule } from './reset/reset.module';
import { EmailModule } from './email/email.module';
import { FilesModule } from './files/files.module';
import { AppLogsModule } from './app-logs/app-logs.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { FormsPtpModule } from './forms-ptp/forms-ptp.module';
import { LaudosCrmModule } from './laudos-crm/laudos-crm.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // BullModule.forRootAsync({
    //   inject: [ConfigService],
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     redis: {
    //       host: configService.get<string>('REDIS_HOST'),
    //       port: configService.get<number>('REDIS_PORT'),
    //       password: configService.get<string>('REDIS_PASSWORD'),
    //     },
    //   }),
    // }),
    UsersModule,
    AuthModule,
    ResetModule,
    EmailModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('SEND_GRID_EMAIL_HOST'),
          auth: {
            user: config.get('SEND_GRID_EMAIL_USER'),
            pass: config.get('SEND_GRID_EMAIL_PASSWORD'),
          },
        },
        preview: false,
        template: {
          dir: join(__dirname, 'email', 'template'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    TerminusModule.forRoot({
      errorLogStyle: 'json',
    }),
    // CompaniesModule,
    // FilesModule,
    AppLogsModule,
    PrismaModule,
    HealthModule,
    // ProposalsModule,
    // ProductsModule,
    FormsPtpModule,
    LaudosCrmModule,
    // PaymentConditionsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
