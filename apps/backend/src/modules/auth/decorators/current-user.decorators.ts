// src/modules/auth/decorators/current-user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../types/auth-user.type';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: AuthUser;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
