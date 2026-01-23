// src/modules/permissions/interfaces/permission.interface.ts

export interface IPermissionRepository {
  findManyByUserId(userId: string): Promise<UserPermissionRecord[]>;
  upsert(
    userId: string,
    tableName: string,
    data: Partial<{
      canCreate: boolean;
      canRead: boolean;
      canUpdate: boolean;
      canDelete: boolean;
      scope: 'NONE' | 'OWN' | 'ALL';
    }>,
  ): Promise<void>;
  deleteByUserIdTableName(userId: string, tableName: string): Promise<void>;
}

export interface UserPermissionRecord {
  userId: string;
  tableName: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  scope: 'NONE' | 'OWN' | 'ALL';
}
