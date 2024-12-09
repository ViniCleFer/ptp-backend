import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Param,
  Headers,
  Get,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthChangePasswordDto } from './dto/auth-change-password.dto';

import { GetCurrentUserId } from './decorators/get-current-user-id.decorator';
import { GetCurrentUser } from './decorators/get-current-user.decorator';

import { RefreshTokenGuard } from './guards/refresh-token.guard';

import { Public } from '../common/decorators/public.decorator';
import { AuthUpdatePasswordDto } from './dto/auth-update-password.dto';
import { AuthCodeDto } from './dto/auth-code.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() createSignInDto: AuthSignInDto) {
    return this.authService.signIn(createSignInDto);
  }

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() createSignUpDto: AuthSignUpDto) {
    return this.authService.signUp(createSignUpDto);
  }

  @Public()
  @Post('code')
  @HttpCode(HttpStatus.OK)
  signInWithCode(
    @Body() codeDto: AuthCodeDto,
    @Headers('email') email: string,
  ) {
    return this.authService.signInWithCode(codeDto, email);
  }

  @Public()
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.authService.signOut(userId);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('change-password/:refreshToken')
  changePassword(
    @Param('refreshToken') refreshToken: string,
    @Body() changePasswordUserDto: AuthChangePasswordDto,
  ) {
    return this.authService.changePassword(changePasswordUserDto, refreshToken);
  }

  @Post('update-password')
  updatePassword(@Body() authUpdatePasswordDto: AuthUpdatePasswordDto) {
    return this.authService.updatePassword(authUpdatePasswordDto);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(userId, refreshToken);
  }

  @Public()
  @Post('biometric-refresh')
  @HttpCode(HttpStatus.OK)
  refreshBiometricTokens(
    @Body('email') userEmail: string,
    @Headers('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshBiometric(userEmail, refreshToken);
  }

  @Public()
  @Post('resend-code')
  @HttpCode(HttpStatus.OK)
  resendCode(@Body() code: string, @Headers('email') email: string) {
    return this.authService.resendCode(code, email);
  }

  @Post('resend-invite/:id')
  @HttpCode(HttpStatus.OK)
  resendInviteToUser(@Param('id') id: string) {
    return this.authService.resendInviteToUser(id);
  }

  @Public()
  @Post('fast-login')
  @HttpCode(HttpStatus.OK)
  fastLogin(@Body() createSignInDto: AuthSignInDto) {
    return this.authService.fastLogin(createSignInDto);
  }

  @Get('get-invite/:id')
  getInviteByUserId(@Param('id') id: string) {
    return this.authService.getInviteByUserId(id);
  }
}
