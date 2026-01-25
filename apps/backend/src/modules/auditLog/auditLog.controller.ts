/* eslint-disable @typescript-eslint/no-unsafe-argument */
// src/modules/auditLog/auditLog.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditLogService } from './auditLog.service';
import { RequirePermission } from '../permissions/decorators/require-permission.decorator';

@Controller('auditLog')
export class AuditLogController {
  constructor(private auditLogService: AuditLogService) {}

  @Get(':tenantId')
  @RequirePermission({ tableName: 'audit_logs', action: 'read', scope: 'ALL' })
  async getAllByTenantId(
    @Param('tenantId') tenantId: string,
    @Query('page ') page: number = 1,
    @Query('limit ') limit: number = 50,
  ) {
    const pageNum = Math.max(1, parseInt(page as any) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as any) || 50));
    return this.auditLogService.getAllByTenantId(tenantId, pageNum, limitNum);
  }

  @Get('user/:userId')
  @RequirePermission({ tableName: 'audit_logs', action: 'read', scope: 'ALL' })
  async getAllByUserId(@Param('userId') userId: string) {
    return this.auditLogService.getAllByUserId(userId);
  }
}
