import { Injectable } from '@nestjs/common';

import { CreateDivergenciaDto } from './dto/create-divergencia.dto';
import { UpdateDivergenciaDto } from './dto/update-divergencia.dto';
import { DivergenciasRepository } from './repositories/divergencias.repository';

@Injectable()
export class DivergenciasService {
  constructor(private readonly repository: DivergenciasRepository) {}
  async create(
    createDivergenciaDto: CreateDivergenciaDto,
    files: Express.Multer.File[],
    userId: string,
    ip: string,
  ) {
    return this.repository.create(createDivergenciaDto, files, userId, ip);
  }

  async findAll(search: string, page: string, size: string, userId: string) {
    return await this.repository.findAll(search, page, size, userId);
  }

  async findById(id: string, userId: string) {
    return await this.repository.findById(id, userId);
  }

  async update(
    id: string,
    updateDivergenciaDto: UpdateDivergenciaDto,
    userId: string,
    ip: string,
  ) {
    return await this.repository.update(id, updateDivergenciaDto, userId, ip);
  }

  async remove(id: string, userId: string, ip: string) {
    return await this.repository.remove(id, userId, ip);
  }

  async delete(id: string, userId: string, ip: string) {
    return await this.repository.delete(id, userId, ip);
  }
}
