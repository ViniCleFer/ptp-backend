import { Injectable } from '@nestjs/common';
import { AuthChangePasswordDto } from './dto/auth-change-password.dto';
import { AuthCodeDto } from './dto/auth-code.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';

import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { AuthUpdatePasswordDto } from './dto/auth-update-password.dto';
import { AuthRepository } from './repositories/auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  signIn(createSignInDto: AuthSignInDto) {
    return this.repository.signIn(createSignInDto);
  }

  signUp(createSignUpDto: AuthSignUpDto) {
    return this.repository.signUp(createSignUpDto);
  }

  signInWithCode(codeDto: AuthCodeDto, email: string) {
    return this.repository.signInWithCode(codeDto, email);
  }

  signOut(userId: string) {
    return this.repository.signOut(userId);
  }

  forgotPassword(forgotPasswordDto: AuthForgotPasswordDto) {
    return this.repository.forgotPassword(forgotPasswordDto);
  }

  changePassword(
    changePasswordUserDto: AuthChangePasswordDto,
    refreshToken: string,
  ) {
    return this.repository.changePassword(changePasswordUserDto, refreshToken);
  }

  updatePassword(updatePasswordUserDto: AuthUpdatePasswordDto) {
    return this.repository.updatePassword(updatePasswordUserDto);
  }

  refresh(userId: string, refreshToken: string) {
    return this.repository.refresh(userId, refreshToken);
  }

  refreshBiometric(userEmail: string, refreshToken: string) {
    return this.repository.refreshBiometric(userEmail, refreshToken);
  }

  resendCode(code: string, email: string) {
    return this.repository.resendCode(code, email);
  }

  async resendInviteToUser(id: string) {
    return this.repository.resendInviteToUser(id);
  }

  fastLogin(createSignInDto: AuthSignInDto) {
    return this.repository.fastLogin(createSignInDto);
  }

  getInviteByUserId(id: string) {
    return this.repository.getInviteByUserId(id);
  }
}
