import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Next,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBearerAuth, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { SignedPutObject } from './files.interface';
import { NextFunction, Response, Request as ExpressRequest } from 'express';
import { PutObjectDto } from './dto/put-object.dto';
import { PrivateFileGuard } from './guards/private-file.guard';
import { FilesHelper } from './files.helper';
import { UpdateObjectMetadataDto } from './dto/update-object-metadata.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { CreateFileDto } from './dto/create-file.dto';
import { FileEntity } from './entities/file.entity';
import {
  Headers,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadPublicFileAppDto } from './dto/upload-public-file-app.dto';
import { HttpHelper } from 'src/app-logs/helpers/http.helper';

@ApiBearerAuth()
@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Headers('userId') userId: string,
    @Headers('folder') folder: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.filesService.upload(file, userId, folder, ip);
  }

  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFileDto: UpdateFileDto,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.filesService.update(id, updateFileDto, userId, ip);
  }

  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Patch('remove/:id')
  remove(
    @Param('id') id: string,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.filesService.remove(id, userId, ip);
  }
}
