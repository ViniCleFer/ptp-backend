import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.repository.create(createUserDto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id: string) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      console.error('findByEmail => Usuário não encontrado.');
      return null;
      // throw new NotFoundError('Usuário não encontrado.');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    return this.repository.update(id, updateUserDto);
  }

  async disableUser(
    id: string,
    companyId: string,
    adminId: string,
    ip: string,
  ) {
    return this.repository.disableUser(id, companyId, adminId, ip);
  }

  async remove(id: string) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    return this.repository.remove(id);
  }

  async delete(id: string) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    return this.repository.delete(id);
  }
}
