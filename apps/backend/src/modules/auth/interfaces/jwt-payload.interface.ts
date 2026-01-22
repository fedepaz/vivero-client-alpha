// src/modules/auth/interfaces/jwt-payload.interface.ts

export interface JwtPayload {
  sub: string;
  username: string;
  tenantId: string;
}

export interface JwtRefreshPayload {
  sub: string;
  tenantId: string;
}
