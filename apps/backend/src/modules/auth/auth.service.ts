// src/modules/auth/auth.service.ts

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UserAuthRepository } from './repositories/userAuth.repository';
import { RegisterAuthDto, LoginAuthDto } from '@vivero/shared';

interface JwtPayload {
  sub: string;
  tenantId: string;
  roleId: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly BCRYPT_ROUNDS = 12;
  private readonly jwtSecret: string;
  private readonly accessTokenExpiry = '15m';
  private readonly refreshTokenExpiry = '7d';

  constructor(
    private readonly userRepository: UserAuthRepository,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret =
      this.configService.get<string>('JWT_SECRET') ||
      'your-secret-key-change-me-in-production';
  }

  /**
   * Register a new user
   */
  async register(dto: RegisterAuthDto) {
    // 1. Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // 2. Validate tenant exists and is active
    const tenant = await this.userRepository.findTenantById(dto.tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant not found or inactive');
    }

    // 4. Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.BCRYPT_ROUNDS);

    // 5. Create user
    const user = await this.userRepository.createUser({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash,
      tenantId: dto.tenantId,
      roleId: dto.roleId || this.getDefaultRoleId(),
    });

    this.logger.log(
      `✅ User registered: ${user.email} | Tenant: ${user.tenantId}`,
    );

    // 6. Generate tokens
    const tokens = this.generateTokens({
      sub: user.id,
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

  /**
   * Login user
   */
  async login(dto: LoginAuthDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      // Use generic message to prevent user enumeration attacks
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify tenant is active
    const tenant = await this.userRepository.findTenantById(user.tenantId);
    if (!tenant) {
      throw new UnauthorizedException('Tenant is inactive');
    }

    this.logger.log(
      `✅ User logged in: ${user.email} | Tenant: ${user.tenantId}`,
    );

    // Generate tokens
    const tokens = this.generateTokens({
      sub: user.id,
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

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      tenantId: user.tenantId,
      roleId: user.roleId,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  /**
   * Refresh access token
   */
  async refreshTokens(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens({
      sub: user.id,
      tenantId: user.tenantId,
      roleId: user.roleId,
    });
  }

  /**
   * Generate JWT tokens
   */
  private generateTokens(payload: JwtPayload) {
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.accessTokenExpiry,
    });

    const refreshToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.refreshTokenExpiry,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  /**
   * Helper: Get default role for a tenant
   * TODO: Implement proper default role lookup
   */
  private getDefaultRoleId(): string {
    throw new ConflictException('roleId is required for registration');
  }
}
