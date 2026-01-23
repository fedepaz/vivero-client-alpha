// src/permissions/permissions.service.ts

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PermissionCheck, UserPermissions } from './types/permission.type';
import { PermissionsRepository } from './repositories/permissions.repository';

type ActionKey = 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete';

@Injectable()
export class PermissionsService {
  // Allowed table names = SQL table names from @@map
  private readonly logger = new Logger(PermissionsService.name);
  private readonly ALLOWED_TABLES = [
    'audit_logs',
    'enums',
    'messages',
    'tenants',
    'users',
    // Add future entity tables here using their @@map name
  ] as const;

  private isAllowedTable(
    tableName: string,
  ): tableName is (typeof this.ALLOWED_TABLES)[number] {
    return (this.ALLOWED_TABLES as readonly string[]).includes(tableName);
  }
  constructor(private permissionsRepo: PermissionsRepository) {}

  /**
   * Validate table name
   */
  validateTableName(
    tableName: string,
  ): asserts tableName is (typeof this.ALLOWED_TABLES)[number] {
    if (!this.isAllowedTable(tableName)) {
      this.logger.warn(`Invalid table name: ${tableName}`);
      throw new BadRequestException(`Invalid table name: ${tableName}`);
    }
  }

  /**
   * Get all permissions for a user (with caching)
   */
  async getUserPermissions(userId: string): Promise<UserPermissions> {
    // TODO: Implement caching
    const records = await this.permissionsRepo.findManyByUserId(userId);

    const map: UserPermissions = {};
    for (const r of records) {
      map[r.tableName] = {
        canCreate: r.canCreate,
        canRead: r.canRead,
        canUpdate: r.canUpdate,
        canDelete: r.canDelete,
        scope: r.scope,
      };
    }

    this.logger.debug(`User permissions: ${JSON.stringify(map)}`);
    return map;
  }

  /**
   * Check if user can perform action on table
   */
  async canPerform(userId: string, check: PermissionCheck): Promise<boolean> {
    this.validateTableName(check.tableName);

    const perms = await this.getUserPermissions(userId);
    const tablePerm = perms[check.tableName];

    if (!tablePerm) return false;
    const actionKey =
      `can${check.action.charAt(0).toUpperCase() + check.action.slice(1)}` as const;

    if (!(actionKey in tablePerm)) {
      return false; // Should never happen, but safe
    }

    const hasAction = tablePerm[actionKey as ActionKey];

    if (!hasAction) return false;

    if (check.scope === 'ALL' && tablePerm.scope !== 'ALL') return false;
    if (check.scope === 'OWN' && tablePerm.scope === 'NONE') return false;

    this.logger.debug(`User can perform ${check.action} on ${check.tableName}`);
    return true;
  }

  /**
   * Check if user can access specific record (row-level check)
   */
  async canAccessRecord(
    userId: string,
    tableName: string,
    action: 'read' | 'update' | 'delete',
    recordOwnerId: string,
  ): Promise<boolean> {
    this.validateTableName(tableName);

    const perms = await this.getUserPermissions(userId);
    const tablePerm = perms[tableName];

    if (!tablePerm) return false;
    if (!tablePerm[`can${action.charAt(0).toUpperCase() + action.slice(1)}`])
      return false;

    if (tablePerm.scope === 'ALL') return true; // Can access all records
    if (tablePerm.scope === 'OWN') return recordOwnerId === userId; // Can only access own records

    this.logger.debug(`User can access ${action} on ${tableName}`);

    return false; // NONE scope
  }

  /**
   * Grant permission to user
   */
  async grantPermission(
    userId: string,
    tableName: string,
    data: {
      canCreate?: boolean;
      canRead?: boolean;
      canUpdate?: boolean;
      canDelete?: boolean;
      scope?: 'NONE' | 'OWN' | 'ALL';
    },
  ): Promise<void> {
    this.validateTableName(tableName);

    this.logger.debug(`Granting permissions for ${userId} on ${tableName}`);
    await this.permissionsRepo.upsert(userId, tableName, data);
  }

  /**
   * Revoke all permissions for a table
   */
  async revokeTablePermissions(
    userId: string,
    tableName: string,
  ): Promise<void> {
    this.validateTableName(tableName);

    this.logger.debug(`Revoking permissions for ${userId} on ${tableName}`);
    await this.permissionsRepo.deleteByUserIdTableName(userId, tableName);
  }
}
