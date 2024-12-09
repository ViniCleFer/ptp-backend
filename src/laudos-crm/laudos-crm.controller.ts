import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Request,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { LaudosCrmService } from './laudos-crm.service';
import { CreateLaudoCrmDto } from './dto/create-laudo-crm.dto';
import { UpdateLaudoCrmDto } from './dto/update-laudo-crm.dto';
import { HttpHelper } from 'src/app-logs/helpers/http.helper';

@Controller('laudos-crm')
export class LaudosCrmController {
  constructor(private readonly laudosCrmService: LaudosCrmService) {}

  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  async create(
    @Body() createLaudoCrmDto: CreateLaudoCrmDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.laudosCrmService.create(createLaudoCrmDto, files, userId, ip);
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: string,
    @Query('size') size: string,
    @Headers('userId') userId: string,
  ) {
    return this.laudosCrmService.findAll(
      search,
      page ? page : '0',
      size ? size : '10',
      userId,
    );
  }

  @Get(':id')
  findById(@Param('id') id: string, @Headers('userId') userId: string) {
    return this.laudosCrmService.findById(id, userId);
  }

  @Get('ptp/:id')
  findAllByFormPtpId(
    @Param('id') id: string,
    @Query('search') search: string,
    @Query('page') page: string,
    @Query('size') size: string,
    @Headers('userId') userId: string,
  ) {
    return this.laudosCrmService.findAllByFormPtpId(
      id,
      search,
      page ? page : '0',
      size ? size : '10',
      userId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLaudoCrmDto: UpdateLaudoCrmDto,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.laudosCrmService.update(id, updateLaudoCrmDto, userId, ip);
  }

  @Patch(':id/remove')
  remove(
    @Param('id') id: string,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.laudosCrmService.remove(id, userId, ip);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.laudosCrmService.delete(id, userId, ip);
  }
}
