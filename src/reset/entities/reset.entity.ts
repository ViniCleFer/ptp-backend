import { ResetPassword } from '@prisma/client';

export class ResetPasswordEntity implements ResetPassword {
  id: string;
  user_id: string;
  refresh_token: string;
  expires_date: Date;
}
