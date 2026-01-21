// src/modules/auth/interfaces/jwt-payload.interface.ts

export interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  roleId: string;
}

export interface JwtRefreshPayload {
  sub: string;
  tenantId: string;
}
