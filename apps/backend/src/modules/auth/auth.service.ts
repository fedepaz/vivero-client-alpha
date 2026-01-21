// src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserAuthRepository } from './repositories/userAuth.repository';
import {
  LoginAuthDto,
  AuthResponseDto,
  TokensDto,
  RegisterAuthDto,
} from '@vivero/shared';
import { ConfigService } from '@nestjs/config';
import {
  JwtPayload,
  JwtRefreshPayload,
} from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly BCRYPT_ROUNDS = 12;

  constructor(
    private readonly userAuthRepo: UserAuthRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(userId: string) {
    return this.userAuthRepo.findById(userId);
  }

  async register(dto: RegisterAuthDto): Promise<AuthResponseDto> {
    // check if user exists
    const existingUser = await this.userAuthRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    //validate tenantId
    const tenant = await this.userAuthRepo.findTenantById(dto.tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    //validate roleId
    const role = await this.userAuthRepo.findRoleById(dto.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // hash password
    const passwordHash = await bcrypt.hash(dto.password, this.BCRYPT_ROUNDS);

    // create user
    const user = await this.userAuthRepo.createUser({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash,
      tenantId: dto.tenantId,
      roleId: dto.roleId,
    });

    const userPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roleId: user.roleId,
    };

    // generate tokens
    const tokens = await this.generateTokens(userPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
        roleId: user.roleId,
      },
      ...tokens,
    };
  }

  async login(dto: LoginAuthDto): Promise<AuthResponseDto> {
    // validate email
    const user = await this.userAuthRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials - email');
    }

    // validate password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials - password');
    }

    // check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    // generate tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roleId: user.roleId,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
        roleId: user.roleId,
      },
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokensDto> {
    try {
      const payload = this.jwtService.verify<JwtRefreshPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('config.jwt.refreshSecret'),
      });

      // check if user exists
      const user = await this.userAuthRepo.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // generate tokens
      return this.generateTokens({
        sub: user.id,
        email: user.email,
        tenantId: user.tenantId,
        roleId: user.roleId,
      });
    } catch (error) {
      this.logger.error('Error refreshing tokens:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  // Helper to generate tokens using the injected JwtService
  private async generateTokens(payload: JwtPayload): Promise<TokensDto> {
    // Cast to Record<string, any> to satisfy JwtService typing
    const accessTokenPayload: Record<string, any> = {
      sub: payload.sub,
      email: payload.email,
      tenantId: payload.tenantId,
      roleId: payload.roleId,
    };

    const refreshTokenPayload: Record<string, any> = {
      sub: payload.sub,
      tenantId: payload.tenantId,
    };

    const accessTokenSecret =
      this.config.getOrThrow<string>('config.jwt.secret');
    const accessTokenExpiresIn =
      this.config.get<number>('config.jwt.expiresIn') || '15m';
    const refreshTokenSecret = this.config.getOrThrow<string>(
      'config.jwt.refreshSecret',
    );
    const refreshTokenExpiresIn =
      this.config.get<number>('config.jwt.refreshExpiresIn') || '7d';

    const nodeEnv = this.config.getOrThrow<string>('config.environment');

    if (nodeEnv === 'development') {
      this.logger.debug('--- Generating Tokens ---');
      this.logger.debug(
        `Access Token Payload: ${JSON.stringify(accessTokenPayload)}`,
      );
      this.logger.debug(`Access Token Secret: ${accessTokenSecret}`);
      this.logger.debug(`Access Token Expires In: ${accessTokenExpiresIn}`);
      this.logger.debug('-------------------------');
      this.logger.debug(
        `Refresh Token Payload: ${JSON.stringify(refreshTokenPayload)}`,
      );
      this.logger.debug(`Refresh Token Secret: ${refreshTokenSecret}`);
      this.logger.debug(`Refresh Token Expires In: ${refreshTokenExpiresIn}`);
      this.logger.debug('--- End Generating Tokens ---');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: accessTokenSecret,
        expiresIn: accessTokenExpiresIn,
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: refreshTokenSecret,
        expiresIn: refreshTokenExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
