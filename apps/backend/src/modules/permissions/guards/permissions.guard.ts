// src/modules/permissions/guards/permission.guard.ts

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../permissions.service';
import { AuthRequest } from '../../auth/interfaces/authRequest.interface';
import { IS_PUBLIC_KEY } from '../../../shared/decorators/public.decorator';
import { REQUIRE_PERMISSION_KEY } from '../decorators/require-permission.decorator';

export interface RequirePermissionMetadata {
  tableName: string;
  action: 'create' | 'read' | 'update' | 'delete';
  scope?: 'OWN' | 'ALL';
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // Skip if public endpoint
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug(`PUBLIC ENDPOINT ${request.url}`);
      return true; // Allow public endpoints to pass
    }

    // Get required permission metadata
    const required =
      this.reflector.getAllAndOverride<RequirePermissionMetadata>(
        REQUIRE_PERMISSION_KEY,
        [context.getHandler(), context.getClass()],
      );

    // If not public AND no permission metadata, DENY access
    if (!required) {
      this.logger.debug(`NO PERMISSION METADATA ${request.url}`);
      throw new ForbiddenException('Route requires permissions');
    }

    const userId = request?.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const allowed = await this.permissionsService.canPerform(userId, {
      tableName: required.tableName,
      action: required.action,
      scope: required.scope,
    });

    if (!allowed) {
      throw new ForbiddenException(
        `You do not have permission to ${required.action} on ${required.tableName}`,
      );
    }

    return true;
  }
}
