import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResetService } from './reset.service';
import { CreateResetDto } from './dto/create-reset.dto';
import { UpdateResetDto } from './dto/update-reset.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reset')
@Controller('reset')
export class ResetController {
  constructor(private readonly resetService: ResetService) {}

  @Post()
  create(@Body() createResetDto: CreateResetDto) {
    return this.resetService.create(createResetDto);
  }

  @Get()
  findAll() {
    return this.resetService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.resetService.findById(id);
  }

  @Get(':refreshToken')
  findByRefreshToken(@Param('refreshToken') refreshToken: string) {
    return this.resetService.findByRefreshToken(refreshToken);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResetDto: UpdateResetDto) {
    return this.resetService.update(id, updateResetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resetService.remove(id);
  }
}
