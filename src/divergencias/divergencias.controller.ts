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

import { DivergenciasService } from './divergencias.service';
import { CreateDivergenciaDto } from './dto/create-divergencia.dto';
import { UpdateDivergenciaDto } from './dto/update-divergencia.dto';
import { HttpHelper } from 'src/app-logs/helpers/http.helper';

@Controller('divergencias')
export class DivergenciasController {
  constructor(private readonly divergenciasService: DivergenciasService) {}

  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  async create(
    @Body() createDivergenciaDto: CreateDivergenciaDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.divergenciasService.create(
      createDivergenciaDto,
      files,
      userId,
      ip,
    );
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: string,
    @Query('size') size: string,
    @Headers('userId') userId: string,
  ) {
    return this.divergenciasService.findAll(
      search,
      page ? page : '0',
      size ? size : '10',
      userId,
    );
  }

  @Get(':id')
  findById(@Param('id') id: string, @Headers('userId') userId: string) {
    return this.divergenciasService.findById(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDivergenciaDto: UpdateDivergenciaDto,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.divergenciasService.update(
      id,
      updateDivergenciaDto,
      userId,
      ip,
    );
  }

  @Patch(':id/remove')
  remove(
    @Param('id') id: string,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.divergenciasService.remove(id, userId, ip);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.divergenciasService.delete(id, userId, ip);
  }
}
