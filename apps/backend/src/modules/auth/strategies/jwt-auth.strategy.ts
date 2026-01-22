// src/modules/auth/strategies/jwt-auth.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('config.jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: { sub: string; tenantId: string; roleId: string },
  ) {
    const user = await this.authService.validateUser(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User no longer active or exists');
    }

    // This return object is what @CurrentUser() receives
    return {
      id: user.id,
      username: user.username,
      tenantId: user.tenantId,
    };
  }
}
