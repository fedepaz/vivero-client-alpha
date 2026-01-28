// app/modules/users/users.controller.ts

import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
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
    return this.service.updateProfile(user.username, body);
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
  getUserByUsername(@Param('username') username: string) {
    return this.service.getUserByUsername(username);
  }

  @Get('tenant/:tenantId')
  @RequirePermission({ tableName: 'users', action: 'read', scope: 'ALL' })
  getUserByTenantId(@Param('tenant') tenantId: string) {
    return this.service.getUserByTenantId(tenantId);
  }

  @Patch(':username')
  @RequirePermission({ tableName: 'users', action: 'update' })
  async updateUserByUsername(
    @CurrentUser() user: AuthUser,
    @Param('username') username: string,
    @Body(new ZodValidationPipe(UpdateUserProfileSchema))
    body: UpdateUserProfileDto,
  ) {
    const canUpdateAll = await this.permissionsService.canPerform(user.id, {
      tableName: 'users',
      action: 'update',
      scope: 'ALL',
    });

    if (canUpdateAll) {
      return this.service.updateProfile(username, body);
    } else {
      if (user.username === username) {
        return this.service.updateProfile(username, body);
      } else {
        throw new ForbiddenException(
          'No tiene permisos para actualizar el usuario',
        );
      }
    }
  }

  @Delete(':username')
  @RequirePermission({ tableName: 'users', action: 'delete', scope: 'ALL' })
  async deleteUserByUsername(
    @CurrentUser() user: AuthUser,
    @Param('username') username: string,
  ) {
    return this.service.softDeleteUserByUsername(username, user.id);
  }

  @Get('allAdmin')
  @RequirePermission({ tableName: 'users', action: 'delete', scope: 'ALL' })
  async getAllUsersAdmin(@CurrentUser() user: AuthUser) {
    const canReadAll = await this.permissionsService.canPerform(user.id, {
      tableName: 'users',
      action: 'delete',
      scope: 'ALL',
    });
    if (canReadAll) {
      return this.service.getAllUsersAdmin();
    } else {
      throw new ForbiddenException(
        'No tiene permisos para ver esta información',
      );
    }
  }
}
