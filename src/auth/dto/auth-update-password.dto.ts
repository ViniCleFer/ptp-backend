import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthUpdatePasswordDto {
  @ApiProperty({ description: 'Antiga Senha do usuário' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
    message:
      'A senha deve conter 1 maiúscula, 1 número e 1 caractere especial (como !, @, #, etc.)',
  })
  old_password: string;

  @ApiProperty({ description: 'Nova Senha do usuário' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
    message:
      'A senha deve conter 1 maiúscula, 1 número e 1 caractere especial (como !, @, #, etc.)',
  })
  password: string;

  @ApiProperty({ description: 'E-mail do usuário' })
  @IsEmail()
  email: string;
}
