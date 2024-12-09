import { Controller, Get, Post, Body } from '@nestjs/common';
import { Headers, Query, Request } from '@nestjs/common/decorators';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { AppLogsService } from './app-logs.service';
import { CreateAppLogDto } from './dto/create-app-log.dto';
import { HttpHelper } from './helpers/http.helper';

@ApiTags('app-logs')
@Controller('app-logs')
export class AppLogsController {
  constructor(private readonly appLogsService: AppLogsService) {}

  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Post()
  create(@Body() createAppLogDto: CreateAppLogDto, @Request() req) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.appLogsService.create(createAppLogDto, ip);
  }

  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Get('all')
  findAll(
    @Query('search') search: string,
    @Query('name') name: string,
    @Query('action') action: string,
    @Query('date') date: string,
    @Query('local') local: string,
    @Query('page') page: string,
    @Query('size') size: string,
    @Headers('userId') userId: string,
  ) {
    return this.appLogsService.findAll(
      userId,
      search,
      name,
      action,
      date,
      local,
      page ? page : '1',
      size ? size : '10',
    );
  }
}
