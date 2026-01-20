// app/modules/auth/types/express.d.ts

import { AuthUser } from './auth-user.type';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
