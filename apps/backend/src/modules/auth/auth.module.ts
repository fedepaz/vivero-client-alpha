// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GlobalAuthGuard } from './guards/global-auth.guard';
import { AuthService } from './auth.service';
import { UserAuthRepository } from './repositories/userAuth.repository';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt-auth.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('config.jwt.secret', ' ');
        const expiresIn = configService.get<number>(
          'config.jwt.expiresIn',
          3600,
        );

        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  providers: [GlobalAuthGuard, AuthService, UserAuthRepository, JwtStrategy],

  exports: [GlobalAuthGuard, AuthService, PassportModule],
})
export class AuthModule {}
