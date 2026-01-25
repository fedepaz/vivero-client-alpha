// app/modules/users/users.controller.ts

import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserProfileDto, UpdateUserProfileSchema } from '@vivero/shared';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation-pipe';
import { CurrentUser } from '../auth/decorators/current-user.decorators';
import { AuthUser } from '../auth/types/auth-user.type';
import { RequirePermission } from '../permissions/decorators/require-permission.decorator';
import { PermissionsService } from '../permissions/permissions.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly permissionsService: PermissionsService,
  ) {}

  @Get('me')
  @RequirePermission({ tableName: 'users', action: 'read', scope: 'OWN' })
  getMe(@CurrentUser() user: AuthUser) {
    return this.service.getProfile(user.id);
  }

  @Patch('me')
  @RequirePermission({ tableName: 'users', action: 'update', scope: 'OWN' })
  updateProfile(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(UpdateUserProfileSchema))
    body: UpdateUserProfileDto,
  ) {
    return this.service.updateProfile(user.id, body);
  }

  @Get('all')
  @RequirePermission({ tableName: 'users', action: 'read' })
  async getAllUsers(@CurrentUser() user: AuthUser) {
    const canReadAll = await this.permissionsService.canPerform(user.id, {
      tableName: 'users',
      action: 'read',
      scope: 'ALL',
    });
    if (canReadAll) {
      return this.service.getAllUsers();
    } else {
      return [await this.service.gerUserById(user.id)];
    }
  }

  @Get('username/:username')
  @RequirePermission({ tableName: 'users', action: 'read', scope: 'ALL' })
  getUserByUsername(
    @CurrentUser() user: AuthUser,
    @Param('username') username: string,
  ) {
    return this.service.getUserByUsername(username);
  }

  @Get('tenant/:tenantId')
  @RequirePermission({ tableName: 'users', action: 'read', scope: 'ALL' })
  getUserByTenantId(
    @CurrentUser() user: AuthUser,
    @Param('tenant') tenantId: string,
  ) {
    return this.service.getUserByTenantId(tenantId);
  }
}
