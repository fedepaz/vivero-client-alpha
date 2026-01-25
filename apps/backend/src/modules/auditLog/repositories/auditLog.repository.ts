// src/modules/auditLog/repositories/auditLog.repository.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  AuditActionType,
  AuditLog,
  EntityType,
} from '../../../generated/prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';

@Injectable()
export class AuditLogRepository {
  constructor(private prisma: PrismaService) {}

  findAllByTenantId(
    tenantId: string,
    skip: number = 0,
    take: number = 50,
  ): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: {
        tenantId,
      },
      skip,
      take,
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  findAllByUserId(userId: string): Promise<AuditLog[] | null> {
    return this.prisma.auditLog.findMany({
      where: {
        userId,
      },
    });
  }

  async createAuditLog(data: {
    tenantId: string;
    userId: string;
    action: AuditActionType;
    entityType: EntityType;
    entityId: string;
    changes: string;
  }): Promise<AuditLog> {
    try {
      const auditLog = await this.prisma.auditLog.create({
        data,
      });

      return auditLog;
    } catch (error) {
      console.error('Error creating audit log:', error);
      throw new InternalServerErrorException('Error creating audit log');
    }
  }
}
