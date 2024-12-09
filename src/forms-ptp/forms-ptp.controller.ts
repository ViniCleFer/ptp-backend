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
} from '@nestjs/common';
import { FormsPtpService } from './forms-ptp.service';
import { CreateFormPtpDto } from './dto/create-forms-ptp.dto';
import { UpdateFormPtpDto } from './dto/update-forms-ptp.dto';
import { HttpHelper } from 'src/app-logs/helpers/http.helper';

@Controller('forms-ptp')
export class FormsPtpController {
  constructor(private readonly formsPtpService: FormsPtpService) {}

  @Post()
  async create(
    @Body() createFormPtpDto: CreateFormPtpDto,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.formsPtpService.create(createFormPtpDto, userId, ip);
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: string,
    @Query('size') size: string,
    @Headers('userId') userId: string,
  ) {
    return this.formsPtpService.findAll(
      search,
      page ? page : '0',
      size ? size : '10',
      userId,
    );
  }

  @Get(':id')
  findById(@Param('id') id: string, @Headers('userId') userId: string) {
    return this.formsPtpService.findById(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFormPtpDto: UpdateFormPtpDto,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.formsPtpService.update(id, updateFormPtpDto, userId, ip);
  }

  // @Patch(':id/status')
  // changeStatus(
  //   @Param('id') id: string,
  //   @Body() updateFormPtpDto: UpdateFormPtpDto,
  //   @Headers('userId') userId: string,
  //   @Request() req,
  // ) {
  //   const httpHelper = new HttpHelper();
  //   const ip = httpHelper.getIP(req);
  //   return this.formsPtpService.changeStatus(
  //     id,
  //     updateFormPtpDto,
  //     userId,
  //     ip,
  //   );
  // }

  @Patch(':id/remove')
  remove(
    @Param('id') id: string,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.formsPtpService.remove(id, userId, ip);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('userId') userId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.formsPtpService.delete(id, userId, ip);
  }
}
