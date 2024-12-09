import { Injectable } from '@nestjs/common';

import { CreateLaudoCrmDto } from './dto/create-laudo-crm.dto';
import { UpdateLaudoCrmDto } from './dto/update-laudo-crm.dto';
import { LaudosCrmRepository } from './repositories/laudos-crm.repository';

@Injectable()
export class LaudosCrmService {
  constructor(private readonly repository: LaudosCrmRepository) {}
  async create(
    createLaudoCrmDto: CreateLaudoCrmDto,
    files: Express.Multer.File[],
    userId: string,
    ip: string,
  ) {
    return this.repository.create(createLaudoCrmDto, files, userId, ip);
  }

  async findAll(search: string, page: string, size: string, userId: string) {
    return await this.repository.findAll(search, page, size, userId);
  }

  async findById(id: string, userId: string) {
    return await this.repository.findById(id, userId);
  }

  async findAllByFormPtpId(
    id: string,
    search: string,
    page: string,
    size: string,
    userId: string,
  ) {
    return await this.repository.findAllByFormPtpId(
      id,
      search,
      page,
      size,
      userId,
    );
  }

  async update(
    id: string,
    updateLaudoCrmDto: UpdateLaudoCrmDto,
    userId: string,
    ip: string,
  ) {
    return await this.repository.update(id, updateLaudoCrmDto, userId, ip);
  }

  async remove(id: string, userId: string, ip: string) {
    return await this.repository.remove(id, userId, ip);
  }

  async delete(id: string, userId: string, ip: string) {
    return await this.repository.delete(id, userId, ip);
  }
}
