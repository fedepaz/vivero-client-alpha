// src/modules/permissions/permissions.module.ts

import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsRepository } from './repositories/permissions.repository';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  providers: [PermissionsService, PermissionsRepository, PermissionsGuard],
  exports: [PermissionsService, PermissionsGuard],
})
export class PermissionsModule {}
