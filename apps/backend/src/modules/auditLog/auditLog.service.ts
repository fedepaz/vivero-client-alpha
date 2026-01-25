// src/modules/auditLog/auditLog.service.ts

import { Injectable } from '@nestjs/common';
import { AuditLogRepository } from './repositories/auditLog.repository';

@Injectable()
export class AuditLogService {
  constructor(private auditLogRepository: AuditLogRepository) {}

  async getAllByTenantId(
    tenantId: string,
    page: number = 1,
    limit: number = 50,
  ) {
    const skip = (page - 1) * limit;
    return this.auditLogRepository.findAllByTenantId(tenantId, skip, limit);
  }

  async getAllByUserId(userId: string) {
    return this.auditLogRepository.findAllByUserId(userId);
  }
}
