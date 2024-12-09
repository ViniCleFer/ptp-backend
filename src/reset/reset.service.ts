import { Injectable } from '@nestjs/common';
import { CreateResetDto } from './dto/create-reset.dto';
import { UpdateResetDto } from './dto/update-reset.dto';
import { ResetPasswordEntity } from './entities/reset.entity';
import { ResetRepository } from './repositories/reset.repositories';

@Injectable()
export class ResetService {
  constructor(private readonly repository: ResetRepository) {}

  create(createResetDto: CreateResetDto) {
    return this.repository.create(createResetDto);
  }

  findAll(): Promise<ResetPasswordEntity[]> {
    return this.repository.findAll();
  }

  findById(id: string): Promise<ResetPasswordEntity> {
    return this.repository.findById(id);
  }

  findByRefreshToken(refreshToken: string): Promise<ResetPasswordEntity> {
    return this.repository.findByRefreshToken(refreshToken);
  }

  update(
    id: string,
    updateResetDto: UpdateResetDto,
  ): Promise<ResetPasswordEntity> {
    return this.repository.update(id, updateResetDto);
  }

  remove(id: string) {
    return this.repository.remove(id);
  }
}
