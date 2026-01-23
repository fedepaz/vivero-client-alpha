// src/modules/auth/interfaces/authRequest.interface.ts

import { AuthUser } from '../types/auth-user.type';

export interface AuthRequest extends Request {
  user: AuthUser;
}
