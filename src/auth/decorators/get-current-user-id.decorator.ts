import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../models/UserPayload';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserPayload;
    return user.sub;
  },
);
