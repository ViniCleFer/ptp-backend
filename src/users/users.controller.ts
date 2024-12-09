import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Headers, Request } from '@nestjs/common/decorators';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpHelper } from 'src/app-logs/helpers/http.helper';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ status: 409, description: 'Conflito de e-mail' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Patch('disable-user/:id')
  disableUser(
    @Param('id') id: string,
    @Headers('companyId') companyId: string,
    @Headers('adminId') adminId: string,
    @Request() req,
  ) {
    const httpHelper = new HttpHelper();
    const ip = httpHelper.getIP(req);
    return this.usersService.disableUser(id, companyId, adminId, ip);
  }

  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Patch('remove/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
