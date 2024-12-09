import { UserToken } from './UserToken';
import { UserEntity } from '../../users/entities/user.entity';

export interface UserSingUp extends UserToken {
  user: UserEntity;
  mfaRequired?: boolean;
}
