// src/hooks/usePermission.ts

import { useAuthContext } from "@/features/auth/providers/AuthProvider";

export const usePermission = (tableName: string) => {
  const { permissions } = useAuthContext();

  const tablePermissions = permissions[tableName];
  return {
    canRead: tablePermissions?.canRead || false,
    canCreate: tablePermissions?.canCreate || false,
    canUpdate: tablePermissions?.canUpdate || false,
    canDelete: tablePermissions?.canDelete || false,
    scope: tablePermissions?.scope || "NONE",
  };
};
