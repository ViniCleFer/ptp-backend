import { UserNivel, User, UserStatus } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  password: string;
  status: UserStatus;
  hashedRefreshToken: string | null;
  profile: UserNivel;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date;
}
