import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserFromJwt } from '../models/UserFromJwt';

export const GetCurrentUser = createParamDecorator(
  (data: keyof UserFromJwt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
