import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthChangePasswordDto {
  @ApiProperty({ description: 'Nova sSenha do usuário' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
    message:
      'A senha deve conter 1 maiúscula, 1 número e 1 caractere especial (como !, @, #, etc.)',
  })
  password: string;
}
