import { Injectable } from '@nestjs/common';
import { CreateAppLogDto } from './dto/create-app-log.dto';
import { AppLogsRepository } from './repositories/app-logs.repository';

@Injectable()
export class AppLogsService {
  constructor(private readonly repository: AppLogsRepository) {}

  create(createAppLogDto: CreateAppLogDto, ip) {
    return this.repository.create(createAppLogDto, ip);
  }

  createLog(createAppLogDto: CreateAppLogDto) {
    return this.repository.createLog(createAppLogDto);
  }

  findAll(
    userId: string,
    search: string,
    name: string,
    action: string,
    date: string,
    local: string,
    page: string,
    size: string,
  ) {
    return this.repository.findAll(
      userId,
      search,
      name,
      action,
      date,
      local,
      page,
      size,
    );
  }
}
