import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResetDto } from '../dto/create-reset.dto';
import { UpdateResetDto } from '../dto/update-reset.dto';

import { ResetPasswordEntity } from '../entities/reset.entity';

@Injectable()
export class ResetRepository {
  private logger = new Logger(ResetRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createResetDto: CreateResetDto): Promise<boolean> {
    try {
      const reset = await this.prisma.resetPassword.create({
        data: createResetDto,
      });

      if (reset) {
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(error, 'Create Reset Error');
      return false;
    }
  }

  async findAll(): Promise<ResetPasswordEntity[]> {
    return await this.prisma.resetPassword.findMany();
  }

  async findById(id: string): Promise<ResetPasswordEntity> {
    return await this.prisma.resetPassword.findUnique({
      where: {
        id,
      },
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<ResetPasswordEntity> {
    const refreshTokenFounded = await this.prisma.resetPassword.findUnique({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!refreshTokenFounded) {
      return null;
    }

    return refreshTokenFounded;
  }

  async update(
    id: string,
    updateResetDto: UpdateResetDto,
  ): Promise<ResetPasswordEntity> {
    return await this.prisma.resetPassword.update({
      where: {
        id,
      },
      data: updateResetDto,
    });
  }

  async remove(id: string): Promise<ResetPasswordEntity> {
    return await this.prisma.resetPassword.delete({
      where: {
        id,
      },
    });
  }
}
