import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidV4 } from 'uuid';
import { resolve } from 'node:path';
import * as dayjs from 'dayjs';

import { AuthSignInDto } from '../dto/auth-sign-in.dto';
import { AuthSignUpDto } from '../dto/auth-sign-up.dto';
import { UserToken } from '../models/UserToken';

import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { hashData } from '../../utils/create-hash-data';
import { UnauthorizedError } from '../../common/errors/types/UnauthorizedError';
import { AuthForgotPasswordDto } from '../dto/auth-forgot-password.dto';
import { AuthChangePasswordDto } from '../dto/auth-change-password.dto';
import { ResetService } from '../../reset/reset.service';
import { EmailsService } from '../../email/email.service';
import { NotFoundError } from '../../common/errors/types/NotFoundError';
import { AuthUpdatePasswordDto } from '../dto/auth-update-password.dto';
import { AuthCodeDto } from '../dto/auth-code.dto';
import { UserSingUp } from '../models/UserSingUp';
import { ConflictError } from '../../common/errors/types/ConflictError';

dayjs().format();

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly config: ConfigService,
    private readonly resetService: ResetService,
    private readonly emailService: EmailsService,
  ) {}

  async getTokens(userId: string, email: string): Promise<UserToken> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            sub: userId,
            email: email,
          },
          {
            secret: this.config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: '14h',
          },
        ),
        this.jwtService.signAsync(
          {
            sub: userId,
            email: email,
          },
          {
            secret: this.config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: '6d',
          },
        ),
      ]);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      this.logger.error(error, 'GetTokens Error');
      throw new Error('Ocorreu um erro ao Resgatar os Tokens');
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    try {
      const hash = await hashData(refreshToken);

      return await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hashedRefreshToken: hash,
        },
      });
    } catch (error) {
      this.logger.error(error, 'UpdateRefreshToken Error');
      throw new Error('Ocorreu um erro ao Alterar o Token');
    }
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }

      throw new UnauthorizedError('Email ou senha estão incorretos.');
    }

    throw new UnauthorizedError('Email ou senha estão incorretos.');
  }

  async signIn(
    createSignInDto: AuthSignInDto,
  ): Promise<boolean | Partial<UserSingUp>> {
    try {
      await this.validateUser(createSignInDto.email, createSignInDto.password);

      return await this.fastLogin(createSignInDto);
    } catch (error) {
      this.logger.error(error, 'Erro no sign-in');
      throw error;
    }
  }

  async signUp(
    createSignUpDto: AuthSignUpDto,
    userId: string,
  ): Promise<UserEntity> {
    console.log({ createSignUpDto });
    // const ownerUser = await this.prisma.user.findUnique({
    //   where: { id: userId },
    // });

    // if (!ownerUser) {
    //   throw new BadRequestException('Usuário não existe');
    // }

    const userExists = await this.prisma.user.findUnique({
      where: { email: createSignUpDto.email },
    });

    if (userExists) {
      throw new BadRequestException('Usuário já existe');
    }

    const passwordEnv = this.config.get<string>('PASSWORD_SECRET');

    const hash = await hashData(passwordEnv);

    const data: Prisma.UserCreateInput = {
      ...createSignUpDto,
      status: 'US3',
      password: hash,
    };

    const newUser = await this.prisma.user.create({ data });

    const token = uuidV4();

    const today = new Date();
    const expires_date = dayjs(today).add(1, 'month').toDate();

    const resetCreated = await this.resetService.create({
      user_id: newUser.id,
      refresh_token: token,
      expires_date,
    });

    if (resetCreated) {
      const clientAppUrl = this.config.get<string>('CLIENT_APP_URL');

      const confirmLink = `${clientAppUrl}/recover-password/${newUser.email}/${token}`;

      console.log({ clientAppUrl });

      console.log({ confirmLink });

      // const templatePath = resolve(
      //   __dirname,
      //   '..',
      //   '..',
      //   'email',
      //   'template',
      //   'cadastro.hbs',
      // );

      // // const logo = createSignUpDto.companies[0].logo_url

      // const variables = {
      //   name: newUser.name,
      //   link: confirmLink,
      //   email: newUser.email,
      //   adminName: '',
      //   companyName: 'Indachiller',
      //   ownerName: ownerUser.name,
      //   // logo,
      // };

      // await this.emailService.sendMail({
      //   to: newUser.email,
      //   subject: `${ownerUser.name} adicionou você no Portal Indachiller`,
      //   path: templatePath,
      //   variables,
      //   test: '',
      // });
    }

    delete newUser.password;

    return newUser;
  }

  async signOut(id: string): Promise<boolean> {
    try {
      await this.prisma.user.updateMany({
        where: {
          id,
          hashedRefreshToken: { not: null },
        },
        data: {
          hashedRefreshToken: null,
        },
      });

      return true;
    } catch (error) {
      this.logger.error(error, 'Sign-out Error');
      throw new Error('Ocorreu um erro ao Deslogar');
    }
  }

  async forgotPassword(
    forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<boolean> {
    try {
      const email = forgotPasswordDto.email;
      const user = await this.userService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedError('Acesso Negado');
      }

      if (user.canceled_at !== null) {
        throw new UnauthorizedError('Acesso Negado');
      }

      const token = uuidV4();

      const today = new Date();
      const expires_date = dayjs(today).add(1, 'month').toDate();

      await this.resetService.create({
        user_id: user.id,
        refresh_token: token,
        expires_date,
      });

      await this.prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          hashedRefreshToken: null,
        },
      });

      const clientAppUrl = this.config.get<string>('CLIENT_APP_URL');

      const confirmLink = `${clientAppUrl}/recover-password/${email}/${token}`;

      const templatePath = resolve(
        __dirname,
        '..',
        '..',
        'email',
        'template',
        'esqueceu.hbs',
      );

      const variables = {
        name: user.name,
        link: confirmLink,
      };

      // console.log({ clientAppUrl });

      console.log({ confirmLink });

      return await this.emailService.sendMail({
        to: email,
        subject: 'Indachiller: Recuperação de senha',
        path: templatePath,
        variables,
        test: '',
      });
    } catch (error) {
      this.logger.error(error, 'ForgotPassword Error');
      throw new Error('Ocorreu um erro ao tentar trocar a senha');
    }
  }

  async changePassword(
    changePasswordUserDto: AuthChangePasswordDto,
    refreshToken: string,
  ): Promise<any> {
    try {
      const userByToken = await this.resetService.findByRefreshToken(
        refreshToken,
      );

      const isNow = new Date();

      const tokenExpired = dayjs(userByToken.expires_date).isBefore(isNow);

      if (tokenExpired) {
        throw new UnauthorizedError(
          'Tempo expirado. Contacte o administrador da conta.',
        );
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userByToken.user_id },
      });

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const hash = await hashData(changePasswordUserDto.password);

      const data: UserEntity = {
        ...user,
        password: hash,
        status: 'US1',
      };

      const userUpdated = await this.userService.update(user.id, data as any);

      const userFormatted = {
        ...userUpdated,
        password: undefined,
      };

      const tokens = await this.getTokens(userUpdated.id, userUpdated.email);

      await this.updateRefreshToken(userUpdated.id, tokens.refresh_token);

      await this.prisma.resetPassword.deleteMany({
        where: {
          user_id: user?.id,
        },
      });

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user: userFormatted,
      };
    } catch (error) {
      this.logger.error(error, 'ChangePassword Error');
      throw error;
    }
  }

  async updatePassword(
    updatePasswordUserDto: AuthUpdatePasswordDto,
  ): Promise<any> {
    try {
      const user = await this.validateUser(
        updatePasswordUserDto.email,
        updatePasswordUserDto.old_password,
      );

      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      const hash = await hashData(updatePasswordUserDto.password);

      const data: UserEntity = {
        ...user,
        password: hash,
      };

      const userUpdated = await this.userService.update(user.id, data as any);

      const userFormatted = {
        ...userUpdated,
        password: undefined,
      };

      const tokens = await this.getTokens(userUpdated.id, userUpdated.email);

      await this.updateRefreshToken(userUpdated.id, tokens.refresh_token);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user: userFormatted,
      };
    } catch (error) {
      this.logger.error(error, 'UpdatePassword Error');
      throw error;
    }
  }

  async refresh(userId: string, refreshToken: string): Promise<UserToken> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.password) throw new UnauthorizedError('Acesso Negado');

    const rtMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!rtMatches) throw new UnauthorizedError('Acesso Negado');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async refreshBiometric(
    userEmail: string,
    refreshToken: string,
  ): Promise<{ tokens: UserToken }> {
    try {
      const user = await this.userService.findByEmail(userEmail);

      if (!user || !user.password) throw new UnauthorizedError('Acesso Negado');

      const rtMatches = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (!rtMatches) throw new UnauthorizedError('Acesso Negado');

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return { tokens };
    } catch (error) {
      this.logger.error(error, 'Refresh Error');
      throw error;
    }
  }

  async signInWithCode(authCodeDto: AuthCodeDto, email: string) {
    const code = await this.prisma.codes.findFirst({
      where: {
        code: authCodeDto.code,
        created_at: {
          gte: new Date(new Date().valueOf() - 10 * 60 * 1000),
        },
      },
    });

    if (!code) {
      throw new UnauthorizedError('Código inválido ou expirado.');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: code.user_id,
      },
    });

    if (user.email !== email) {
      throw new NotFoundError(
        'O email cadastrado não coincide com o email enviado',
      );
    }

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    await this.prisma.codes.delete({
      where: {
        code: authCodeDto.code,
      },
    });

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user,
    };
  }

  async resendCode(code: string, email: string): Promise<void> {
    const foundedCode = await this.prisma.codes.findFirst({
      where: {
        code,
        created_at: {
          gte: new Date(new Date().valueOf() - 10 * 60 * 1000),
        },
      },
    });

    if (!foundedCode) {
      throw new UnauthorizedError('Código inválido ou expirado.');
    }

    const userFounded = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!userFounded) {
      throw new NotFoundError('Usuário não encontrado');
    }

    if (userFounded.email === email) {
      const randomNumber = Math.floor(Math.random() * 1000000);
      const code = randomNumber.toString().padStart(6, '0');

      const codeToUser = await this.prisma.codes.create({
        data: {
          user_id: userFounded.id,
          email: userFounded.email,
          code: code,
        },
      });

      const templatePath = resolve(
        __dirname,
        '..',
        '..',
        'email',
        'template',
        'codigo-2fa.hbs',
      );

      const variables = {
        name: userFounded.name,
        email: userFounded.email,
        code: codeToUser.code,
      };

      await this.emailService.sendMail({
        to: userFounded.email,
        subject: 'Autenticação Dois Fatores',
        path: templatePath,
        variables,
        test: '',
      });
    } else {
      throw new NotFoundError(
        'O email cadastrado não coincide com o email enviado',
      );
    }
  }

  async resendInviteToUser(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    if (user?.status === 'US1') {
      throw new ConflictError('Usuário já ativo no sistema.');
    }

    const token = uuidV4();
    const today = new Date();
    const expires_date = dayjs(today).add(1, 'month').toDate();

    const resetCreated = await this.resetService.create({
      user_id: user.id,
      refresh_token: token,
      expires_date,
    });

    if (resetCreated) {
      const clientAppUrl = this.config.get<string>('CLIENT_APP_URL');

      const confirmLink = `${clientAppUrl}/recover-password/${user.email}/${token}`;

      // console.log({ clientAppUrl });

      console.log({ confirmLink });

      const templatePath = resolve(
        __dirname,
        '..',
        '..',
        'email',
        'template',
        'cadastro.hbs',
      );

      const variables = {
        name: user.name,
        link: confirmLink,
        email: user.email,
        adminName: '',
        companyName: 'Indachiller',
      };

      await this.emailService.sendMail({
        to: user.email,
        subject: 'Cadastro de Usuário',
        path: templatePath,
        variables,
        test: '',
      });
    }
  }

  async fastLogin(createSignInDto: AuthSignInDto): Promise<UserSingUp> {
    try {
      const user = await this.validateUser(
        createSignInDto.email,
        createSignInDto.password,
      );

      const tokens = await this.getTokens(user.id, user.email);

      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user,
      };
    } catch (error) {
      this.logger.error(error, 'Erro no fast login');
      throw error;
    }
  }

  async getInviteByUserId(id: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    const codes = await this.prisma.resetPassword.findMany({
      where: {
        user_id: id,
      },
    });

    const amountCodes = codes.length;
    const lastCode = codes[amountCodes - 1];

    if (amountCodes === 0) {
      throw new NotFoundError('Código não encontrado.');
    }

    const clientAppUrl = this.config.get<string>('CLIENT_APP_URL');
    const today = new Date();

    const isExpired = dayjs(lastCode.expires_date).isBefore(today);

    if (isExpired) {
      const token = uuidV4();
      const expires_date = dayjs(today).add(1, 'month').toDate();

      await this.prisma.resetPassword.deleteMany({
        where: {
          user_id: id,
        },
      });

      await this.resetService.create({
        user_id: user.id,
        refresh_token: token,
        expires_date,
      });

      const confirmLink = `${clientAppUrl}/recover-password/${user.email}/${token}`;

      return confirmLink;
    } else {
      const confirmLink = `${clientAppUrl}/recover-password/${user.email}/${lastCode.refresh_token}`;

      return confirmLink;
    }
  }
}
