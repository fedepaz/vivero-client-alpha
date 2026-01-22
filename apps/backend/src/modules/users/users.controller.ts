// app/modules/users/users.controller.ts

import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserProfileDto, UpdateUserProfileSchema } from '@vivero/shared';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation-pipe';
import { CurrentUser } from '../auth/decorators/current-user.decorators';
import { AuthUser } from '../auth/types/auth-user.type';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthUser) {
    return this.service.getProfile(user.id);
  }

  @Patch('me')
  updateProfile(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(UpdateUserProfileSchema))
    body: UpdateUserProfileDto,
  ) {
    return this.service.updateProfile(user.id, body);
  }

  @Get('all')
  getAllUsers() {
    return this.service.getAllUsers();
  }

  @Get('username/:username')
  getUserByUsername(
    @CurrentUser() user: AuthUser,
    @Param('username') username: string,
  ) {
    return this.service.getUserByUsername(username);
  }

  @Get('tenant/:tenantId')
  getUserByTenantId(
    @CurrentUser() user: AuthUser,
    @Param('tenant') tenantId: string,
  ) {
    return this.service.getUserByTenantId(tenantId);
  }
}
