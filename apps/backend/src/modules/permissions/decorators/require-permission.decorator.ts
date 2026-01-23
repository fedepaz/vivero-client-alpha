// src/modules/permissions/guards/require-permission.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { RequirePermissionMetadata } from '../guards/permissions.guard';

export const REQUIRE_PERMISSION_KEY = 'requirePermission';

export const RequirePermission = (permission: RequirePermissionMetadata) => {
  SetMetadata(REQUIRE_PERMISSION_KEY, permission);
};
