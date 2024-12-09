import { UserPayload } from './UserPayload';

export interface UserFromJwt extends UserPayload {
  refreshToken?: string;
}
