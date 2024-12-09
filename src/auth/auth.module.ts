import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EmailModule } from '../email/email.module';

import { PrismaModule } from '../prisma/prisma.module';

import { ResetModule } from '../reset/reset.module';

import { UsersRepository } from '../users/repositories/users.repository';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { AuthRepository } from './repositories/auth.repository';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AppLogsModule } from 'src/app-logs/app-logs.module';

@Module({
  imports: [
    UsersModule,
    ResetModule,
    PassportModule,
    ConfigModule,
    EmailModule,
    MailerModule,
    PrismaModule,
    JwtModule.register({}),
    AppLogsModule,
  ],
  controllers: [AuthController],
  providers: [
    UsersRepository,
    UsersService,
    AuthService,
    AuthRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
