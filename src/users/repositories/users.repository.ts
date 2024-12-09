import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, UserStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { hashData } from '../../utils/create-hash-data';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { AppLogsService } from 'src/app-logs/app-logs.service';

@Injectable()
export class UsersRepository {
  private logger = new Logger(UsersRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly appLogsService: AppLogsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
    try {
      const ownerUser = await this.prisma.user.findUnique({
        where: { id: createUserDto.userId },
      });

      if (!ownerUser) {
        throw new BadRequestException('Usuário não existe');
      }

      const userExists = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (userExists) {
        throw new BadRequestException('Usuário já existe');
      }

      const passwordEnv = this.config.get<string>('PASSWORD_SECRET');
      const hash = await hashData(passwordEnv);

      const data: Prisma.UserCreateInput = {
        ...createUserDto,
        password: hash,
      };

      const user = await this.prisma.user.create({ data });

      delete user.password;

      return user;
    } catch (error) {
      this.logger.error(error, 'Create User Error');
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Ocorreu um erro ao Cadastrar o usuário',
      );
    }
  }

  async findAll(): Promise<Partial<UserEntity>[]> {
    const users = await this.prisma.user.findMany({
      where: {
        canceled_at: null,
      },
    });

    const usersFiltered = users.map(u => {
      const userObj = { ...u };

      delete userObj.password;

      return userObj;
    });

    return usersFiltered;
  }

  async findById(id: string): Promise<Partial<UserEntity>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const userFounded = {
      ...user,
      password: undefined,
    };

    return userFounded;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<UserEntity>> {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: { ...updateUserDto },
    });

    const editUser = {
      ...user,
      password: undefined,
    };

    return editUser;
  }

  async disableUser(
    id: string,
    companyId: string,
    adminId: string,
    ip: string,
  ) {
    const adminUser = await this.prisma.user.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!adminUser) {
      throw new BadRequestException('Administrador não existe');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new BadRequestException('Usuário não existe');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.US2,
      },
    });

    await this.appLogsService.createLog({
      name: adminUser.name,
      user_id: adminUser.id,
      local: 'Usuários',
      action: 'Deletou',
      description: `Desativou o usuário ${user.name}`,
      ip,
    });
  }

  async remove(id: string): Promise<Partial<UserEntity>> {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        canceled_at: new Date(),
      },
    });

    const editUser = {
      ...user,
      password: undefined,
    };

    return editUser;
  }

  async delete(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
