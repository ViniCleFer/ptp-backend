import { Injectable } from '@nestjs/common';

import { CreateFormPtpDto } from './dto/create-forms-ptp.dto';
import { UpdateFormPtpDto } from './dto/update-forms-ptp.dto';
import { FormsPtpRepository } from './repositories/forms-ptp.repository';

@Injectable()
export class FormsPtpService {
  constructor(private readonly repository: FormsPtpRepository) {}
  async create(createFormPtpDto: CreateFormPtpDto, userId: string, ip: string) {
    return this.repository.create(createFormPtpDto, userId, ip);
  }

  async findAll(search: string, page: string, size: string, userId: string) {
    return await this.repository.findAll(search, page, size, userId);
  }

  async findById(id: string, userId: string) {
    return await this.repository.findById(id, userId);
  }

  async update(
    id: string,
    updateFormPtpDto: UpdateFormPtpDto,
    userId: string,
    ip: string,
  ) {
    return await this.repository.update(id, updateFormPtpDto, userId, ip);
  }

  async remove(id: string, userId: string, ip: string) {
    return await this.repository.remove(id, userId, ip);
  }

  async delete(id: string, userId: string, ip: string) {
    return await this.repository.delete(id, userId, ip);
  }
}
