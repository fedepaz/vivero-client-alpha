// src/modules/permissions/permissions.controller.ts

import { Controller, Get } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { RequirePermission } from './decorators/require-permission.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorators';
import { AuthUser } from '../auth/types/auth-user.type';
import { UserPermissions } from '@vivero/shared';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('me')
  @RequirePermission({ tableName: 'users', action: 'read', scope: 'OWN' })
  async getMyPermissions(
    @CurrentUser() user: AuthUser,
  ): Promise<UserPermissions> {
    const perms = await this.permissionsService.getUserPermissions(user.id);
    return perms;
  }
}
