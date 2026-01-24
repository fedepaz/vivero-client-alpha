// src/modules/permissions/repositories/permissions.repository.ts

import { Injectable } from '@nestjs/common';
import {
  IPermissionRepository,
  UserPermissionRecord,
} from '../interfaces/permission.interface';
import { PrismaService } from '../../../infra/prisma/prisma.service';

@Injectable()
export class PermissionsRepository implements IPermissionRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByUserId(userId: string): Promise<UserPermissionRecord[]> {
    const records = await this.prisma.userPermission.findMany({
      where: { userId },
      select: {
        userId: true,
        tableName: true,
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
        scope: true,
      },
    });

    return records as UserPermissionRecord[];
  }

  async upsert(
    userId: string,
    tableName: string,
    data: Partial<{
      canCreate: boolean;
      canRead: boolean;
      canUpdate: boolean;
      canDelete: boolean;
      scope: 'NONE' | 'OWN' | 'ALL';
    }>,
  ): Promise<void> {
    await this.prisma.userPermission.upsert({
      where: { userId_tableName: { userId, tableName } },
      create: { userId, tableName, ...data },
      update: data,
    });
  }

  async deleteByUserIdTableName(
    userId: string,
    tableName: string,
  ): Promise<void> {
    await this.prisma.userPermission.delete({
      where: { userId_tableName: { userId, tableName } },
    });
  }
}
