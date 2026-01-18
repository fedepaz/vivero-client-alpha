// src/modules/auth/auth.controller.ts

import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto, LoginAuthDto } from '@vivero/shared';
import { AuthUser } from './types/auth-user.type';
import { Public } from 'src/shared/decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorators';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Public endpoint - register a new user
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterAuthDto) {
    this.logger.log(`📝 Registration attempt: ${dto.email}`);
    return this.authService.register(dto);
  }

  /**
   * POST /auth/login
   * Public endpoint - login with email and password
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginAuthDto) {
    this.logger.log(`🔑 Login attempt: ${dto.email}`);
    return this.authService.login(dto);
  }

  /**
   * GET /auth/profile
   * Protected endpoint - get current user profile
   */
  @Get('profile')
  async getProfile(@CurrentUser() user: AuthUser) {
    this.logger.debug(`👤 Profile request: ${user.email}`);
    return this.authService.getProfile(user.id);
  }

  /**
   * POST /auth/refresh
   * Protected endpoint - refresh access token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@CurrentUser() user: AuthUser) {
    this.logger.debug(`🔄 Token refresh: ${user.email}`);
    return this.authService.refreshTokens(user.id);
  }

  /**
   * POST /auth/logout
   * Protected endpoint - logout (client-side token deletion)
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: AuthUser) {
    this.logger.log(`👋 Logout: ${user.email}`);
    return { message: 'Logged out successfully' };
  }
}
