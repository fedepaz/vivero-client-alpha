// src/modules/permissions/types/permission.type.ts

export type CrudAction = 'create' | 'read' | 'update' | 'delete';

export interface UserPermissions {
  [tableName: string]: {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    scope: 'NONE' | 'OWN' | 'ALL';
  };
}

export interface PermissionCheck {
  tableName: string;
  action: CrudAction;
  scope?: 'OWN' | 'ALL';
}
